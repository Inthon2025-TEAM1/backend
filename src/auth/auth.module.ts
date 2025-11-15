import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseModule } from './firebase/firebase.module';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLoadInterceptor } from './interceptor/auth.interceptor';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserLoadInterceptor],
  imports: [FirebaseModule, TypeOrmModule.forFeature([User])],
  exports: [AuthService, UserLoadInterceptor], // 다른 모듈에서 사용할 수 있도록 export
})
export class AuthModule {}
