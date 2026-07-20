import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { MediaQueryDto, UpdateMediaDto } from "./dto/media.dto";
import { promises as fs } from "node:fs";
import path from "node:path";

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  private baseDir() {
    return path.resolve(process.cwd(), "storage", "media");
  }

  private async ensureFolder(folder: string) {
    const dir = path.join(this.baseDir(), folder || "root");
    await fs.mkdir(dir, { recursive: true });
    return dir;
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
    const folderPath = await this.ensureFolder(folder);
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const absolutePath = path.join(folderPath, safeName);
    await fs.writeFile(absolutePath, file.buffer);
    return this.prisma.mediaAsset.create({
      data: {
        folder,
        originalName: file.originalname,
        filename: safeName,
        mimeType: file.mimetype,
        size: file.size,
        type: this.inferType(file.mimetype),
        url: `/media/${folder}/${safeName}`,
      },
    });
  }

  update(id: string, dto: UpdateMediaDto) {
    return this.prisma.mediaAsset.update({ where: { id }, data: dto });
  }

  async replace(id: string, file: any) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new Error("Media asset not found");
    const folderPath = await this.ensureFolder(asset.folder);
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
      asset.folder,
      asset.filename,
    );
    await fs.rm(absolutePath, { force: true });
    await this.prisma.mediaAsset.delete({ where: { id } });
    return { ok: true };
  }
}
