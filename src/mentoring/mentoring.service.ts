import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MentoringRequest } from './mentoring-request.entity';
import { MentoringRequestDto } from './mentoring.dto';

@Injectable()
export class MentoringService {
  constructor(
    @InjectRepository(MentoringRequest)
    private mentoringRequestRepository: Repository<MentoringRequest>,
  ) {}

  async createMentoringRequest(parentId: number, request: MentoringRequestDto) {
    return this.mentoringRequestRepository.save({
      parentId,
      title: request.title,
      childInfo: request.childInfo,
      requirement: request.requirement,
    });
  }
  async getMentoringRequestsByParentId(parentId: number) {
    return this.mentoringRequestRepository.find({ where: { parentId } });
  }
}
