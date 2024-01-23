import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';


// eslint-disable-next-line @typescript-eslint/ban-types
export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

  // console.log( { file });

  const fileExptension = file.mimetype.split('/')[1]; // el split corta el string definido en el primer termino y el otro es que vamos a obtener en este caso el 2do termino

  if ( !file.mimetype) {
    return callback(
      new BadRequestException('File not mimetype')
    );
  }

  const fileName = `${ uuid() }.${ fileExptension }`;





  callback( null, fileName);

};
