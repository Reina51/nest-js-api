import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  usernameOrPhone: string; // allow login with username or phone

  @IsString()
  @IsNotEmpty()
  password: string;
}
