import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '04286241-cecb-4eac-aff8-d4cad4d250ab',
    description: 'UUID of the product',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiProperty({
    example: 'Shirt Mountain 1k',
    description: 'Title of the product',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
    title: string;

  @ApiProperty({
    example: 10,
    description: 'Price of the product',
    default: 0
  })
  @Column('float', {
    default: 0
  })
    price: number;

  @ApiProperty({
    example: 'De criaturas deja queman tránsito mueven, desnudo tierra en y la es, desgarrados los atrás muertos la el de me.',
    description: 'Description of the product',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    nullable: true
  })
    description: string;

  @ApiProperty({
    example: 'shirt_mountain_1k',
    description: 'Product SLUG - for SEO ',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
    slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock ',
    default: 0
  })
  @Column('int', {
    default: 0
  })
    stock: number;

  @ApiProperty({
    example: ['M', 'S', 'XL', 'XXL'],
    description: 'Product sizes'
  })
  @Column('text', {
    array: true,
    default: []
  })
    sizes: string[];

  @ApiProperty({
    example: 'woman',
    description: 'Product gender '
  })
  @Column('text')
    gender: string;

  @ApiProperty({
    example: ['shirt'],
    description: 'Product tags '
  })
  @Column('text', {
    array: true,
    default: []
  })
    tags: string[];

  @ApiProperty({
    example: [
      '1741416-00-A_0_2000.jpg',
      '1741416-00-A_1.jpg'
    ],
    description: 'Product images '
  })
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
    images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
    user: User;

  @BeforeInsert()
  checkTitleInsert () {
    this.title = this.title
      .trim()
      .toLowerCase();/*
      .replace(/\b\w/g, (c) => c.toUpperCase()); */
  }

  @BeforeInsert()
  checkSlugInsert () {

    if ( !this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .trim()
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
      .replaceAll('"', '');
  }

  @BeforeUpdate()
  checkTitleUpdate () {
    this.title = this.title
      .toLowerCase()
      .trim();
  }

  @BeforeUpdate()
  checkSlugUpdate () {

    this.slug = this.slug
      .trim()
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('-', '_')
      .replaceAll("'", '')
      .replaceAll('"', '');
  }

}
