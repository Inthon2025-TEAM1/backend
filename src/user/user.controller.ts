import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole, User } from './user.entity';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';
import { UserLoadInterceptor } from '../auth/interceptor/auth.interceptor';
import {
  CurrentUserId,
  CurrentDbUser,
} from '../auth/decorators/current-user.decorator';

@Controller('user')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(UserLoadInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('set-role')
  async setRole(@CurrentUserId() userId: number, @Body('role') role: UserRole) {
    return this.userService.setRole(userId, role);
  }

  @Get('role')
  async getRole(@CurrentDbUser() user: User) {
    return { role: user.role };
  }

  @Get('me')
  async getCurrentUser(@CurrentDbUser() user: User) {
    console.log('========================================');
    console.log('Current User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Candy:', user.candy);
    console.log('========================================');
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      candy: user.candy,
    };
  }

  @Post('children')
  async addChild(
    @CurrentUserId() userId: number,
    @Body('childEmail') childEmail: string,
  ) {
    return this.userService.addChild(userId, childEmail);
  }

  @Get('children')
  async getChildren(@CurrentUserId() userId: number) {
    return this.userService.getChildren(userId);
  }

  @Get('reward-candy-history')
  async getRewardCandyHistory(@CurrentUserId() userId: number) {
    return this.userService.getRewardCandyHistory(userId);
  }

  @Get('candy')
  async getCandy(@CurrentDbUser() user: User) {
    return { candy: user.candy };
  }

  @Post('spend-candy')
  async spendCandy(
    @CurrentUserId() userId: number,
    @Body('amount') amount: number,
    @Body('itemName') itemName: string,
  ) {
    return this.userService.spendCandy(userId, amount, itemName);
  }

  @Get('purchase-history')
  async getPurchaseHistory(@CurrentUserId() userId: number) {
    return this.userService.getPurchaseHistory(userId);
  }

  @Get('rewards')
  async getChildRewards(
    @CurrentUserId() userId: number,
    @Query('month') month?: string,
  ) {
    return this.userService.getChildRewards(userId, month);
  }
}
