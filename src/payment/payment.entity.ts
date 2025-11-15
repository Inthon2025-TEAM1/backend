import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  parentId: number;

  @Column('int')
  amount: number;

  @Column()
  depositorName: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  startAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;
}
