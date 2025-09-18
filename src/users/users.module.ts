import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  exports: [UsersService],
})
export class UsersModule {}
