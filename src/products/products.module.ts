import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';


import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),

    ConfigModule,

    AuthModule
  ],
  exports: [ProductsService]
})
export class ProductsModule {}
