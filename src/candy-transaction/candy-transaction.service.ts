import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandyTransaction } from './candy-transaction.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CandyTransactionService {
  constructor(
    @InjectRepository(CandyTransaction)
    private candyTransactionRepository: Repository<CandyTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async spendCandy(
    userId: number,
    amount: number,
    itemName: string,
  ): Promise<{ success: boolean; remainingCandy: number }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.candy < amount) {
      throw new BadRequestException('Insufficient candy balance');
    }

    // Deduct candy
    user.candy -= amount;
    await this.userRepository.save(user);

    // Log transaction
    await this.candyTransactionRepository.save({
      userId,
      type: 'spend',
      amount,
      itemName,
    });

    return {
      success: true,
      remainingCandy: user.candy,
    };
  }

  async getCandyBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.candy;
  }
}
