import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column('text', {
    unique: true
  })
    title: string;

  @Column('float', {
    default: 0
  })
    price: number;

  @Column({
    type: 'text',
    nullable: true
  })
    description: string;

  @Column('text', {
    unique: true
  })
    slug: string;

  @Column('int', {
    default: 0
  })
    stock: number;

  @Column('text', {
    array: true
  })
    sizes: string[];

  @Column('text')
    gender: string;

  @Column('text', {
    array: true,
    default: []
  })
    tags: string[];

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
