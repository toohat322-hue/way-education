import { Injectable } from "@nestjs/common";
import { AuditService } from "../../common/services/audit.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
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
import { CmsRepository } from "./cms.repository";

@Injectable()
export class CmsService {
  constructor(private readonly repository: CmsRepository, private readonly auditService: AuditService) {}

  private serializeUniversity(uni: any) {
    return {
      id: uni.slug,
      grad: uni.grad,
      initial: uni.initial,
      image: uni.image,
      logo: uni.logo,
      gallery: uni.gallery.map((item: any) => item.url),
      photoCredit: uni.photoCreditText && uni.photoCreditUrl ? { text: uni.photoCreditText, url: uni.photoCreditUrl } : undefined,
      name: uni.name,
      city: { en: uni.city.nameEn, ar: uni.city.nameAr },
      country: { en: uni.country.nameEn, ar: uni.country.nameAr },
      type: { en: uni.typeEn, ar: uni.typeAr },
      tuition: uni.tuition,
      rating: uni.rating,
      reviews: uni.reviewsCount,
      ranking: uni.ranking,
      founded: uni.founded,
      studentsCount: uni.studentsCount,
      intl: uni.intlStudents,
      language: { en: uni.languageEn, ar: uni.languageAr },
      scholarship: uni.scholarship,
      gpaReq: uni.gpaRequirement,
      about: { en: uni.aboutEn, ar: uni.aboutAr },
      majors: uni.programs.map((program: any) => ({ name: { en: program.nameEn, ar: program.nameAr }, fee: program.fee, iconName: program.iconName })),
      docs: {
        en: (uni.admissions[0]?.documentsEn as string[] | undefined) || [],
        ar: (uni.admissions[0]?.documentsAr as string[] | undefined) || [],
      },
      testimonials: uni.reviews.map((review: any) => ({ name: review.studentName, text: { en: review.textEn, ar: review.textAr }, rating: review.rating })),
      contact: { phone: uni.contactPhone, email: uni.contactEmail, website: uni.contactWebsite },
      social: { facebook: uni.socialFacebook, instagram: uni.socialInstagram, linkedin: uni.socialLinkedin },
      featured: uni.featured,
      active: uni.active,
      status: uni.status,
    };
  }

  private serializeDirectoryEntry(entry: any) {
    return {
      id: entry.slug,
      name: entry.name,
      city: entry.city?.nameEn || "",
      country: entry.country.nameEn,
      type: entry.type,
      founded: entry.founded,
    };
  }

  private serializeMajor(major: any) {
    return {
      id: major.slug,
      iconName: major.iconName,
      name: { en: major.nameEn, ar: major.nameAr },
      count: major.count,
    };
  }

  private serializeFaq(faq: any) {
    return {
      id: faq.id,
      q: { en: faq.questionEn, ar: faq.questionAr },
      a: { en: faq.answerEn, ar: faq.answerAr },
    };
  }

  private serializeSettings(settings: any) {
    return {
      websiteName: settings.websiteName,
      whatsapp: settings.whatsapp,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      address: { en: settings.addressEn, ar: settings.addressAr },
      seo: { title: settings.seoTitle, description: settings.seoDescription },
      socialLinks: settings.socialLinks,
      analytics: settings.analytics,
      featureFlags: settings.featureFlags,
      languages: settings.languages,
    };
  }

  private serializeCountry(country: any) {
    return {
      id: country.id,
      code: country.code,
      name: { en: country.nameEn, ar: country.nameAr },
      isActive: country.isActive,
      cities: (country.cities || []).map((city: any) => ({ id: city.id, name: { en: city.nameEn, ar: city.nameAr } })),
    };
  }

  private serializeCity(city: any) {
    return {
      id: city.id,
      countryCode: city.country?.code,
      countryName: city.country?.nameEn,
      name: { en: city.nameEn, ar: city.nameAr },
    };
  }

  private serializeSeoPage(page: any) {
    return {
      key: page.key,
      title: page.title,
      description: page.description,
      canonicalUrl: page.canonicalUrl,
      robots: page.robots,
      openGraphTitle: page.openGraphTitle,
      openGraphDescription: page.openGraphDescription,
      openGraphImage: page.openGraphImage,
      schemaMarkup: page.schemaMarkup,
    };
  }

  private serializeBlogPost(post: any) {
    return {
      id: post.id,
      slug: post.slug,
      title: { en: post.titleEn, ar: post.titleAr },
      excerpt: { en: post.excerptEn, ar: post.excerptAr },
      content: { en: post.contentEn, ar: post.contentAr },
      coverImage: post.coverImage,
      authorName: post.authorName,
      tags: post.tags || [],
      status: post.status,
      publishedAt: post.publishedAt,
    };
  }

  async getBootstrap() {
    const [universities, directory, majors, faqs, settings, siteCopy] = await this.repository.getBootstrap();
    return {
      universities: universities.map((uni) => this.serializeUniversity(uni)),
      directory: directory.map((entry) => this.serializeDirectoryEntry(entry)),
      majors: majors.map((major) => this.serializeMajor(major)),
      faqs: faqs.map((faq) => this.serializeFaq(faq)),
      settings: settings ? this.serializeSettings(settings) : null,
      strings: (siteCopy?.data as Record<string, unknown>) || {},
    };
  }

  async listUniversities() {
    const universities = await this.repository.listUniversities();
    return universities.map((uni) => this.serializeUniversity(uni));
  }

  async createUniversity(dto: CreateUniversityDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const university = await this.repository.createUniversity(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.university.create", entityType: "university", entityId: university.id, ipAddress, userAgent });
    return this.serializeUniversity(university);
  }

  async updateUniversity(slug: string, dto: CreateUniversityDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const university = await this.repository.updateUniversity(slug, dto);
    if (!university) return null;
    await this.auditService.log({ userId: currentUser.id, action: "cms.university.update", entityType: "university", entityId: university.id, ipAddress, userAgent });
    return this.serializeUniversity(university);
  }

  async deleteUniversity(slug: string, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const university = await this.repository.deleteUniversity(slug);
    await this.auditService.log({ userId: currentUser.id, action: "cms.university.archive", entityType: "university", entityId: university.id, ipAddress, userAgent });
    return { ok: true };
  }

  async createDirectoryEntry(dto: CreateDirectoryEntryDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const entry = await this.repository.createDirectoryEntry(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.directory.create", entityType: "directory_entry", entityId: entry.id, ipAddress, userAgent });
    return this.serializeDirectoryEntry(entry);
  }

  async updateDirectoryEntry(slug: string, dto: CreateDirectoryEntryDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const entry = await this.repository.updateDirectoryEntry(slug, dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.directory.update", entityType: "directory_entry", entityId: entry.id, ipAddress, userAgent });
    return this.serializeDirectoryEntry(entry);
  }

  async deleteDirectoryEntry(slug: string, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    await this.repository.deleteDirectoryEntry(slug);
    await this.auditService.log({ userId: currentUser.id, action: "cms.directory.delete", entityType: "directory_entry", entityId: slug, ipAddress, userAgent });
    return { ok: true };
  }

  async listMajors() {
    const majors = await this.repository.listMajors();
    return majors.map((major) => this.serializeMajor(major));
  }

  async createMajor(dto: CreateMajorDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const major = await this.repository.createMajor(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.major.create", entityType: "major", entityId: major.id, ipAddress, userAgent });
    return this.serializeMajor(major);
  }

  async updateMajor(slug: string, dto: CreateMajorDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const major = await this.repository.updateMajor(slug, dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.major.update", entityType: "major", entityId: major.id, ipAddress, userAgent });
    return this.serializeMajor(major);
  }

  async deleteMajor(slug: string, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    await this.repository.deleteMajor(slug);
    await this.auditService.log({ userId: currentUser.id, action: "cms.major.delete", entityType: "major", entityId: slug, ipAddress, userAgent });
    return { ok: true };
  }

  async listFaqs() {
    const faqs = await this.repository.listFaqs();
    return faqs.map((faq) => this.serializeFaq(faq));
  }

  async createFaq(dto: CreateFaqDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const faq = await this.repository.createFaq(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.faq.create", entityType: "faq", entityId: faq.id, ipAddress, userAgent });
    return this.serializeFaq(faq);
  }

  async updateFaq(id: string, dto: CreateFaqDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const faq = await this.repository.updateFaq(id, dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.faq.update", entityType: "faq", entityId: faq.id, ipAddress, userAgent });
    return this.serializeFaq(faq);
  }

  async deleteFaq(id: string, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    await this.repository.deleteFaq(id);
    await this.auditService.log({ userId: currentUser.id, action: "cms.faq.delete", entityType: "faq", entityId: id, ipAddress, userAgent });
    return { ok: true };
  }

  async getSettings() {
    return this.serializeSettings(await this.repository.getSettings());
  }

  async updateSettings(dto: UpdateSettingsDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const settings = await this.repository.updateSettings(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.settings.update", entityType: "site_settings", entityId: settings.id, ipAddress, userAgent });
    return this.serializeSettings(settings);
  }

  async getSiteCopy() {
    const siteCopy = await this.repository.getSiteCopy();
    return siteCopy.data as Record<string, unknown>;
  }

  async updateSiteCopy(dto: UpdateSiteCopyDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const siteCopy = await this.repository.updateSiteCopy(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.site_copy.update", entityType: "site_copy", entityId: siteCopy.id, ipAddress, userAgent });
    return siteCopy.data as Record<string, unknown>;
  }

  async listCountries() {
    return (await this.repository.listCountries()).map((country) => this.serializeCountry(country));
  }

  async createCountry(dto: CreateCountryDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const country = await this.repository.createCountry(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.country.create", entityType: "country", entityId: country.id, ipAddress, userAgent });
    return this.serializeCountry(country);
  }

  async updateCountry(code: string, dto: CreateCountryDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const country = await this.repository.updateCountry(code, dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.country.update", entityType: "country", entityId: country.id, ipAddress, userAgent });
    return this.serializeCountry(country);
  }

  async deleteCountry(code: string, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const country = await this.repository.deleteCountry(code);
    await this.auditService.log({ userId: currentUser.id, action: "cms.country.delete", entityType: "country", entityId: country.id, ipAddress, userAgent });
    return { ok: true };
  }

  async listCities() {
    return (await this.repository.listCities()).map((city) => this.serializeCity(city));
  }

  async createCity(dto: CreateCityDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const city = await this.repository.createCity(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.city.create", entityType: "city", entityId: city.id, ipAddress, userAgent });
    return this.serializeCity(city);
  }

  async updateCity(id: string, dto: CreateCityDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const city = await this.repository.updateCity(id, dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.city.update", entityType: "city", entityId: city.id, ipAddress, userAgent });
    return this.serializeCity(city);
  }

  async deleteCity(id: string, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    await this.repository.deleteCity(id);
    await this.auditService.log({ userId: currentUser.id, action: "cms.city.delete", entityType: "city", entityId: id, ipAddress, userAgent });
    return { ok: true };
  }

  async listSeoPages() {
    return (await this.repository.listSeoPages()).map((page) => this.serializeSeoPage(page));
  }

  async createSeoPage(dto: CreateSeoPageDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const page = await this.repository.createSeoPage(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.seo.create", entityType: "seo_page", entityId: page.id, ipAddress, userAgent });
    return this.serializeSeoPage(page);
  }

  async updateSeoPage(key: string, dto: CreateSeoPageDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const page = await this.repository.updateSeoPage(key, dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.seo.update", entityType: "seo_page", entityId: page.id, ipAddress, userAgent });
    return this.serializeSeoPage(page);
  }

  async deleteSeoPage(key: string, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const page = await this.repository.deleteSeoPage(key);
    await this.auditService.log({ userId: currentUser.id, action: "cms.seo.delete", entityType: "seo_page", entityId: page.id, ipAddress, userAgent });
    return { ok: true };
  }

  async listBlogPosts() {
    return (await this.repository.listBlogPosts()).map((post) => this.serializeBlogPost(post));
  }

  async createBlogPost(dto: CreateBlogPostDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const post = await this.repository.createBlogPost(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.blog.create", entityType: "blog_post", entityId: post.id, ipAddress, userAgent });
    return this.serializeBlogPost(post);
  }

  async updateBlogPost(slug: string, dto: CreateBlogPostDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const post = await this.repository.updateBlogPost(slug, dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.blog.update", entityType: "blog_post", entityId: post.id, ipAddress, userAgent });
    return this.serializeBlogPost(post);
  }

  async deleteBlogPost(slug: string, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const post = await this.repository.deleteBlogPost(slug);
    await this.auditService.log({ userId: currentUser.id, action: "cms.blog.delete", entityType: "blog_post", entityId: post.id, ipAddress, userAgent });
    return { ok: true };
  }

  async exportSnapshot() {
    return this.repository.exportSnapshot();
  }

  async importSnapshot(dto: ImportSnapshotDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const result = await this.repository.importSnapshot(dto);
    await this.auditService.log({ userId: currentUser.id, action: "cms.snapshot.import", entityType: "snapshot", entityId: null, ipAddress, userAgent });
    return result;
  }
}
