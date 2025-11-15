import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MentorStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  REJECTED = 'rejected',
}

@Entity('mentors')
export class Mentor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({
    type: 'enum',
    enum: MentorStatus,
    default: MentorStatus.PENDING,
  })
  status: MentorStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
