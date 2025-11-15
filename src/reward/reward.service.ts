import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './reward.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
  ) {}

  /**
   * 리워드 구매
   * @param reward
   * @returns
   */
  async buyGoods(childId: number, goodsName: string, usedCandy: number) {
    const reward = this.rewardRepository.create({
      childId,
      goodsName,
      usedCandy: usedCandy,
    });
    return this.rewardRepository.save(reward);
  }

  /**
   * 리워드 조회
   * @param childId
   * @returns
   */
  async getRewards(childId: number) {
    const allRewards = await this.rewardRepository.find({ where: { childId } });
    const totalUsedCandy = allRewards.reduce(
      (acc, reward) => acc + reward.usedCandy,
      0,
    );

    return {
      rewards: allRewards,
      totalUsedCandy,
    };
  }
}
