import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DomainsModule } from './domains/domains.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [UsersModule, AuthModule, DomainsModule, CategoriesModule],
  providers: [PrismaService],
})
export class AppModule {}
