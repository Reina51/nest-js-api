import { Controller, Post, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { id: number; username: string }; // comes from JWT payload
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { username: string; phone: string; password: string }) {
    const { username, phone, password } = body;
    return this.usersService.register(username, phone, password);
  }

  @Post('login')
  async login(@Body() body: { usernameOrPhone: string; password: string }) {
    const { usernameOrPhone, password } = body;
    return this.usersService.login(usernameOrPhone, password);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: AuthRequest, @Body() body: { username?: string; phone?: string; password?: string }) {
    const userId = req.user.id;
    return this.usersService.updateProfile(userId, body);
  }
}
