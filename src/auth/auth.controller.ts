import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from './firebase/firebase-auth.guard';
import { UserLoadInterceptor } from './interceptor/auth.interceptor';
import { AuthService } from './auth.service';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { CreateUserResDto } from './dto/create-user.res.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(FirebaseAuthGuard)
  async register(
    @Req() req: Request,
    @Body() createUserReqDto: CreateUserReqDto,
  ): Promise<CreateUserResDto> {
    const firebaseUser = req.user;

    const newUser = await this.authService.registerUser(
      firebaseUser,
      createUserReqDto,
    );

    return CreateUserResDto.fromEntity(newUser);
  }

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
