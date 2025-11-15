import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  PARENT = 'parent',
  CHILD = 'child',
  MENTOR = 'mentor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  firebaseUid: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  role: UserRole | null;

  @Column({ type: 'int', default: 0 })
  candy: number;

  @Column({ type: 'bigint', nullable: true })
  parentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
