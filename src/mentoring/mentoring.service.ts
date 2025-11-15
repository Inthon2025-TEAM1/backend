import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MentoringRequest, MentoringStatus } from './mentoring-request.entity';
import { MentoringRequestDto, UpdateMentoringStatusDto } from './mentoring.dto';
import { Mentor, MentorStatus } from './mentor.entity';

@Injectable()
export class MentoringService {
  constructor(
    @InjectRepository(MentoringRequest)
    private mentoringRequestRepository: Repository<MentoringRequest>,
    @InjectRepository(Mentor)
    private mentorRepository: Repository<Mentor>,
  ) {}

  async createMentoringRequest(parentId: number, request: MentoringRequestDto) {
    return this.mentoringRequestRepository.save({
      parentId,
      childId: request.childId,
      title: request.title,
      childName: request.childName,
      childAge: request.childAge,
      requirement: request.requirement,
    });
  }

  async getMentoringRequestsByParentId(parentId: number) {
    return this.mentoringRequestRepository.find({
      where: { parentId },
      order: { createdAt: 'DESC' },
    });
  }

  async getMentoringRequestById(id: number, parentId: number) {
    const request = await this.mentoringRequestRepository.findOne({
      where: { id, parentId },
    });

    if (!request) {
      throw new NotFoundException('멘토링 신청을 찾을 수 없습니다.');
    }

    return request;
  }

  async cancelMentoringRequest(id: number, parentId: number) {
    const request = await this.getMentoringRequestById(id, parentId);

    if (request.status !== MentoringStatus.PENDING) {
      throw new BadRequestException('대기 중인 신청만 취소할 수 있습니다.');
    }

    request.status = MentoringStatus.CANCELLED;
    await this.mentoringRequestRepository.save(request);
    return { success: true, message: '멘토링 신청이 취소되었습니다.' };
  }

  async updateMentoringStatus(id: number, updateDto: UpdateMentoringStatusDto) {
    const request = await this.mentoringRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('멘토링 신청을 찾을 수 없습니다.');
    }

    request.status = updateDto.status as MentoringStatus;
    if (updateDto.mentorName) {
      request.mentorName = updateDto.mentorName;
    }

    return this.mentoringRequestRepository.save(request);
  }

  async findPendingRequestsForAdmin(): Promise<MentoringRequest[]> {
    return this.mentoringRequestRepository.find({
      where: { status: MentoringStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }
  async adminUpdateStatus(
    id: number,
    status: MentoringStatus,
  ): Promise<MentoringRequest> {
    const request = await this.mentoringRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('멘토링 신청을 찾을 수 없습니다.');
    }

    if (request.status !== MentoringStatus.PENDING) {
      throw new BadRequestException(
        'PENDING 상태의 신청만 승인/거절할 수 있습니다.',
      );
    }

    request.status = status;

    if (status === MentoringStatus.MATCHED) {
      request.mentorName = request.mentorName || 'Admin Matched';
    }

    return this.mentoringRequestRepository.save(request);
  }

  async createMentorMockup() {
    // Clear existing data
    await this.mentoringRequestRepository.clear();
    await this.mentorRepository.clear();

    // Create mentoring requests with different statuses
    const requests = [
      {
        parentId: 1,
        childId: 1,
        title: '수학 기초 학습 멘토링',
        childName: '김민준',
        childAge: '중1',
        requirement:
          '덧셈, 뺄셈, 곱셈, 나눗셈 기초부터 시작해서 중학교 1학년 수학 과정을 전반적으로 배우고 싶습니다.',
        status: MentoringStatus.MATCHED,
        mentorName: '박멘토',
        createdAt: new Date('2025-01-10'),
      },
      {
        parentId: 1,
        childId: 2,
        title: '영어 회화 집중 과정',
        childName: '이서연',
        childAge: '중2',
        requirement:
          '영어 기초 회화부터 시작해서 일상 대화를 자연스럽게 할 수 있도록 도와주세요.',
        status: MentoringStatus.PENDING,
        createdAt: new Date('2025-01-13'),
      },
      {
        parentId: 1,
        childId: 1,
        title: '과학 탐구 멘토링',
        childName: '김민준',
        childAge: '중1',
        requirement:
          '물리, 화학, 생물 전반적인 과학 과목에 대한 흥미를 키우고 실험 중심으로 배우고 싶습니다.',
        status: MentoringStatus.REJECTED,
        createdAt: new Date('2025-01-08'),
      },
      {
        parentId: 1,
        childId: 3,
        title: '코딩 입문 과정',
        childName: '박지우',
        childAge: '중3',
        requirement:
          'Python 프로그래밍 기초부터 배우고 싶습니다. 알고리즘 문제 풀이도 함께 학습하고 싶어요.',
        status: MentoringStatus.PENDING,
        createdAt: new Date('2025-01-14'),
      },
      {
        parentId: 1,
        childId: 2,
        title: '국어 독해력 향상',
        childName: '이서연',
        childAge: '중2',
        requirement: '국어 지문 독해와 논술 작성 능력을 키우고 싶습니다.',
        status: MentoringStatus.CANCELLED,
        createdAt: new Date('2025-01-05'),
      },
    ];

    const savedRequests = await this.mentoringRequestRepository.save(requests);

    // Create mentors
    const mentors = [
      {
        name: '박멘토',
        mobileNumber: '010-1234-5678',
        email: 'mentor.park@example.com',
        status: MentorStatus.MATCHED,
        bio: '고려대학교 정보대학 컴퓨터학과 재학 중입니다. 수학과 과학 과목에 자신있습니다.',
        mentoringRequestId: savedRequests.find(
          (r) => r.status === MentoringStatus.MATCHED,
        )?.id,
      },
      {
        name: '김멘토',
        mobileNumber: '010-2345-6789',
        email: 'mentor.kim@example.com',
        status: MentorStatus.AVAILABLE,
        bio: '고려대학교 정보대학 데이터과학과 재학 중입니다. 영어와 수학을 잘 가르칩니다.',
      },
      {
        name: '이멘토',
        mobileNumber: '010-3456-7890',
        email: 'mentor.lee@example.com',
        status: MentorStatus.AVAILABLE,
        bio: '고려대학교 정보대학 사이버보안학과 재학 중입니다. 과학 과목 전문입니다.',
      },
    ];

    const savedMentors = await this.mentorRepository.save(mentors);

    return {
      requests: savedRequests,
      mentors: savedMentors,
      message: 'Mockup data created successfully',
    };
  }
}
