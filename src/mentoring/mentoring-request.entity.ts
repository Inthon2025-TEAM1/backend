import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Mentor } from './mentor.entity';

export enum MentoringStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  REJECTED = 'rejected',
}

@Entity('mentoring_requests')
export class MentoringRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'parentId' })
  parent: User;

  @Column()
  title: string; // 멘토링 신청 제목

  @Column({ type: 'text' })
  childInfo: string; // 자녀 정보

  @Column({ type: 'text' })
  requirement: string; // 어떤 부분이 필요한지

  @Column({
    type: 'enum',
    enum: MentoringStatus,
    default: MentoringStatus.PENDING,
  })
  status: MentoringStatus; // 기본 pending

  @Column({ nullable: true })
  mentorId: number; // 매칭된 멘토 ID

  @ManyToOne(() => Mentor, { nullable: true })
  @JoinColumn({ name: 'mentorId' })
  mentor: Mentor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
