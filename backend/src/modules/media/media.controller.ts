import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { MediaQueryDto, UpdateMediaDto } from "./dto/media.dto";
import { MediaService } from "./media.service";

@Controller("media")
@UseGuards(AuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  list(@Query() query: MediaQueryDto) {
    return this.mediaService.list(query);
  }

  @Post()
  @UseInterceptors(FileInterceptor("file", { storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } }))
  upload(@UploadedFile() file: any, @Query("folder") folder?: string) {
    return this.mediaService.upload(file, folder || "root");
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateMediaDto, @CurrentUser() _user: any) {
    return this.mediaService.update(id, dto);
  }

  @Post(":id/replace")
  @UseInterceptors(FileInterceptor("file", { storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } }))
  replace(@Param("id") id: string, @UploadedFile() file: any) {
    return this.mediaService.replace(id, file);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.mediaService.remove(id);
  }
}
