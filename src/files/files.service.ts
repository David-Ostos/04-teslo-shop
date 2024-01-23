import { existsSync } from 'fs'; // para verificar si existe el file
import { join } from 'path'; // para obtener un path

import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

  getStaticProductImage ( imageName: string) {

    const pathPro = join(__dirname, '../../static/products', imageName);
    const pathUp = join(__dirname, '../../static/uploads', imageName);

    if (existsSync(pathPro)) {
      return pathPro;
    } else if (existsSync(pathUp)) {
      return pathUp;
    } else {
      throw new BadRequestException(`No product found with image ${imageName}`);
    }
  }
}
