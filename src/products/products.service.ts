import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Product, ProductImage } from './entities';

import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
      private readonly productImagesRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource

  ){}

  async create(createProductDto: CreateProductDto) {
    
   try {
    
    const { images = [], ...productDetails} = createProductDto
    const product = this.productRepository.create({ 
      ...productDetails,
      images: images.map( image => this.productImagesRepository.create( { url: image}))
    });

    await this.productRepository.save(product);

    return {...product, images};

   } catch (error) {

    this.handleDBException(error)

   }

  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    return product.map( ({ images, ...rest }) => ({
      ...rest,
      images: images.map( img => img.url)
    }));
  }

  async findOne(term: string) {

    let product: Product;
    term = term
      .toLowerCase()
      .trim()
    
    if( isUUID(term) ){
      product = await this.productRepository.findOneBy({ id: term })
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); // se le coloca el alias a la tabla
      product = await queryBuilder
      .where(`title =:title or slug =:slug`, {
        title: term,
        slug: term
      })
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }

    
    // const product = await this.productRepository.findOneBy({ id: term})
    if ( !product){
      throw new NotFoundException(`Product with term: ${term} not found`)
    }

    // return { ...product, images: product.images.map(img => img.url)}

    return product;
  }

  async findOnePlain( term: string){
    const { images = [], ...rest} = await this.findOne( term );
    return {
      ...rest, 
      images: images.map(img => img.url)
    }
  }


  async update(id:string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto

    const product = await this.productRepository.preload({ id, ...toUpdate })
  
    if( !product ) throw new NotFoundException(`Product with id: ${id} not found`)

    //create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // iniicar la transaccion


    try{

      if( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id }})

        product.images = images.map(
          image => this.productImagesRepository.create( { url: image})
        )
      } else {
        // ???
      }

      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release()

      // await this.productRepository.save(product)

      return this.findOnePlain( id )
    }catch(error){

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBException(error)
    }

  }

  async remove(id: string) {

    const product = await this.findOne(id);

    await this.productRepository.remove(product);

    return `The product with the ID: ${id} has been successfully removed`;
  }

  private handleDBException( error: any){
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  async deleteAllProduct() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      
      return await query
        .delete()
        .where({})
        .execute()

    } catch (error) {
      this.handleDBException(error);
    }
  }

}
