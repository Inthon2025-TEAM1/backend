import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export interface Weakness {
  category: string;
  chapterId: number;
  chapterName?: string;
  problemCount: number;
  accuracyRate: number;
  commonMistakes: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface WeaknessAnalysisResponse {
  weaknesses: Weakness[];
  recommendations: string[];
  overallScore: number;
  improvementAreas: string[];
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  userId: number;

  @Column('int')
  overallScore: number;

  @Column({ type: 'simple-array' })
  recommendations: string[];

  @Column({ type: 'simple-array' })
  improvementAreas: string[];

  // 복합 객체 배열 저장
  @Column({ type: 'json' })
  weaknesses: Weakness[];

  @CreateDateColumn()
  createdAt: Date;
}
