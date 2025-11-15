import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  childId: number;

  @Column('bigint')
  quizId: number;

  @Column()
  selectedChoice: string;

  @Column('boolean')
  isCorrect: boolean;

  @Column('int')
  rewardCandyNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
