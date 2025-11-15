import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class UserLoadInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserLoadInterceptor.name);

  constructor(private authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const firebaseUser = req.user; // DecodedIdToken

    if (firebaseUser?.uid) {
      this.logger.log(`Loading user from Firebase UID: ${firebaseUser.uid}`);
      console.log('firebaseUser', firebaseUser);
      // DB User를 별도 필드에 저장 (기존 req.user는 유지)
      const dbUser =
        await this.authService.findOrCreateFromFirebase(firebaseUser);

      if (dbUser) {
        this.logger.log(
          `User loaded successfully - ID: ${dbUser.id}, Email: ${dbUser.email}, Role: ${dbUser.role}`,
        );
        req.dbUser = dbUser; // DB User를 별도 필드에 추가
      } else {
        this.logger.warn(
          `User not found in DB for Firebase UID: ${firebaseUser.uid}`,
        );
      }
    }

    return next.handle();
  }
}
