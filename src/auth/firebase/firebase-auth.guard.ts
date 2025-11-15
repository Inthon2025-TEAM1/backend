// src/auth/firebase-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(@Inject('FIREBASE_ADMIN') private firebase: admin.app.App) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('No token provided');
    const token = authHeader.split(' ')[1];

    try {
      const decoded = await this.firebase.auth().verifyIdToken(token);
      req.user = decoded; // Firebase 유저 정보
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
