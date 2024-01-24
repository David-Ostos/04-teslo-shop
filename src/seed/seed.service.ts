import * as fs from 'fs';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor (
    private readonly productService: ProductsService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ) {}

  async runSeed () {

    await this.deleteAll();

    const adminUser = await this.insertUsers();

    await this.inserNewProducts( adminUser );

    return 'SEED EXECUTED ';
  }
  /*
  private async deleteTables () {

    await this.deleteAll();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  } */


  async deleteAll () {
    await this.productService.deleteAllProduct();

    const directory = join(__dirname, '../../static/uploads');

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        if (!file.startsWith('.')) {
          fs.unlink(join(directory, file), err => {
            if (err) throw err;
          });
        }
      }
    });

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers () {
    const seedUsers = initialData.users;

    const users: User[] = [];

    // seedUsers.forEach( user => {
    //   const { password, ...rest } = user;
    //   users.push( this.userRepository.create({
    //     ...rest,
    //     password: bcrypt.hashSync(password, 10)
    //   }));
    // });

    seedUsers.forEach( user => {

      users.push( this.userRepository.create( user ));
    });

    await this.userRepository.save( users );

    return users[0];

  }

  private async inserNewProducts ( user: User ) {

    await this.productService.deleteAllProduct();

    const seedProducts = initialData.products;

    const insertPromises = [];

    seedProducts.forEach( product => {
      insertPromises.push( this.productService.create( product, user ));
    });

    await Promise.all(insertPromises);

    return true;

  }

}
