import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { QuizQuestion } from '../quiz/quiz-question.entity';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gradeLevel: number; // 정렬용 숫자 (초1=1, 초2=2, ..., 중1=7, 중2=8, 중3=9)

  @Column()
  chapterOrder: number; // 단원 순서

  @Column()
  chapterName: string; // 예: "일차방정식", "도형의 성질"

  @Column({ type: 'text', nullable: true })
  chapterDescription: string; // 어떤 챕터인지 설명

  @OneToMany(() => QuizQuestion, (question) => question.chapter)
  questions: QuizQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
