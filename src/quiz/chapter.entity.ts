import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('int')
  gradeLevel: number;

  @Column('int')
  chapterOrder: number;

  @Column()
  chapterName: string;

  @Column('text', { nullable: true })
  chapterDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
