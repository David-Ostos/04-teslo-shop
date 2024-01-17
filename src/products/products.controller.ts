import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, ParseUUIDPipe, Query
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor (private readonly productsService: ProductsService) {}

  @Post()
  async create (@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  async findAll ( @Query() paginationDto: PaginationDto) {
    // console.log(paginationDto);
    return await this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne (@Param('term') term: string) {
    return await this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  async update (
  // eslint-disable-next-line @typescript-eslint/indent
    @Param('id', new ParseUUIDPipe({ version: '4' }) ) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {

    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove (@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.productsService.remove(id);
  }
}
