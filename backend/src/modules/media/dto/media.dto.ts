import { IsOptional, IsString } from "class-validator";

export class MediaQueryDto {
  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsString()
  folder?: string;
}
