import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  childId: number;

  @Column('bigint')
  quizId: number;

  @ManyToOne(() => QuizQuestion)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizQuestion;

  @Column()
  selectedChoice: string;

  @Column('boolean')
  isCorrect: boolean;

  @Column('int')
  rewardCandy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
