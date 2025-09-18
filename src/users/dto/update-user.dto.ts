import { IsOptional, IsString, MinLength, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsPhoneNumber('LB')
  phone?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
