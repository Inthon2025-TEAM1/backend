import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAttempt } from 'src/quiz/quiz-attempt.entity';
import {
  Not,
  Repository,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  DataSource,
} from 'typeorm';
import { User, UserRole } from './user.entity';
import { CandyTransaction } from '../candy-transaction/candy-transaction.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
    @InjectRepository(CandyTransaction)
    private candyTransactionRepository: Repository<CandyTransaction>,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }
  // Role 설정
  async setRole(userId: number, role: UserRole): Promise<User> {
    await this.userRepository.update(userId, { role });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  // 자녀 추가 (Parent → Child 연결)
  async addChild(parentId: number, childEmail: string): Promise<User> {
    const child = await this.userRepository.findOne({
      where: { email: childEmail },
    });
    if (!child) throw new Error('Child not found');

    await this.userRepository.update(child.id, {
      parentId,
      role: UserRole.CHILD,
    });
    return child;
  }

  // Parent의 자녀 목록 조회
  async getChildren(parentId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { parentId },
    });
  }
  // 자녀 제거 (Parent-Child 연결 해제)
  async removeChild(
    parentId: number,
    childId: number,
  ): Promise<{ success: boolean; message: string }> {
    const child = await this.userRepository.findOne({
      where: { id: childId, parentId },
    });
    if (!child) throw new Error('Child not found');
    await this.userRepository.update(childId, { parentId: null });
    return { success: true, message: 'Child removed successfully' };
  }
  // Candy 업데이트
  async incrementCandy(userId: number, amount: number): Promise<number> {
    try {
      await this.userRepository.increment(
        { id: userId }, // where 조건
        'candy', // 증가시킬 컬럼명
        amount, // +5
      );
      return amount;
    } catch (error) {
      throw new InternalServerErrorException('Candy 업데이트 실패', error);
    }
  }

  async getRewardCandyHistory(
    childId: number,
  ): Promise<{ rewardCandy: number; createdAt: Date }[]> {
    const attempts = await this.attemptRepository.find({
      where: {
        rewardCandy: Not(0),
        childId,
      },
      select: ['rewardCandy', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    return attempts.map((attempt) => ({
      rewardCandy: attempt.rewardCandy,
      createdAt: attempt.createdAt,
    }));
  }

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

    user.candy -= amount;

    await this.userRepository.save(user);

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

  async getPurchaseHistory(userId: number) {
    return this.candyTransactionRepository.find({
      where: { userId, type: 'spend' },
      order: { createdAt: 'DESC' },
    });
  }

  async getChildRewards(childId: number, month?: string) {
    let whereCondition: any = { childId };

    if (month) {
      const startDate = new Date(month + '-01');
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        1,
      );
      whereCondition.createdAt = Between(startDate, endDate);
    }

    const attempts = await this.attemptRepository.find({
      where: whereCondition,
      relations: ['quiz'],
      order: { createdAt: 'DESC' },
    });

    const stats = {
      totalAttempts: attempts.length,
      correctCount: attempts.filter((a) => a.isCorrect).length,
      totalCandyEarned: attempts.reduce((sum, a) => sum + a.rewardCandy, 0),
    };

    // Map attempts to include question title from quiz relation
    const mappedAttempts = attempts.map((attempt) => {
      let questionTitle = '제목 없음';
      if (attempt.quiz?.question) {
        const question = attempt.quiz.question as any;
        questionTitle = question.text || question.title || JSON.stringify(question);
      }

      return {
        id: attempt.id,
        quizId: attempt.quizId,
        questionTitle,
        selectedChoice: attempt.selectedChoice,
        isCorrect: attempt.isCorrect,
        rewardCandy: attempt.rewardCandy,
        createdAt: attempt.createdAt,
      };
    });

    // 보상을 받은 내역만 필터링 (rewardCandy > 0)
    const rewardAttempts = mappedAttempts.filter(
      (attempt) => attempt.rewardCandy > 0,
    );

    return {
      attempts: mappedAttempts, // 모든 풀이 내역
      rewardAttempts, // 보상을 받은 내역만
      stats,
    };
  }

  async getChildrenCount(userId: number) {
    return this.userRepository.count({
      where: { parentId: userId, role: UserRole.CHILD },
    });
  }
}
