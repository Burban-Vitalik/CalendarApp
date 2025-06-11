import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}

@InputType()
export class RefreshTokenDto {
  @Field()
  userId: string;

  @Field()
  refreshToken: string;
}
