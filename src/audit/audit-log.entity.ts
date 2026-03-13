import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

export enum AuditAction {
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  EMPLOYEE_CREATED = 'EMPLOYEE_CREATED',
  EMPLOYEE_DEACTIVATED = 'EMPLOYEE_DEACTIVATED',
  ATTENDANCE_SUBMITTED = 'ATTENDANCE_SUBMITTED',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction

  @Column()
  actorId: string

  @Column()
  actorName: string

  @Column({ nullable: true })
  targetId: string

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, any>

  @Column({ nullable: true })
  ipAddress: string

  @CreateDateColumn()
  createdAt: Date
}
