import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<User> {
    const { username, email, password } = registerDto;

    return this.authService.register(username, email, password);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() _loginDto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }
}
