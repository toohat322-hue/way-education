import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PrismaService } from "../../common/prisma/prisma.service";
import { MediaQueryDto, UpdateMediaDto } from "./dto/media.dto";

type UploadedFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

type AllowedFile = {
  extensions: string[];
  isValid: (buffer: Buffer) => boolean;
};

const ALLOWED_FILES: Record<string, AllowedFile> = {
  "image/jpeg": {
    extensions: [".jpg", ".jpeg"],
    isValid: (buffer) =>
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff,
  },
  "image/png": {
    extensions: [".png"],
    isValid: (buffer) =>
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex")),
  },
  "image/gif": {
    extensions: [".gif"],
    isValid: (buffer) =>
      buffer.subarray(0, 6).equals(Buffer.from("GIF87a")) ||
      buffer.subarray(0, 6).equals(Buffer.from("GIF89a")),
  },
  "image/webp": {
    extensions: [".webp"],
    isValid: (buffer) =>
      buffer.subarray(0, 4).equals(Buffer.from("RIFF")) &&
      buffer.subarray(8, 12).equals(Buffer.from("WEBP")),
  },
  "application/pdf": {
    extensions: [".pdf"],
    isValid: (buffer) => buffer.subarray(0, 5).equals(Buffer.from("%PDF-")),
  },
  "video/mp4": {
    extensions: [".mp4"],
    isValid: (buffer) => buffer.subarray(4, 8).equals(Buffer.from("ftyp")),
  },
  "video/webm": {
    extensions: [".webm"],
    isValid: (buffer) =>
      buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])),
  },
};

function isUploadedFile(file: unknown): file is UploadedFile {
  return (
    typeof file === "object" &&
    file !== null &&
    Buffer.isBuffer((file as UploadedFile).buffer) &&
    typeof (file as UploadedFile).mimetype === "string" &&
    typeof (file as UploadedFile).originalname === "string" &&
    typeof (file as UploadedFile).size === "number"
  );
}

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private baseDir() {
    return path.resolve(
      this.configService.get<string>("MEDIA_STORAGE_PATH") ||
        path.join(process.cwd(), "storage", "media"),
    );
  }

  private sanitizeFolder(folder: string): string {
    const cleaned = String(folder || "root")
      .replace(/[^a-zA-Z0-9_\-/]/g, "")
      .replace(/\/{2,}/g, "/")
      .replace(/^\/|\/$/g, "");
    const candidate = cleaned || "root";
    const relative = path.relative(this.baseDir(), path.resolve(this.baseDir(), candidate));

    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return "root";
    }
    return candidate;
  }

  private resolveAssetPath(folder: string, filename: string) {
    if (path.basename(filename) !== filename) {
      throw new BadRequestException("Invalid media filename");
    }
    const resolved = path.resolve(this.baseDir(), this.sanitizeFolder(folder), filename);
    const relative = path.relative(this.baseDir(), resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new BadRequestException("Invalid media path");
    }
    return resolved;
  }

  private async ensureFolder(folder: string) {
    const sanitizedFolder = this.sanitizeFolder(folder);
    const dir = path.resolve(this.baseDir(), sanitizedFolder);
    await fs.mkdir(dir, { recursive: true });
    return { dir, sanitizedFolder };
  }

  private mediaUrl(folder: string, filename: string) {
    const encodedFolder = folder
      .split("/")
      .filter(Boolean)
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const pathname = `/media/${encodedFolder}/${encodeURIComponent(filename)}`;
    const publicApiUrl = this.configService
      .get<string>("PUBLIC_API_URL")
      ?.replace(/\/$/, "");
    return publicApiUrl ? `${publicApiUrl}${pathname}` : pathname;
  }

  private validateFile(file: UploadedFile) {
    const definition = ALLOWED_FILES[file.mimetype];
    if (!definition) {
      throw new BadRequestException("Unsupported media type");
    }

    const extension = path.extname(file.originalname).toLowerCase();
    if (!definition.extensions.includes(extension)) {
      throw new BadRequestException("File extension does not match its declared media type");
    }
    if (!definition.isValid(file.buffer)) {
      throw new BadRequestException("File content does not match its declared media type");
    }
  }

  private inferType(mimeType: string) {
    if (mimeType.startsWith("image/")) return "IMAGE";
    if (mimeType === "application/pdf") return "PDF";
    if (mimeType.startsWith("video/")) return "VIDEO";
    return "DOCUMENT";
  }

  async list(query: MediaQueryDto) {
    return this.prisma.mediaAsset.findMany({
      where: {
        folder: query.folder ? this.sanitizeFolder(query.folder) : undefined,
        OR: query.search
          ? [
              { originalName: { contains: query.search, mode: "insensitive" } },
              { filename: { contains: query.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async upload(file: unknown, folder = "root") {
    if (!isUploadedFile(file)) {
      throw new BadRequestException("No file provided");
    }
    this.validateFile(file);

    const { dir, sanitizedFolder } = await this.ensureFolder(folder);
    const originalBase = path.basename(file.originalname);
    const safeName = `${Date.now()}-${originalBase.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    await fs.writeFile(path.join(dir, safeName), file.buffer, { flag: "wx" });

    return this.prisma.mediaAsset.create({
      data: {
        folder: sanitizedFolder,
        originalName: originalBase,
        filename: safeName,
        mimeType: file.mimetype,
        size: file.size,
        type: this.inferType(file.mimetype),
        url: this.mediaUrl(sanitizedFolder, safeName),
      },
    });
  }

  async update(id: string, dto: UpdateMediaDto) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException("Media asset not found");

    const data: Record<string, unknown> = {};
    if (dto.altText !== undefined) data.altText = dto.altText;
    if (dto.folder !== undefined) {
      const folder = this.sanitizeFolder(dto.folder);
      if (folder !== asset.folder) {
        const { dir } = await this.ensureFolder(folder);
        const sourcePath = this.resolveAssetPath(asset.folder, asset.filename);
        await fs.rename(sourcePath, path.join(dir, asset.filename));
        data.folder = folder;
        data.url = this.mediaUrl(folder, asset.filename);
      }
    }
    return this.prisma.mediaAsset.update({ where: { id }, data });
  }

  async replace(id: string, file: unknown) {
    if (!isUploadedFile(file)) {
      throw new BadRequestException("No file provided");
    }
    this.validateFile(file);

    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException("Media asset not found");
    const absolutePath = this.resolveAssetPath(asset.folder, asset.filename);
    await fs.writeFile(absolutePath, file.buffer);
    return this.prisma.mediaAsset.update({
      where: { id },
      data: {
        mimeType: file.mimetype,
        size: file.size,
        type: this.inferType(file.mimetype),
        originalName: path.basename(file.originalname),
      },
    });
  }

  async remove(id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return { ok: true };
    await fs.rm(this.resolveAssetPath(asset.folder, asset.filename), { force: true });
    await this.prisma.mediaAsset.delete({ where: { id } });
    return { ok: true };
  }
}
