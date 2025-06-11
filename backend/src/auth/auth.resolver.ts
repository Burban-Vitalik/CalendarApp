import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/login-auth.input';
import { AuthResponse, RefreshTokenDto } from './dto/auth.input';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 15 * 60 * 1000,
  sameSite: 'lax' as const,
};

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean)
  async register(@Args('registerAuthInput') registerAuthInput: AuthDto, @Context() context: any) {
    const tokens = await this.authService.register(registerAuthInput);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (context?.res?.cookie) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.res.cookie('access_token', tokens.access_token, cookieOptions);
      return true;
    } else {
      console.warn('res.cookie не доступний у GraphQL контексті');
      return false;
    }
  }

  @Mutation(() => Boolean)
  async login(@Args('loginAuthInput') loginAuthInput: AuthDto, @Context() context: any) {
    const tokens = await this.authService.login(loginAuthInput);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (context?.res?.cookie) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.res.cookie('access_token', tokens.access_token, cookieOptions);
      return true;
    } else {
      console.warn('res.cookie не доступний у GraphQL контексті');
      return false;
    }
  }

  @Mutation(() => Boolean)
  async logout(@Args('userId') userId: string, @Context() context: any) {
    await this.authService.logout(userId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (context?.res?.cookie) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      context.res.cookie('access_token', '', cookieOptions);
    } else {
      console.warn('res.cookie не доступний у GraphQL контексті');
    }
  }

  @Mutation(() => AuthResponse)
  async refreshTokens(@Args('data') data: RefreshTokenDto, @Context() context: any): Promise<AuthResponse> {
    const tokens = await this.authService.refreshTokens(data.userId, data.refreshToken);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (context?.res?.cookie) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.res.cookie('access_token', tokens.access_token, cookieOptions);
    } else {
      console.warn('res.cookie не доступний у GraphQL контексті');
    }

    return tokens;
  }
}
