import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CandyTransactionService } from './candy-transaction.service';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';
import { UserLoadInterceptor } from '../auth/interceptor/auth.interceptor';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@Controller('candy')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(UserLoadInterceptor)
export class CandyTransactionController {
  constructor(
    private readonly candyTransactionService: CandyTransactionService,
  ) {}

  @Post('spend')
  async spendCandy(
    @CurrentUserId() userId: number,
    @Body('amount') amount: number,
    @Body('itemName') itemName: string,
  ) {
    return this.candyTransactionService.spendCandy(userId, amount, itemName);
  }
}
