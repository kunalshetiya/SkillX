import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.enableCors();

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Versioning (e.g., /api/v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('SkillX API')
    .setDescription('The SkillX Barter & Mentorship API')
    .setVersion('1.0')
    .addTag('skillx')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
