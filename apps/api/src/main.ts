import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { PrismaService } from "./common/prisma/prisma.service.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prisma Shutdown Hooks
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Security
  app.enableCors();

  // Global Prefix
  app.setGlobalPrefix("api");

  const logger = new Logger("Bootstrap");
  if (!process.env.CLERK_SECRET_KEY) {
    logger.error("CLERK_SECRET_KEY is not defined in environment variables!");
  } else {
    logger.log("CLERK_SECRET_KEY is loaded.");
  }

  // Versioning (e.g., /api/v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
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
    .setTitle("SkillX API")
    .setDescription("The SkillX Barter & Mentorship API")
    .setVersion("1.0")
    .addServer("/api/v1", "Version 1")
    .addTag("skillx")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
