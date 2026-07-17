import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { PrismaService } from "./common/prisma/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const config = app.get(ConfigService);
  const origins = String(config.get<string>("FRONTEND_ORIGINS") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.use(compression());
  app.use("/media", express.static(path.resolve(process.cwd(), "storage", "media")));
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
    })
  );
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);

  const port = Number(config.get<number>("PORT") || 8000);
  await app.listen(port);
}

bootstrap();
