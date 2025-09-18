import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // file name for your DB
      entities: [User],
      synchronize: true,     // auto-create tables
    }),
    AuthModule, 
    UsersModule,
  ],
})
export class AppModule {}
