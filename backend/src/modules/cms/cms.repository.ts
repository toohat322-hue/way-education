import { Injectable } from "@nestjs/common";
import { BlogStatus, Prisma, UniversityStatus } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
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

function slugify(value: string) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

@Injectable()
export class CmsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCountry(country: { en: string; ar: string }) {
    const code = slugify(country.en).slice(0, 24);
    return this.prisma.country.upsert({
      where: { code },
      update: { nameEn: country.en, nameAr: country.ar },
      create: { code, nameEn: country.en, nameAr: country.ar },
    });
  }

  private async ensureCity(countryId: string, city: { en: string; ar: string }) {
    const existing = await this.prisma.city.findFirst({ where: { countryId, nameEn: city.en } });
    if (existing) {
      return this.prisma.city.update({ where: { id: existing.id }, data: { nameAr: city.ar } });
    }
    return this.prisma.city.create({ data: { countryId, nameEn: city.en, nameAr: city.ar } });
  }

  private mapUniversityCreateInput(dto: CreateUniversityDto, cityId: string, countryId: string): Prisma.UniversityCreateInput {
    return {
      slug: slugify(dto.name),
      name: dto.name,
      initial: dto.initial,
      grad: dto.grad,
      image: dto.image,
      logo: dto.logo,
      photoCreditText: dto.photoCredit?.text,
      photoCreditUrl: dto.photoCredit?.url,
      typeEn: dto.type.en,
      typeAr: dto.type.ar,
      languageEn: dto.language.en,
      languageAr: dto.language.ar,
      tuition: dto.tuition,
      rating: dto.rating,
      reviewsCount: dto.reviews,
      ranking: dto.ranking,
      founded: dto.founded,
      studentsCount: dto.studentsCount,
      intlStudents: dto.intl,
      scholarship: dto.scholarship,
      gpaRequirement: dto.gpaReq,
      aboutEn: dto.about.en,
      aboutAr: dto.about.ar,
      featured: dto.featured,
      active: dto.active,
      status: (dto.status?.toUpperCase() as UniversityStatus) || "PUBLISHED",
      contactPhone: dto.contact?.phone,
      contactEmail: dto.contact?.email,
      contactWebsite: dto.contact?.website,
      socialFacebook: dto.social?.facebook,
      socialInstagram: dto.social?.instagram,
      socialLinkedin: dto.social?.linkedin,
      city: { connect: { id: cityId } },
      country: { connect: { id: countryId } },
      gallery: {
        create: dto.gallery.map((url, index) => ({ url, sortOrder: index })),
      },
      programs: {
        create: dto.majors.map((major, index) => ({
          nameEn: major.name.en,
          nameAr: major.name.ar,
          fee: major.fee,
          iconName: major.iconName,
          sortOrder: index,
        })),
      },
      admissions: {
        create: [{
          documentsEn: dto.docs.en,
          documentsAr: dto.docs.ar,
          notesEn: dto.gpaReq,
          notesAr: dto.gpaReq,
        }],
      },
      reviews: {
        create: dto.testimonials.map((testimonial) => ({
          studentName: testimonial.name,
          rating: testimonial.rating,
          textEn: testimonial.text.en,
          textAr: testimonial.text.ar,
        })),
      },
      scholarships: {
        create: dto.scholarship > 0
          ? [{
              titleEn: `${dto.scholarship}% Scholarship`,
              titleAr: `منحة ${dto.scholarship}%`,
              percentage: dto.scholarship,
              descriptionEn: `Scholarship support up to ${dto.scholarship}%`,
              descriptionAr: `دعم منح يصل إلى ${dto.scholarship}%`,
            }]
          : [],
      },
      versions: {
        create: [{ version: 1, snapshot: dto as unknown as Prisma.InputJsonValue }],
      },
    };
  }

  // ─── Existence finders (used by service for 404 checks) ─────────────

  findUniversityBySlug(slug: string) {
    return this.prisma.university.findUnique({ where: { slug, deletedAt: null } });
  }

  findDirectoryEntryBySlug(slug: string) {
    return this.prisma.directoryEntry.findUnique({ where: { slug } });
  }

  findMajorBySlug(slug: string) {
    return this.prisma.major.findUnique({ where: { slug } });
  }

  findFaqById(id: string) {
    return this.prisma.faq.findUnique({ where: { id } });
  }

  findCountryByCode(code: string) {
    return this.prisma.country.findUnique({ where: { code: code.toLowerCase() } });
  }

  findCityById(id: string) {
    return this.prisma.city.findUnique({ where: { id } });
  }

  findSeoPageByKey(key: string) {
    return this.prisma.seoPage.findUnique({ where: { key } });
  }

  findBlogPostBySlug(slug: string) {
    return this.prisma.blogPost.findUnique({ where: { slug } });
  }

  // ─── Bootstrap & Lists ────────────────────────────────────────────

  getBootstrap() {
    return Promise.all([
      this.prisma.university.findMany({
        where: { deletedAt: null },
        include: {
          city: true,
          country: true,
          programs: { orderBy: { sortOrder: "asc" } },
          admissions: true,
          reviews: true,
          scholarships: true,
          gallery: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: [{ featured: "desc" }, { name: "asc" }],
      }),
      this.prisma.directoryEntry.findMany({ include: { city: true, country: true }, orderBy: { name: "asc" } }),
      this.prisma.major.findMany({ orderBy: { nameEn: "asc" } }),
      this.prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
      this.prisma.siteSettings.findFirst(),
      this.prisma.siteCopy.findFirst(),
    ]);
  }

  listUniversities() {
    return this.prisma.university.findMany({
      where: { deletedAt: null },
      include: {
        city: true,
        country: true,
        programs: { orderBy: { sortOrder: "asc" } },
        admissions: true,
        reviews: true,
        scholarships: true,
        gallery: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });
  }

  async createUniversity(dto: CreateUniversityDto) {
    const country = await this.ensureCountry(dto.country);
    const city = await this.ensureCity(country.id, dto.city);
    return this.prisma.university.create({
      data: this.mapUniversityCreateInput(dto, city.id, country.id),
      include: {
        city: true,
        country: true,
        programs: true,
        admissions: true,
        reviews: true,
        scholarships: true,
        gallery: true,
      },
    });
  }

  async updateUniversity(slug: string, dto: CreateUniversityDto) {
    const current = await this.prisma.university.findUnique({ where: { slug } });
    if (!current) return null;
    const country = await this.ensureCountry(dto.country);
    const city = await this.ensureCity(country.id, dto.city);
    await this.prisma.university.update({
      where: { slug },
      data: {
        slug: current.slug,
        name: dto.name,
        initial: dto.initial,
        grad: dto.grad,
        image: dto.image,
        logo: dto.logo,
        photoCreditText: dto.photoCredit?.text,
        photoCreditUrl: dto.photoCredit?.url,
        typeEn: dto.type.en,
        typeAr: dto.type.ar,
        languageEn: dto.language.en,
        languageAr: dto.language.ar,
        tuition: dto.tuition,
        rating: dto.rating,
        reviewsCount: dto.reviews,
        ranking: dto.ranking,
        founded: dto.founded,
        studentsCount: dto.studentsCount,
        intlStudents: dto.intl,
        scholarship: dto.scholarship,
        gpaRequirement: dto.gpaReq,
        aboutEn: dto.about.en,
        aboutAr: dto.about.ar,
        featured: dto.featured,
        active: dto.active,
        status: (dto.status?.toUpperCase() as UniversityStatus) || current.status,
        contactPhone: dto.contact?.phone,
        contactEmail: dto.contact?.email,
        contactWebsite: dto.contact?.website,
        socialFacebook: dto.social?.facebook,
        socialInstagram: dto.social?.instagram,
        socialLinkedin: dto.social?.linkedin,
        cityId: city.id,
        countryId: country.id,
        currentVersion: { increment: 1 },
        gallery: { deleteMany: {}, create: dto.gallery.map((url, index) => ({ url, sortOrder: index })) },
        programs: {
          deleteMany: {},
          create: dto.majors.map((major, index) => ({
            nameEn: major.name.en,
            nameAr: major.name.ar,
            fee: major.fee,
            iconName: major.iconName,
            sortOrder: index,
          })),
        },
        admissions: { deleteMany: {}, create: [{ documentsEn: dto.docs.en, documentsAr: dto.docs.ar, notesEn: dto.gpaReq, notesAr: dto.gpaReq }] },
        reviews: { deleteMany: {}, create: dto.testimonials.map((testimonial) => ({ studentName: testimonial.name, rating: testimonial.rating, textEn: testimonial.text.en, textAr: testimonial.text.ar })) },
        scholarships: {
          deleteMany: {},
          create: dto.scholarship > 0
            ? [{ titleEn: `${dto.scholarship}% Scholarship`, titleAr: `منحة ${dto.scholarship}%`, percentage: dto.scholarship, descriptionEn: `Scholarship support up to ${dto.scholarship}%`, descriptionAr: `دعم منح يصل إلى ${dto.scholarship}%` }]
            : [],
        },
        versions: {
          create: [{ version: current.currentVersion + 1, snapshot: dto as unknown as Prisma.InputJsonValue }],
        },
      },
    });

    return this.prisma.university.findUnique({
      where: { slug },
      include: { city: true, country: true, programs: true, admissions: true, reviews: true, scholarships: true, gallery: true },
    });
  }

  deleteUniversity(slug: string) {
    return this.prisma.university.update({
      where: { slug },
      data: { deletedAt: new Date(), active: false, status: "ARCHIVED" },
    });
  }

  async createDirectoryEntry(dto: CreateDirectoryEntryDto) {
    const country = await this.ensureCountry({ en: dto.country, ar: dto.country });
    const city = await this.ensureCity(country.id, { en: dto.city, ar: dto.city });
    return this.prisma.directoryEntry.create({
      data: {
        slug: slugify(dto.name),
        name: dto.name,
        type: dto.type,
        founded: dto.founded,
        countryId: country.id,
        cityId: city.id,
      },
      include: { city: true, country: true },
    });
  }

  async updateDirectoryEntry(slug: string, dto: CreateDirectoryEntryDto) {
    const country = await this.ensureCountry({ en: dto.country, ar: dto.country });
    const city = await this.ensureCity(country.id, { en: dto.city, ar: dto.city });
    return this.prisma.directoryEntry.update({
      where: { slug },
      data: { name: dto.name, type: dto.type, founded: dto.founded, countryId: country.id, cityId: city.id },
      include: { city: true, country: true },
    });
  }

  deleteDirectoryEntry(slug: string) {
    return this.prisma.directoryEntry.delete({ where: { slug } });
  }

  listMajors() {
    return this.prisma.major.findMany({ orderBy: { nameEn: "asc" } });
  }

  createMajor(dto: CreateMajorDto) {
    return this.prisma.major.create({
      data: { slug: slugify(dto.name.en), iconName: dto.iconName, nameEn: dto.name.en, nameAr: dto.name.ar, count: dto.count },
    });
  }

  updateMajor(slug: string, dto: CreateMajorDto) {
    return this.prisma.major.update({
      where: { slug },
      data: { iconName: dto.iconName, nameEn: dto.name.en, nameAr: dto.name.ar, count: dto.count },
    });
  }

  deleteMajor(slug: string) {
    return this.prisma.major.delete({ where: { slug } });
  }

  listFaqs() {
    return this.prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  }

  async createFaq(dto: CreateFaqDto) {
    const count = await this.prisma.faq.count();
    return this.prisma.faq.create({
      data: { questionEn: dto.q.en, questionAr: dto.q.ar, answerEn: dto.a.en, answerAr: dto.a.ar, sortOrder: count },
    });
  }

  updateFaq(id: string, dto: CreateFaqDto) {
    return this.prisma.faq.update({
      where: { id },
      data: { questionEn: dto.q.en, questionAr: dto.q.ar, answerEn: dto.a.en, answerAr: dto.a.ar },
    });
  }

  deleteFaq(id: string) {
    return this.prisma.faq.delete({ where: { id } });
  }

  async getSettings() {
    const settings = await this.prisma.siteSettings.findFirst();
    if (settings) return settings;
    return this.prisma.siteSettings.create({
      data: {
        websiteName: "Way Education",
        whatsapp: "905016000033",
        supportEmail: "hello@wayeducation.com",
        supportPhone: "+90 500 000 00 00",
        addressEn: "Istanbul, Türkiye",
        addressAr: "إسطنبول، تركيا",
        seoTitle: "Way Education",
        seoDescription: "Study admissions platform for Türkiye and Northern Cyprus.",
        socialLinks: {},
        analytics: {},
        featureFlags: {},
        languages: ["en", "ar"] as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async updateSettings(dto: UpdateSettingsDto) {
    const current = await this.getSettings();
    return this.prisma.siteSettings.update({
      where: { id: current.id },
      data: {
        ...dto,
        languages: dto.languages ? (dto.languages as unknown as Prisma.InputJsonValue) : undefined,
        socialLinks: dto.socialLinks ? (dto.socialLinks as unknown as Prisma.InputJsonValue) : undefined,
        analytics: dto.analytics ? (dto.analytics as unknown as Prisma.InputJsonValue) : undefined,
        featureFlags: dto.featureFlags ? (dto.featureFlags as unknown as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  async getSiteCopy() {
    const siteCopy = await this.prisma.siteCopy.findFirst();
    if (siteCopy) return siteCopy;
    return this.prisma.siteCopy.create({ data: { data: {} } });
  }

  async updateSiteCopy(dto: UpdateSiteCopyDto) {
    const current = await this.getSiteCopy();
    return this.prisma.siteCopy.update({
      where: { id: current.id },
      data: { data: dto.data as unknown as Prisma.InputJsonValue },
    });
  }

  listCountries() {
    return this.prisma.country.findMany({ include: { cities: true }, orderBy: { nameEn: "asc" } });
  }

  createCountry(dto: CreateCountryDto) {
    return this.prisma.country.create({
      data: { code: dto.code.toLowerCase(), nameEn: dto.nameEn, nameAr: dto.nameAr, isActive: dto.isActive ?? true },
    });
  }

  updateCountry(code: string, dto: CreateCountryDto) {
    return this.prisma.country.update({
      where: { code: code.toLowerCase() },
      data: { code: dto.code.toLowerCase(), nameEn: dto.nameEn, nameAr: dto.nameAr, isActive: dto.isActive ?? true },
    });
  }

  deleteCountry(code: string) {
    return this.prisma.country.delete({ where: { code: code.toLowerCase() } });
  }

  listCities() {
    return this.prisma.city.findMany({ include: { country: true }, orderBy: [{ country: { nameEn: "asc" } }, { nameEn: "asc" }] });
  }

  async createCity(dto: CreateCityDto) {
    const country = await this.prisma.country.findUnique({ where: { code: dto.countryCode.toLowerCase() } });
    if (!country) throw new Error(`Country not found for code ${dto.countryCode}`);
    return this.prisma.city.create({ data: { countryId: country.id, nameEn: dto.nameEn, nameAr: dto.nameAr }, include: { country: true } });
  }

  async updateCity(id: string, dto: CreateCityDto) {
    const country = await this.prisma.country.findUnique({ where: { code: dto.countryCode.toLowerCase() } });
    if (!country) throw new Error(`Country not found for code ${dto.countryCode}`);
    return this.prisma.city.update({ where: { id }, data: { countryId: country.id, nameEn: dto.nameEn, nameAr: dto.nameAr }, include: { country: true } });
  }

  deleteCity(id: string) {
    return this.prisma.city.delete({ where: { id } });
  }

  listSeoPages() {
    return this.prisma.seoPage.findMany({ orderBy: { key: "asc" } });
  }

  createSeoPage(dto: CreateSeoPageDto) {
    return this.prisma.seoPage.create({
      data: { ...dto, schemaMarkup: dto.schemaMarkup as unknown as Prisma.InputJsonValue },
    });
  }

  updateSeoPage(key: string, dto: CreateSeoPageDto) {
    return this.prisma.seoPage.update({
      where: { key },
      data: { ...dto, schemaMarkup: dto.schemaMarkup as unknown as Prisma.InputJsonValue },
    });
  }

  deleteSeoPage(key: string) {
    return this.prisma.seoPage.delete({ where: { key } });
  }

  listBlogPosts() {
    return this.prisma.blogPost.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] });
  }

  createBlogPost(dto: CreateBlogPostDto) {
    return this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        titleEn: dto.titleEn,
        titleAr: dto.titleAr,
        excerptEn: dto.excerptEn,
        excerptAr: dto.excerptAr,
        contentEn: dto.contentEn,
        contentAr: dto.contentAr,
        coverImage: dto.coverImage,
        authorName: dto.authorName,
        tags: (dto.tags || []) as unknown as Prisma.InputJsonValue,
        status: (dto.status?.toUpperCase() as BlogStatus) || "DRAFT",
        publishedAt: dto.status?.toUpperCase() === "PUBLISHED" ? new Date() : null,
      },
    });
  }

  updateBlogPost(slug: string, dto: CreateBlogPostDto) {
    return this.prisma.blogPost.update({
      where: { slug },
      data: {
        slug: dto.slug,
        titleEn: dto.titleEn,
        titleAr: dto.titleAr,
        excerptEn: dto.excerptEn,
        excerptAr: dto.excerptAr,
        contentEn: dto.contentEn,
        contentAr: dto.contentAr,
        coverImage: dto.coverImage,
        authorName: dto.authorName,
        tags: (dto.tags || []) as unknown as Prisma.InputJsonValue,
        status: (dto.status?.toUpperCase() as BlogStatus) || "DRAFT",
        publishedAt: dto.status?.toUpperCase() === "PUBLISHED" ? new Date() : null,
      },
    });
  }

  deleteBlogPost(slug: string) {
    return this.prisma.blogPost.delete({ where: { slug } });
  }

  async exportSnapshot() {
    const [bootstrap, countries, cities, seoPages, blogPosts] = await Promise.all([
      this.getBootstrap(),
      this.listCountries(),
      this.listCities(),
      this.listSeoPages(),
      this.listBlogPosts(),
    ]);
    return {
      exportedAt: new Date().toISOString(),
      universities: bootstrap[0],
      directory: bootstrap[1],
      majors: bootstrap[2],
      faqs: bootstrap[3],
      settings: bootstrap[4],
      siteCopy: bootstrap[5],
      countries,
      cities,
      seoPages,
      blogPosts,
    };
  }

  async importSnapshot(dto: ImportSnapshotDto) {
    const snapshot = (dto.snapshot || {}) as Record<string, any>;
    
    // Clear relations and core entities to allow clean insert
    await this.prisma.universityVersion.deleteMany();
    await this.prisma.universityProgram.deleteMany();
    await this.prisma.universityAdmission.deleteMany();
    await this.prisma.universityReview.deleteMany();
    await this.prisma.universityScholarship.deleteMany();
    await this.prisma.universityGallery.deleteMany();
    await this.prisma.university.deleteMany();
    await this.prisma.directoryEntry.deleteMany();
    await this.prisma.city.deleteMany();
    await this.prisma.country.deleteMany();
    await this.prisma.major.deleteMany();
    await this.prisma.faq.deleteMany();

    if (Array.isArray(snapshot.majors)) {
      for (const major of snapshot.majors) {
        await this.createMajor(major as unknown as CreateMajorDto);
      }
    }
    if (Array.isArray(snapshot.faqs)) {
      for (const faq of snapshot.faqs) {
        await this.createFaq(faq as unknown as CreateFaqDto);
      }
    }
    if (Array.isArray(snapshot.directory)) {
      for (const entry of snapshot.directory) {
        await this.createDirectoryEntry(entry as unknown as CreateDirectoryEntryDto);
      }
    }
    if (Array.isArray(snapshot.universities)) {
      for (const uni of snapshot.universities) {
        await this.createUniversity(uni as unknown as CreateUniversityDto);
      }
    }

    await this.prisma.$transaction(async (tx) => {
      if (snapshot.settings) {
        await tx.siteSettings.upsert({ where: { id: snapshot.settings.id || "site-settings" }, update: snapshot.settings as Prisma.SiteSettingsUpdateInput, create: snapshot.settings as Prisma.SiteSettingsCreateInput });
      }
      if (snapshot.siteCopy) {
        await tx.siteCopy.upsert({ where: { id: snapshot.siteCopy.id || "site-copy" }, update: { data: snapshot.siteCopy.data as Prisma.InputJsonValue }, create: { id: snapshot.siteCopy.id || "site-copy", data: snapshot.siteCopy.data as Prisma.InputJsonValue } });
      }
      if (Array.isArray(snapshot.blogPosts)) {
        await tx.blogPost.deleteMany();
        for (const post of snapshot.blogPosts) {
          await tx.blogPost.create({ data: { ...post, tags: post.tags as Prisma.InputJsonValue } });
        }
      }
      if (Array.isArray(snapshot.seoPages)) {
        await tx.seoPage.deleteMany();
        for (const page of snapshot.seoPages) {
          await tx.seoPage.create({ data: { ...page, schemaMarkup: page.schemaMarkup as Prisma.InputJsonValue } });
        }
      }
    });
    return { ok: true };
  }
}
