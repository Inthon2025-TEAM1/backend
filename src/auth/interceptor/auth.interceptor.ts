import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class UserLoadInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const firebaseUser = req.user;

    console.log('firebaseUser', firebaseUser);
    req.user = await this.authService.findOrCreateFromFirebase(firebaseUser);

    return next.handle();
  }
}
