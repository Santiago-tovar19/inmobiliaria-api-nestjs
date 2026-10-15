import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrokerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;
}
