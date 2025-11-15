import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Firebase DecodedIdToken을 가져오는 데코레이터
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): DecodedIdToken => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * DB User ID를 가져오는 데코레이터
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.dbUser?.id;
  },
);

/**
 * DB User 전체를 가져오는 데코레이터
 */
export const CurrentDbUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.dbUser;
  },
);
