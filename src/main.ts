import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT;

  const server = await app.listen(port);

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  server;

  logger.log(`App runnings in http://localhost:${server.address().port}}`);
}
void bootstrap();
