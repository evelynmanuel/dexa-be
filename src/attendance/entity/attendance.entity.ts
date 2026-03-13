import { User } from 'src/user/entity/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum AttendanceStatus {
  CLOCK_IN = 'CLOCK_IN',
  CLOCK_OUT = 'CLOCK_OUT',
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus

  @CreateDateColumn()
  createdAt: Date

  @Column()
  createdBy: string

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date

  @Column({ nullable: true })
  updatedBy: string

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date

  @Column({ nullable: true })
  deletedBy: string
}
