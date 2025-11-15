import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CandyTransactionService } from './candy-transaction.service';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';

@Controller('candy')
@UseGuards(FirebaseAuthGuard)
export class CandyTransactionController {
  constructor(
    private readonly candyTransactionService: CandyTransactionService,
  ) {}

  @Post('spend')
  async spendCandy(
    @Req() req,
    @Body('amount') amount: number,
    @Body('itemName') itemName: string,
  ) {
    return this.candyTransactionService.spendCandy(
      req.user.id,
      amount,
      itemName,
    );
  }
}
