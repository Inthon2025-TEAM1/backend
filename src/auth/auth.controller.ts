import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from './firebase/firebase-auth.guard';
import { UserLoadInterceptor } from './interceptor/auth.interceptor';

@Controller('auth')
export class AuthController {
  @Get('login')
  @UseInterceptors(UserLoadInterceptor)
  @UseGuards(FirebaseAuthGuard)
  async login(@Req() req: Request) {
    return {
      message: 'Login successful',
      user: req.user,
    };
  }
}
