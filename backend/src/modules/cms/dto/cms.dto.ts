import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

class LocalizedTextDto {
  @IsString()
  en!: string;

  @IsString()
  ar!: string;
}

class LocalizedStringArrayDto {
  @IsArray()
  @IsString({ each: true })
  en!: string[];

  @IsArray()
  @IsString({ each: true })
  ar!: string[];
}

class UniversityProgramDto {
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  name!: LocalizedTextDto;

  @IsInt()
  @Min(0)
  fee!: number;

  @IsString()
  iconName!: string;
}

class UniversityReviewDto {
  @IsString()
  name!: string;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  text!: LocalizedTextDto;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}

class ContactDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  website?: string;
}

class SocialDto {
  @IsOptional()
  @IsUrl({ require_tld: false })
  facebook?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  instagram?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  linkedin?: string;
}

class PhotoCreditDto {
  @IsString()
  text!: string;

  @IsUrl({ require_tld: false })
  url!: string;
}

export class CreateUniversityDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsArray()
  @IsString({ each: true })
  gallery!: string[];

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  city!: LocalizedTextDto;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  country!: LocalizedTextDto;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  type!: LocalizedTextDto;

  @IsInt()
  @Min(0)
  tuition!: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating!: number;

  @IsInt()
  @Min(0)
  reviews!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ranking?: number;

  @IsString()
  founded!: string;

  @IsOptional()
  @IsString()
  studentsCount?: string;

  @IsOptional()
  @IsString()
  intl?: string;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  language!: LocalizedTextDto;

  @IsInt()
  @Min(0)
  scholarship!: number;

  @IsOptional()
  @IsString()
  gpaReq?: string;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  about!: LocalizedTextDto;

  @ValidateNested()
  @Type(() => LocalizedStringArrayDto)
  docs!: LocalizedStringArrayDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UniversityProgramDto)
  majors!: UniversityProgramDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UniversityReviewDto)
  testimonials!: UniversityReviewDto[];

  @ValidateNested()
  @Type(() => ContactDto)
  contact!: ContactDto;

  @ValidateNested()
  @Type(() => SocialDto)
  social!: SocialDto;

  @IsBoolean()
  featured!: boolean;

  @IsBoolean()
  active!: boolean;

  @IsString()
  grad!: string;

  @IsString()
  initial!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhotoCreditDto)
  photoCredit?: PhotoCreditDto;
}

export class UpdateUniversityDto extends CreateUniversityDto {}

export class CreateDirectoryEntryDto {
  @IsString()
  name!: string;

  @IsString()
  city!: string;

  @IsString()
  country!: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  founded?: string;
}

export class UpdateDirectoryEntryDto extends CreateDirectoryEntryDto {}

export class CreateMajorDto {
  @IsString()
  iconName!: string;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  name!: LocalizedTextDto;

  @IsInt()
  @Min(0)
  count!: number;
}

export class UpdateMajorDto extends CreateMajorDto {}

export class CreateFaqDto {
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  q!: LocalizedTextDto;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  a!: LocalizedTextDto;
}

export class UpdateFaqDto extends CreateFaqDto {}

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  websiteName?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsString()
  addressEn?: string;

  @IsOptional()
  @IsString()
  addressAr?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  analytics?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  featureFlags?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];
}

export class UpdateSiteCopyDto {
  @IsObject()
  data!: Record<string, unknown>;
}

export class CreateCountryDto {
  @IsString()
  code!: string;

  @IsString()
  nameEn!: string;

  @IsString()
  nameAr!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCountryDto extends CreateCountryDto {}

export class CreateCityDto {
  @IsString()
  countryCode!: string;

  @IsString()
  nameEn!: string;

  @IsString()
  nameAr!: string;
}

export class UpdateCityDto extends CreateCityDto {}

export class CreateSeoPageDto {
  @IsString()
  key!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @IsOptional()
  @IsString()
  robots?: string;

  @IsOptional()
  @IsString()
  openGraphTitle?: string;

  @IsOptional()
  @IsString()
  openGraphDescription?: string;

  @IsOptional()
  @IsString()
  openGraphImage?: string;

  @IsOptional()
  @IsObject()
  schemaMarkup?: Record<string, unknown>;
}

export class UpdateSeoPageDto extends CreateSeoPageDto {}

export class CreateBlogPostDto {
  @IsString()
  slug!: string;

  @IsString()
  titleEn!: string;

  @IsString()
  titleAr!: string;

  @IsOptional()
  @IsString()
  excerptEn?: string;

  @IsOptional()
  @IsString()
  excerptAr?: string;

  @IsString()
  contentEn!: string;

  @IsString()
  contentAr!: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateBlogPostDto extends CreateBlogPostDto {}

export class ImportSnapshotDto {
  @IsObject()
  snapshot!: Record<string, unknown>;
}
