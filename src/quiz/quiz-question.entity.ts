import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Chapter } from './chapter.entity';

export enum QuizType {
  MULTIPLE_CHOICE = '객관식',
  SHORT_ANSWER = '단답형',
}

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('int')
  grade: number;

  @Column({
    type: 'enum',
    enum: QuizType,
  })
  type: QuizType;

  @ManyToOne(() => Chapter)
  @JoinColumn({ name: 'chapterId' })
  chapter: Chapter;

  @Column('bigint')
  chapterId: number;

  @Column('jsonb')
  question: object;

  @Column({ type: 'simple-array', nullable: true })
  choices: string[];

  @Column()
  answer: string;

  @Column('text')
  explain: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
