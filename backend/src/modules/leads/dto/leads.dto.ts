import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateLeadDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  preferredCountry?: string;

  @IsOptional()
  @IsString()
  preferredUniversity?: string;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  referralSource?: string;

  @IsOptional()
  @IsString()
  utmSource?: string;

  @IsOptional()
  @IsString()
  utmMedium?: string;

  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @IsOptional()
  @IsString()
  utmTerm?: string;

  @IsOptional()
  @IsString()
  utmContent?: string;
}

export class LeadsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}

export class UpdateLeadDto {
  @IsOptional()
  @IsEnum(["NEW", "CONTACTED", "INTERESTED", "DOCUMENTS_PENDING", "APPLIED", "ACCEPTED", "REJECTED", "ARCHIVED"] as const)
  status?: "NEW" | "CONTACTED" | "INTERESTED" | "DOCUMENTS_PENDING" | "APPLIED" | "ACCEPTED" | "REJECTED" | "ARCHIVED";

  @IsOptional()
  @IsString()
  assignedToId?: string;
}

export class CreateLeadNoteDto {
  @IsString()
  note!: string;

  @IsOptional()
  @IsString()
  type?: string;
}
