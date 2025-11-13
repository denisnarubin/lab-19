import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    private readonly jwtService: JwtService,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultRole = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      roles: defaultRole ? [defaultRole] : [],
    });

    return this.usersRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<User> {
  const user = await this.usersRepository.findOne({
    where: { username },
    relations: ['roles'],
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return user;
}

  login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles?.map((r) => r.name) || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
