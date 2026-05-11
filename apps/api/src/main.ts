import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { PrismaService } from "./common/prisma/prisma.service.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  // Health Check (Fastest response for Render/Vercel)
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get("/health", (req: any, res: any) => {
    res.status(200).send("OK");
  });

  // Prisma Shutdown Hooks
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Security - Production CORS
  const frontendUrl = process.env.FRONTEND_URL;
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:4000",
        frontendUrl,
      ].filter(Boolean);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix("api");

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

  const port = process.env.PORT || 4000;
  await app.listen(port, "0.0.0.0");
  logger.log(`Application is running on: http://0.0.0.0:${port}/api/v1`);
}
bootstrap();
