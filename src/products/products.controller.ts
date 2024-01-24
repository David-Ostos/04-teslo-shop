import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, ParseUUIDPipe, Query,
  UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FilesInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

// file module
import { fileFilter } from '../files/helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from '../files/helpers';

// auth module
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces';
import { GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@ApiTags('Products')
@Controller('products')
// @Auth() // al poner el decorador Auth() aqui hace que todos los endpoint necesiten estar autenticados
export class ProductsController {
  constructor (private readonly productsService: ProductsService) {}

  // para crear producto sin imagen
  @Post()
  @Auth( ValidRoles.admin )
  async create (@Body() createProductDto: CreateProductDto,
    @GetUser() user: User) {
    return await this.productsService.create(createProductDto, user);
  }


  // para crear producto con imagen
  @Post('images')
  @Auth( ValidRoles.admin )
  @UseInterceptors( FilesInterceptor('files', 5, {
    fileFilter,
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  async createWithImage (
  @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User
  ) {
    return await this.productsService.createWithImg(createProductDto, files, user);
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
  @Auth( ValidRoles.admin )
  async update (
  // eslint-disable-next-line @typescript-eslint/indent
    @Param('id', new ParseUUIDPipe({ version: '4' }) ) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {

    return await this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth( ValidRoles.admin )
  async remove (@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.productsService.remove(id);
  }

  @Delete('deleteAll')
  @Auth( ValidRoles.admin )
  async removeAll (@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.productsService.remove(id);
  }
}
