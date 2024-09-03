import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MailerModule } from '../mailer/mailer.module';
import { Account } from 'src/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account]), MailerModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService]
})
export class AuthModule {}
