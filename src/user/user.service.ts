import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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

  // Candy 업데이트
  async updateCandy(userId: number, amount: number): Promise<number> {
    try {
      await this.userRepository.increment(
        { id: userId }, // where 조건
        'candy', // 증가시킬 컬럼명
        amount, // +5
      );
      return amount;
    } catch (error) {
      throw new InternalServerErrorException('Candy 업데이트 실패');
    }
  }
}
