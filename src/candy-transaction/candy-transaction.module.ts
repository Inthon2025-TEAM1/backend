import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandyTransaction } from './candy-transaction.entity';
import { CandyTransactionService } from './candy-transaction.service';
import { CandyTransactionController } from './candy-transaction.controller';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CandyTransaction, User]), AuthModule],
  controllers: [CandyTransactionController],
  providers: [CandyTransactionService],
  exports: [CandyTransactionService],
})
export class CandyTransactionModule {}
