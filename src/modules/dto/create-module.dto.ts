import { IsString, IsOptional } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  route?: string;
}
