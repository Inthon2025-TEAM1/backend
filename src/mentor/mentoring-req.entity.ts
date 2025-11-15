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
}

@Entity('mentoring_requests')
export class MentoringReq {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  parentId: number;

  @Column()
  title: string;

  @Column('text')
  childInfo: string;

  @Column('text')
  requirement: string;

  @Column({
    type: 'enum',
    enum: MentoringStatus,
    default: MentoringStatus.PENDING,
  })
  status: MentoringStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
