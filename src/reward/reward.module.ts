import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './reward.entity';

@Module({
  providers: [RewardService],
  controllers: [RewardController],
  imports: [TypeOrmModule.forFeature([Reward])],
})
export class RewardModule {}
