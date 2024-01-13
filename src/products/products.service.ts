import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
      private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    
   try {
    
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);

    return product;

   } catch (error) {

    this.handleDBException(error)

   }

  }

  async findAll() {

    const product = await this.productRepository.find()

    return product;
  }

  async findOne(term: string) {

/*     let product: Product;
    
    if(!product){
      product = await this.productRepository.findOneBy({ slug: term})
    }
    
    if(!product){
      product = await this.productRepository.findOneBy({ id: term })
    }
    
    if (!product){
      throw new NotFoundException(`Product with term: ${term} not found `)
    } */
    
    const product = await this.productRepository.findOneBy({ id: term})
    if ( !product){
      throw new NotFoundException(`Product with term: ${term} not found`)
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {

    const product = await this.findOne(id);

    this.productRepository.remove(product);

    return `The product with the ID: ${id} has been successfully removed`;
  }

  private handleDBException( error: any){
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

}
