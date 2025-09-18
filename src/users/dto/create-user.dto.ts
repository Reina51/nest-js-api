// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsPhoneNumber, MinLength, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsPhoneNumber('LB')
  phone: string;


  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
