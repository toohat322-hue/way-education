import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreateBlogPostDto,
  CreateCityDto,
  CreateCountryDto,
  CreateDirectoryEntryDto,
  CreateFaqDto,
  CreateMajorDto,
  CreateSeoPageDto,
  CreateUniversityDto,
  ImportSnapshotDto,
  UpdateSettingsDto,
  UpdateSiteCopyDto,
} from "./dto/cms.dto";
import { CmsService } from "./cms.service";

@Controller("cms")
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get("bootstrap")
  getBootstrap() {
    return this.cmsService.getBootstrap();
  }

  @Get("settings")
  getSettings() {
    return this.cmsService.getSettings();
  }

  @Get("site-copy")
  getSiteCopy() {
    return this.cmsService.getSiteCopy();
  }

  @Get("universities")
  getUniversities() {
    return this.cmsService.listUniversities();
  }

  @Get("majors")
  getMajors() {
    return this.cmsService.listMajors();
  }

  @Get("faqs")
  getFaqs() {
    return this.cmsService.listFaqs();
  }

  @Get("countries")
  getCountries() {
    return this.cmsService.listCountries();
  }

  @Get("cities")
  getCities() {
    return this.cmsService.listCities();
  }

  @Get("seo")
  getSeoPages() {
    return this.cmsService.listSeoPages();
  }

  @Get("blog")
  getBlogPosts() {
    return this.cmsService.listBlogPosts();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Get("snapshot/export")
  exportSnapshot() {
    return this.cmsService.exportSnapshot();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Post("snapshot/import")
  importSnapshot(
    @Body() dto: ImportSnapshotDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.importSnapshot(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Patch("site-copy")
  updateSiteCopy(
    @Body() dto: UpdateSiteCopyDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateSiteCopy(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Patch("settings")
  updateSettings(
    @Body() dto: UpdateSettingsDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateSettings(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Post("universities")
  createUniversity(
    @Body() dto: CreateUniversityDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.createUniversity(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Patch("universities/:slug")
  updateUniversity(
    @Param("slug") slug: string,
    @Body() dto: CreateUniversityDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateUniversity(
      slug,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Delete("universities/:slug")
  @HttpCode(200)
  deleteUniversity(
    @Param("slug") slug: string,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.deleteUniversity(
      slug,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Post("directory")
  createDirectoryEntry(
    @Body() dto: CreateDirectoryEntryDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.createDirectoryEntry(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Patch("directory/:slug")
  updateDirectoryEntry(
    @Param("slug") slug: string,
    @Body() dto: CreateDirectoryEntryDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateDirectoryEntry(
      slug,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Delete("directory/:slug")
  @HttpCode(200)
  deleteDirectoryEntry(
    @Param("slug") slug: string,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.deleteDirectoryEntry(
      slug,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Post("majors")
  createMajor(
    @Body() dto: CreateMajorDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.createMajor(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Patch("majors/:slug")
  updateMajor(
    @Param("slug") slug: string,
    @Body() dto: CreateMajorDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateMajor(
      slug,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Delete("majors/:slug")
  @HttpCode(200)
  deleteMajor(
    @Param("slug") slug: string,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.deleteMajor(
      slug,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Post("faqs")
  createFaq(
    @Body() dto: CreateFaqDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.createFaq(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Patch("faqs/:id")
  updateFaq(
    @Param("id") id: string,
    @Body() dto: CreateFaqDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateFaq(
      id,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Delete("faqs/:id")
  @HttpCode(200)
  deleteFaq(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.deleteFaq(
      id,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Post("countries")
  createCountry(
    @Body() dto: CreateCountryDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.createCountry(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Patch("countries/:code")
  updateCountry(
    @Param("code") code: string,
    @Body() dto: CreateCountryDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateCountry(
      code,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Delete("countries/:code")
  @HttpCode(200)
  deleteCountry(
    @Param("code") code: string,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.deleteCountry(
      code,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Post("cities")
  createCity(
    @Body() dto: CreateCityDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.createCity(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Patch("cities/:id")
  updateCity(
    @Param("id") id: string,
    @Body() dto: CreateCityDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateCity(
      id,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Delete("cities/:id")
  @HttpCode(200)
  deleteCity(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.deleteCity(
      id,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Post("seo")
  createSeoPage(
    @Body() dto: CreateSeoPageDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.createSeoPage(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Patch("seo/:key")
  updateSeoPage(
    @Param("key") key: string,
    @Body() dto: CreateSeoPageDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateSeoPage(
      key,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Delete("seo/:key")
  @HttpCode(200)
  deleteSeoPage(
    @Param("key") key: string,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.deleteSeoPage(
      key,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Post("blog")
  createBlogPost(
    @Body() dto: CreateBlogPostDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.createBlogPost(
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "EDITOR")
  @Patch("blog/:slug")
  updateBlogPost(
    @Param("slug") slug: string,
    @Body() dto: CreateBlogPostDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.updateBlogPost(
      slug,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  @Delete("blog/:slug")
  @HttpCode(200)
  deleteBlogPost(
    @Param("slug") slug: string,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.cmsService.deleteBlogPost(
      slug,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }
}
