import fs from "node:fs";
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
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter";
import { registerSpaFallback } from "./common/spa/serve-spa";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false,
    bodyParser: false,
  });
  const config = app.get(ConfigService);
  const origins = String(config.get<string>("FRONTEND_ORIGINS") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  app.setGlobalPrefix("api");
  const expressApp = app.getHttpAdapter().getInstance() as express.Express;
  expressApp.set("trust proxy", config.get<boolean>("TRUST_PROXY") || false);
  expressApp.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          connectSrc: ["'self'", ...origins],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));
  app.use(cookieParser());
  app.use(compression());
  const mediaPath = path.resolve(
    config.get<string>("MEDIA_STORAGE_PATH") ||
      path.join(process.cwd(), "storage", "media"),
  );
  fs.mkdirSync(mediaPath, { recursive: true });
  app.use(
    "/media",
    express.static(mediaPath, {
      maxAge: "1d",
      setHeaders(response) {
        response.setHeader("Cache-Control", "public, max-age=86400");
      },
    }),
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
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.enableShutdownHooks();

  const prisma = app.get(PrismaService);
  registerSpaFallback(app, prisma);
  const port = Number(config.get<number>("PORT") || 8000);
  await app.listen(port, "0.0.0.0");
}

bootstrap();
