import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { Role } from '../entities/role.entity';
import { RolesModule } from '../roles/roles.module'; // ✅ ДОБАВИТЬ этот импорт

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    JwtModule.register({
      secret: 'aqwsedrftgyhujikolpmnbvcxzasdfgh',
      signOptions: { expiresIn: '1h' },
    }),
    RolesModule, // ✅ ДОБАВИТЬ эту строку
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}