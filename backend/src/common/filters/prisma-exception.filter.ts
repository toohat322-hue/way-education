import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Response } from "express";

/**
 * Global exception filter that translates Prisma-specific errors into
 * meaningful HTTP responses instead of generic 500 Internal Server Errors.
 *
 * - P2025 (Record not found)    → 404 Not Found
 * - P2002 (Unique constraint)   → 409 Conflict
 * - P2003 (Foreign key failure) → 400 Bad Request
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case "P2025": {
        // Record to update/delete does not exist
        const model =
          (exception.meta as Record<string, any>)?.modelName || "Record";
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: `${model} not found`,
          error: "Not Found",
        });
        break;
      }

      case "P2002": {
        // Unique constraint violation
        const target = (exception.meta as Record<string, any>)?.target;
        const fields = Array.isArray(target) ? target.join(", ") : "field";
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: `A record with the same ${fields} already exists`,
          error: "Conflict",
        });
        break;
      }

      case "P2003": {
        // Foreign key constraint failure
        const fieldName =
          (exception.meta as Record<string, any>)?.field_name || "reference";
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Related ${fieldName} does not exist`,
          error: "Bad Request",
        });
        break;
      }

      default: {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "An unexpected database error occurred",
          error: "Internal Server Error",
        });
        break;
      }
    }
  }
}
