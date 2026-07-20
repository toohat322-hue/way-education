import { PrismaClient } from "@prisma/client";
import { UNIVERSITIES } from "../../frontend/src/data/universities.js";
import { DIRECTORY } from "../../frontend/src/data/directory.js";
import { MAJORS } from "../../frontend/src/data/majors.js";
import { FAQS } from "../../frontend/src/data/faqs.js";
import { SETTINGS } from "../../frontend/src/data/settings.js";
import { STRINGS } from "../../frontend/src/data/translations.js";

const prisma = new PrismaClient();

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

async function ensureCountry(country) {
  const code = slugify(country.en || country).slice(0, 24);
  return prisma.country.upsert({
    where: { code },
    update: { nameEn: country.en || country, nameAr: country.ar || country },
    create: {
      code,
      nameEn: country.en || country,
      nameAr: country.ar || country,
    },
  });
}

async function ensureCity(countryId, city) {
  const nameEn = city.en || city;
  const nameAr = city.ar || city;
  const existing = await prisma.city.findFirst({
    where: { countryId, nameEn },
  });
  if (existing) {
    return prisma.city.update({ where: { id: existing.id }, data: { nameAr } });
  }
  return prisma.city.create({ data: { countryId, nameEn, nameAr } });
}

async function seedSettingsAndCopy() {
  await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: {
      whatsapp: SETTINGS.whatsapp,
      websiteName: "Way Education",
      supportEmail: "contact@wayeducations.com",
      supportPhone: "+90 (501) 600 00 33",
      addressEn: "Istanbul, Türkiye",
      addressAr: "إسطنبول، تركيا",
      seoTitle: "Way Education",
      seoDescription:
        "University admissions platform for Türkiye and Northern Cyprus.",
      socialLinks: {},
      analytics: {},
      featureFlags: {},
      languages: ["en", "ar"],
    },
    create: {
      id: "site-settings",
      whatsapp: SETTINGS.whatsapp,
      websiteName: "Way Education",
      supportEmail: "contact@wayeducations.com",
      supportPhone: "+90 (501) 600 00 33",
      addressEn: "Istanbul, Türkiye",
      addressAr: "إسطنبول، تركيا",
      seoTitle: "Way Education",
      seoDescription:
        "University admissions platform for Türkiye and Northern Cyprus.",
      socialLinks: {},
      analytics: {},
      featureFlags: {},
      languages: ["en", "ar"],
    },
  });

  await prisma.siteCopy.upsert({
    where: { id: "site-copy" },
    update: { data: STRINGS },
    create: { id: "site-copy", data: STRINGS },
  });
}

async function seedMajors() {
  for (const major of MAJORS) {
    await prisma.major.upsert({
      where: { slug: slugify(major.name.en) },
      update: {
        iconName: major.iconName,
        nameEn: major.name.en,
        nameAr: major.name.ar,
        count: major.count,
      },
      create: {
        slug: slugify(major.name.en),
        iconName: major.iconName,
        nameEn: major.name.en,
        nameAr: major.name.ar,
        count: major.count,
      },
    });
  }
}

async function seedFaqs() {
  await prisma.faq.deleteMany({ where: { scope: "homepage" } });
  for (const [index, faq] of FAQS.entries()) {
    await prisma.faq.create({
      data: {
        scope: "homepage",
        questionEn: faq.q.en,
        questionAr: faq.q.ar,
        answerEn: faq.a.en,
        answerAr: faq.a.ar,
        sortOrder: index,
      },
    });
  }
}

async function seedDirectory() {
  for (const entry of DIRECTORY) {
    const country = await ensureCountry({
      en: entry.country,
      ar: entry.country,
    });
    const city = await ensureCity(country.id, {
      en: entry.city,
      ar: entry.city,
    });
    await prisma.directoryEntry.upsert({
      where: { slug: entry.id },
      update: {
        name: entry.name,
        type: entry.type,
        founded: entry.founded,
        countryId: country.id,
        cityId: city.id,
      },
      create: {
        slug: entry.id,
        name: entry.name,
        type: entry.type,
        founded: entry.founded,
        countryId: country.id,
        cityId: city.id,
      },
    });
  }
}

async function seedUniversities() {
  for (const university of UNIVERSITIES) {
    const country = await ensureCountry(university.country);
    const city = await ensureCity(country.id, university.city);
    const existing = await prisma.university.findUnique({
      where: { slug: university.id },
    });

    const payload = {
      slug: university.id,
      name: university.name,
      initial: university.initial,
      grad: university.grad,
      image: university.image,
      logo: university.logo,
      photoCreditText: university.photoCredit?.text,
      photoCreditUrl: university.photoCredit?.url,
      typeEn: university.type.en,
      typeAr: university.type.ar,
      languageEn: university.language.en,
      languageAr: university.language.ar,
      tuition: university.tuition,
      rating: university.rating,
      reviewsCount: university.reviews,
      ranking: university.ranking,
      founded: String(university.founded ?? ""),
      studentsCount: university.studentsCount,
      intlStudents: university.intl,
      scholarship: university.scholarship,
      gpaRequirement: university.gpaReq,
      aboutEn: university.about.en,
      aboutAr: university.about.ar,
      featured: Boolean(university.featured),
      active: university.active !== false,
      status: "PUBLISHED",
      cityId: city.id,
      countryId: country.id,
      contactPhone: university.contact?.phone,
      contactEmail: university.contact?.email,
      contactWebsite: university.contact?.website,
      socialFacebook: university.social?.facebook,
      socialInstagram: university.social?.instagram,
      socialLinkedin: university.social?.linkedin,
    };

    if (!existing) {
      await prisma.university.create({
        data: {
          ...payload,
          programs: {
            create: university.majors.map((major, index) => ({
              nameEn: major.name.en,
              nameAr: major.name.ar,
              fee: major.fee,
              iconName: major.iconName,
              sortOrder: index,
            })),
          },
          admissions: {
            create: [
              {
                documentsEn: university.docs.en,
                documentsAr: university.docs.ar,
                notesEn: university.gpaReq,
                notesAr: university.gpaReq,
              },
            ],
          },
          reviews: {
            create: university.testimonials.map((review) => ({
              studentName: review.name,
              rating: review.rating,
              textEn: review.text.en,
              textAr: review.text.ar,
            })),
          },
          scholarships:
            university.scholarship > 0
              ? {
                  create: [
                    {
                      titleEn: `${university.scholarship}% Scholarship`,
                      titleAr: `منحة ${university.scholarship}%`,
                      percentage: university.scholarship,
                      descriptionEn: `Scholarship support up to ${university.scholarship}%`,
                      descriptionAr: `دعم منح يصل إلى ${university.scholarship}%`,
                    },
                  ],
                }
              : undefined,
          gallery: {
            create: (university.gallery || []).map((url, index) => ({
              url,
              sortOrder: index,
            })),
          },
          versions: {
            create: [{ version: 1, snapshot: university }],
          },
        },
      });
      continue;
    }

    await prisma.university.update({
      where: { slug: university.id },
      data: {
        ...payload,
        programs: {
          deleteMany: {},
          create: university.majors.map((major, index) => ({
            nameEn: major.name.en,
            nameAr: major.name.ar,
            fee: major.fee,
            iconName: major.iconName,
            sortOrder: index,
          })),
        },
        admissions: {
          deleteMany: {},
          create: [
            {
              documentsEn: university.docs.en,
              documentsAr: university.docs.ar,
              notesEn: university.gpaReq,
              notesAr: university.gpaReq,
            },
          ],
        },
        reviews: {
          deleteMany: {},
          create: university.testimonials.map((review) => ({
            studentName: review.name,
            rating: review.rating,
            textEn: review.text.en,
            textAr: review.text.ar,
          })),
        },
        scholarships:
          university.scholarship > 0
            ? {
                deleteMany: {},
                create: [
                  {
                    titleEn: `${university.scholarship}% Scholarship`,
                    titleAr: `منحة ${university.scholarship}%`,
                    percentage: university.scholarship,
                    descriptionEn: `Scholarship support up to ${university.scholarship}%`,
                    descriptionAr: `دعم منح يصل إلى ${university.scholarship}%`,
                  },
                ],
              }
            : { deleteMany: {} },
        gallery: {
          deleteMany: {},
          create: (university.gallery || []).map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
      },
    });
  }
}

async function main() {
  await seedSettingsAndCopy();
  await seedMajors();
  await seedFaqs();
  await seedDirectory();
  await seedUniversities();
  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
