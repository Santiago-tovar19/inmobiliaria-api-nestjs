import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreatePropertyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  property_type_id?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  mls_number?: string;

  @IsOptional()
  @IsString()
  construction_year?: string;

  @IsOptional()
  @IsString()
  location_type?: string;

  @IsOptional()
  @IsString()
  bedrooms?: string;

  @IsOptional()
  @IsString()
  bathrooms?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsNumber()
  currency_id?: number;

  @IsOptional()
  @IsString()
  youtube_link?: string;

  @IsOptional()
  @IsNumber()
  status_id?: number;

  @IsOptional()
  @IsNumber()
  contract_type_id?: number;

  @IsOptional()
  @IsString()
  lat?: string;

  @IsOptional()
  @IsString()
  lon?: string;

  @IsOptional()
  @IsNumber()
  parking?: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsNumber()
  created_by?: number;
}
