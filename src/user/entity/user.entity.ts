import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  position: string

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole

  @Column({ nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  profilePicture: string

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
