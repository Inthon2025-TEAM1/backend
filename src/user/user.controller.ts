import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from './user.entity';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';

@Controller('user')
@UseGuards(FirebaseAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('set-role')
  async setRole(@Req() req, @Body('role') role: UserRole) {
    return this.userService.setRole(req.user.id, role);
  }

  @Get('role')
  async getRole(@Req() req) {
    return { role: req.user.role };
  }

  @Post('children')
  async addChild(@Req() req, @Body('childEmail') childEmail: string) {
    return this.userService.addChild(req.user.id, childEmail);
  }

  @Get('children')
  async getChildren(@Req() req) {
    return this.userService.getChildren(req.user.id);
  }

  @Get('reward-candy-history')
  async getRewardCandyHistory(@Req() req) {
    return this.userService.getRewardCandyHistory(req.user.id);
  }
}
