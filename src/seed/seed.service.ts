import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor (
    private readonly productService: ProductsService
  ) {}

  async runSeed () {

    await this.inserNewProducts();

    return 'SEED EXECUTED ';

  }

  private async inserNewProducts () {

    await this.productService.deleteAllProduct();

    const seedProducts = initialData.products;

    const insertPromises = [];

    seedProducts.forEach( product => {
      insertPromises.push( this.productService.create( product));
    });

    await Promise.all(insertPromises);

    return true;

  }

}
