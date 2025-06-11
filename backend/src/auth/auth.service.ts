import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/login-auth.input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const { email, password } = dto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return this.generateTokens(newUser.id, newUser.email);
  }

  async login(dto: AuthDto) {
    const { email, password } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    return this.generateTokens(existingUser.id, existingUser.email);
  }

  async logout(userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

    await this.updateRefreshToken(userId, hashedRefreshToken);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, refreshTokenHash: true },
    });

    if (!user || !user.refreshTokenHash) {
      throw new Error('Acces denied');
    }

    console.log('RefreshToken from request:', refreshToken);
    console.log('RefreshToken hash from DB:', user.refreshTokenHash);

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!isRefreshTokenValid) {
      throw new Error('Access denied');
    }

    return this.generateTokens(user.id, user.email);
  }

  async updateRefreshToken(userId: string, refreshTokenHash: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }
}
