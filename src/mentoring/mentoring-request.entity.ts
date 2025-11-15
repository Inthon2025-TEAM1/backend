import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MentoringStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('mentoring_requests')
export class MentoringRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: number;

  @Column()
  childId: number; // 자녀 ID

  @Column()
  title: string; // 멘토링 신청 제목

  @Column()
  childName: string; // 자녀 이름

  @Column()
  childAge: string; // 자녀 학년 (중1, 중2, 중3)

  @Column({ type: 'text' })
  requirement: string; // 어떤 부분이 필요한지

  @Column({ nullable: true })
  mentorName?: string; // 매칭된 멘토 이름

  @Column({
    type: 'enum',
    enum: MentoringStatus,
    default: MentoringStatus.PENDING,
  })
  status: MentoringStatus; // 기본 pending

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
