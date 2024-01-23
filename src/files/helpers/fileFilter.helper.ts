import { BadRequestException } from '@nestjs/common';


// eslint-disable-next-line @typescript-eslint/ban-types
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {


  if ( !file ) return callback( new BadRequestException('File is empty'), false );

  const fileExptension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'png', 'jpeg', 'gif', 'webp'];

  if ( validExtensions.includes( fileExptension )) {
    return callback( null, true );
  }

  if ( !validExtensions.includes( fileExptension )) {
    return callback( new BadRequestException(`Make sure that the file is an image, and that meets the permitted extensions (${validExtensions.toString()}) `), false);
  }

  callback( null, false);

};
