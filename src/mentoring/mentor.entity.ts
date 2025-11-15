import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MentorStatus {
  AVAILABLE = 'available',
  MATCHED = 'matched',
  UNAVAILABLE = 'unavailable',
}

@Entity('mentors')
export class Mentor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // 멘토 이름

  @Column()
  mobileNumber: string; // 전화번호

  @Column({ nullable: true })
  email: string; // 이메일

  @Column({ nullable: true })
  mentoringRequestId?: number;

  @Column({
    type: 'enum',
    enum: MentorStatus,
    default: MentorStatus.AVAILABLE,
  })
  status: MentorStatus; // 기본 available

  @Column({ type: 'text', nullable: true })
  bio: string; // 멘토 소개

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
