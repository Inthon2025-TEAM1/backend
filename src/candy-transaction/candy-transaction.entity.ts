import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('candy_transactions')
export class CandyTransaction {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @Column({ type: 'enum', enum: ['earn', 'spend'] })
  type: 'earn' | 'spend';

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  itemName: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
