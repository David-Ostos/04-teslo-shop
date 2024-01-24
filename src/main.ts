import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap () {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With,Accept-Language',
    optionsSuccessStatus: 204,
    credentials: true
  });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('Teslo Shop Endpoint')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT;

  const server = await app.listen(port);

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  server;

  logger.log(`App runnings in http://localhost:${server.address().port}}`);
}
void bootstrap();
