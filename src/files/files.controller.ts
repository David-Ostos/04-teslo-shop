import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { diskStorage } from 'multer';
import { Response } from 'express';


import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';

// eslint-disable-next-line @typescript-eslint/semi
@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor (
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage (
  @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter,
    // limits: { fileSize: 1000 },
    storage: diskStorage({ // es para agregar la direccion donde se va a almacenar el archivo
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductFile (
  @UploadedFile() file: Express.Multer.File) { /* new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 25000000 }),new FileTypeValidator({ fileType: 'image/jpeg' })]}) */

    if ( !file ) throw new BadRequestException('File is empty');
    /*
    if( this.configService.get('HOST_API')){

    }
    */
    if (!this.configService.get('HOST_API')) {
      throw new InternalServerErrorException('environment "HOST_API" is undefined');

    }

    const secureUrl = `${ this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl,
      filename: file.filename
    };
  }

}
