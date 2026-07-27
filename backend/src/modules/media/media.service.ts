import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { MediaQueryDto, UpdateMediaDto } from "./dto/media.dto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Allowed MIME types with their expected magic-byte signatures.
 * Only files matching BOTH the declared MIME and the actual magic bytes
 * will be accepted. This prevents attackers from uploading executables
 * disguised as images.
 */
const ALLOWED_MIME_TYPES: Record<string, { magicBytes: number[][] }> = {
  "image/jpeg": { magicBytes: [[0xff, 0xd8, 0xff]] },
  "image/png": { magicBytes: [[0x89, 0x50, 0x4e, 0x47]] },
  "image/gif": {
    magicBytes: [
      [0x47, 0x49, 0x46, 0x38, 0x37],
      [0x47, 0x49, 0x46, 0x38, 0x39],
    ],
  },
  "image/webp": { magicBytes: [[0x52, 0x49, 0x46, 0x46]] },
  "image/svg+xml": { magicBytes: [] }, // SVG is XML text — validated by extension
  "application/pdf": { magicBytes: [[0x25, 0x50, 0x44, 0x46]] },
  "video/mp4": { magicBytes: [] }, // MP4 magic bytes vary — rely on MIME + extension
  "video/webm": { magicBytes: [[0x1a, 0x45, 0xdf, 0xa3]] },
};

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".pdf",
  ".mp4",
  ".webm",
]);

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  private baseDir() {
    return path.resolve(process.cwd(), "storage", "media");
  }

  /**
   * Sanitize and validate the folder name to prevent path traversal.
   * Strips anything that is not alphanumeric, hyphen, underscore, or
   * forward slash (for sub-folders). Collapses repeated slashes and
   * rejects traversal patterns like `..`.
   */
  private sanitizeFolder(folder: string): string {
    const cleaned = String(folder || "root")
      .replace(/\.\./g, "") // strip traversal
      .replace(/[^a-zA-Z0-9_\-/]/g, "") // allow only safe chars
      .replace(/\/+/g, "/") // collapse slashes
      .replace(/^\/|\/$/g, ""); // trim leading/trailing slashes

    if (!cleaned) return "root";

    // Final safety: resolved path must stay inside baseDir
    const resolved = path.resolve(this.baseDir(), cleaned);
    if (!resolved.startsWith(this.baseDir())) {
      return "root";
    }
    return cleaned;
  }

  private async ensureFolder(folder: string) {
    const safe = this.sanitizeFolder(folder);
    const dir = path.join(this.baseDir(), safe);
    await fs.mkdir(dir, { recursive: true });
    return { dir, sanitizedFolder: safe };
  }

  /**
   * Validate file MIME type against whitelist and check magic bytes
   * to ensure the file content matches the declared type.
   */
  private validateFile(file: {
    mimetype: string;
    originalname: string;
    buffer: Buffer;
  }) {
    // Check MIME whitelist
    const allowedEntry = ALLOWED_MIME_TYPES[file.mimetype];
    if (!allowedEntry) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed. Accepted types: ${Object.keys(ALLOWED_MIME_TYPES).join(", ")}`,
      );
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw new BadRequestException(
        `File extension "${ext}" is not allowed. Accepted extensions: ${[...ALLOWED_EXTENSIONS].join(", ")}`,
      );
    }

    // Check magic bytes (if signatures are defined for this type)
    if (allowedEntry.magicBytes.length > 0 && file.buffer.length > 0) {
      const matches = allowedEntry.magicBytes.some((signature) =>
        signature.every((byte, index) => file.buffer[index] === byte),
      );
      if (!matches) {
        throw new BadRequestException(
          "File content does not match the declared type. The file may be corrupted or misnamed.",
        );
      }
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
        folder: query.folder || undefined,
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

  async upload(file: any, folder = "root") {
    if (!file || !file.buffer) {
      throw new BadRequestException("No file provided");
    }
    this.validateFile(file);

    const { dir: folderPath, sanitizedFolder } =
      await this.ensureFolder(folder);
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const absolutePath = path.join(folderPath, safeName);
    await fs.writeFile(absolutePath, file.buffer);
    return this.prisma.mediaAsset.create({
      data: {
        folder: sanitizedFolder,
        originalName: file.originalname,
        filename: safeName,
        mimeType: file.mimetype,
        size: file.size,
        type: this.inferType(file.mimetype),
        url: `/media/${sanitizedFolder}/${safeName}`,
      },
    });
  }

  update(id: string, dto: UpdateMediaDto) {
    // Sanitize folder if it's being updated
    const data: Record<string, unknown> = {};
    if (dto.altText !== undefined) data.altText = dto.altText;
    if (dto.folder !== undefined) data.folder = this.sanitizeFolder(dto.folder);
    return this.prisma.mediaAsset.update({ where: { id }, data });
  }

  async replace(id: string, file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException("No file provided");
    }
    this.validateFile(file);

    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException("Media asset not found");
    const { dir: folderPath } = await this.ensureFolder(asset.folder);
    const absolutePath = path.join(folderPath, asset.filename);
    await fs.writeFile(absolutePath, file.buffer);
    return this.prisma.mediaAsset.update({
      where: { id },
      data: {
        mimeType: file.mimetype,
        size: file.size,
        type: this.inferType(file.mimetype),
        originalName: file.originalname,
      },
    });
  }

  async remove(id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return { ok: true };
    const absolutePath = path.join(
      this.baseDir(),
      this.sanitizeFolder(asset.folder),
      asset.filename,
    );
    await fs.rm(absolutePath, { force: true });
    await this.prisma.mediaAsset.delete({ where: { id } });
    return { ok: true };
  }
}
