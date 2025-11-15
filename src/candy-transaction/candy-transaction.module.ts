import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandyTransaction } from './candy-transaction.entity';
import { CandyTransactionService } from './candy-transaction.service';
import { CandyTransactionController } from './candy-transaction.controller';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CandyTransaction, User])],
  controllers: [CandyTransactionController],
  providers: [CandyTransactionService],
  exports: [CandyTransactionService],
})
export class CandyTransactionModule {}
