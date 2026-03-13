import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entity/user.entity'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { AuditService } from 'src/audit/audit.service'
import { NotificationGateway } from 'src/notifications/notification.gateway'
import { AuditAction } from 'src/audit/audit-log.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private auditService: AuditService,
    private notificationGateway: NotificationGateway,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } })
    if (!user) throw new Error('User not found')
    return user
  }

  async create(
    userData: User,
    createUserDto: CreateUserDto,
    file?: string,
  ): Promise<User> {
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
    }

    const user = this.repo.create({
      ...createUserDto,
      createdBy: userData.id,
      profilePicture: file,
    })
    const result = await this.repo.save(user)

    await this.auditService.log({
      action: AuditAction.EMPLOYEE_CREATED,
      actorId: userData.id,
      actorName: userData.name,
      targetId: result.id,
      payload: {
        email: result.email,
        name: result.name,
        position: result.position,
      },
    })

    this.notificationGateway.sendToAdmins({
      type: 'EMPLOYEE_CREATED',
      message: 'Karyawan baru ditambahkan: ' + result.name,
      employeeName: result.name,
      timestamp: new Date().toISOString(),
      data: { employeeId: result.id },
    })

    return result
  }

  async update(
    userData: User,
    id: string,
    updateUserDto: UpdateUserDto,
    file?: string,
  ): Promise<User> {
    const user = await this.findOne(id)
    if (!user) throw new Error('User not found')

    const dtoToUpdate: Partial<UpdateUserDto> & { updatedBy: string } = {
      ...updateUserDto,
      updatedBy: userData.id,
    }

    if (updateUserDto.password) {
      dtoToUpdate.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    dtoToUpdate.profilePicture = file

    await this.repo.update(id, dtoToUpdate)
    const result = await this.findOne(id)

    const changedFields = Object.keys(updateUserDto).filter(
      (k) => k !== 'password',
    )
    if (file) changedFields.push('photo')

    await this.auditService.log({
      action: AuditAction.PROFILE_UPDATED,
      actorId: userData.id,
      actorName: userData.name,
      targetId: id,
      payload: { changedFields, employeeName: user.name },
    })

    this.notificationGateway.sendToAdmins({
      type: 'PROFILE_UPDATED',
      message: user.name + ' memperbarui profilnya',
      employeeName: user.name,
      timestamp: new Date().toISOString(),
      data: { employeeId: id, changedFields },
    })

    return result
  }
}
