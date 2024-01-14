import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid'

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

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    })

    return product;
  }

  async findOne(term: string) {

    let product: Product;
    term = term
      .toLowerCase()
      .trim()
    
    if( isUUID(term) ){
      product = await this.productRepository.findOneBy({ id: term })
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
      .where(`title =:title or slug =:slug`, {
        title: term,
        slug: term
      }).getOne()
    }

    
    // const product = await this.productRepository.findOneBy({ id: term})
    if ( !product){
      throw new NotFoundException(`Product with term: ${term} not found`)
    }

    return product;
  }

  async update(id:string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    })
  
    if( !product ) throw new NotFoundException(`Product with id: ${id} not found`)

    try{
      await this.productRepository.save(product)
      return product
    }catch(error){

      this.handleDBException(error)
    }

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
