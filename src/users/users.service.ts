import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, phone: string, password: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { phone }] },
    });
    if (existingUser) throw new BadRequestException('Username or phone already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { username, phone, password: hashedPassword },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(usernameOrPhone: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username: usernameOrPhone }, { phone: usernameOrPhone }] },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { message: 'Login successful', access_token: accessToken };
  }

  // src/users/users.service.ts
async updateProfile(
  userId: number,
  data: { username?: string; phone?: string; password?: string }
) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  // Check for username conflict
  if (data.username && data.username !== user.username) {
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) throw new BadRequestException('Username already exists');
  }

  // Check for phone conflict
  if (data.phone && data.phone !== user.phone) {
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (existingPhone) throw new BadRequestException('Phone already exists');
  }

  // Hash password if updating
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // Update only the provided fields
  const updatedUser = await this.prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.username && { username: data.username }),
      ...(data.phone && { phone: data.phone }),
      ...(data.password && { password: data.password }),
    },
  });

  const { password, ...result } = updatedUser;
  return {
    message: 'User updated successfully',
    user: result,
  };
}

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
