import { Inject, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { TokenPayloadDto } from '@/frontier/dto/token-payload.dto';

export class ValidateTokenQuery extends Query<TokenPayloadDto> {
  constructor(public readonly token: string) {
    super();
  }
}

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler implements IQueryHandler<ValidateTokenQuery> {
  @Inject() private readonly jwtService!: JwtService;

  public async execute({
    token,
  }: ValidateTokenQuery): Promise<TokenPayloadDto> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      return { citizenId: payload.sub };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
