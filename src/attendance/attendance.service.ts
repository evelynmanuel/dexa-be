import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Attendance } from './entity/attendance.entity'
import { AttendanceFilterDto, CreateAttendanceDto } from './dto/attendance.dto'
import { AuditService } from 'src/audit/audit.service'
import { User } from 'src/user/entity/user.entity'
import { AuditAction } from 'src/audit/audit-log.entity'

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private repo: Repository<Attendance>,
    private auditService: AuditService,
  ) {}

  async findAll(filter: AttendanceFilterDto): Promise<Attendance[]> {
    const now = new Date()
    const start = new Date(filter.startDate || now)
    const end = new Date(filter.endDate || now)

    const query = this.repo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.user', 'user')
      .where('attendance.createdAt BETWEEN :startDate AND :endDate', {
        start,
        end,
      })

    if (filter.userId) {
      query.andWhere('attendance.userId = :userId', { userId: filter.userId })
    }

    query.orderBy('attendance.createdAt', 'DESC')

    const res = await query.getMany()
    return res
  }

  async create(userData: User, dto: CreateAttendanceDto): Promise<Attendance> {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().split(' ')[0]

    const userId = userData.id

    const attendance = this.repo.create({
      userId,
      createdBy: userData.id,
      ...dto,
    })
    const result = await this.repo.save(attendance)

    await this.auditService.log({
      action: AuditAction.ATTENDANCE_SUBMITTED,
      actorId: userData.id,
      actorName: userData.name,
      targetId: result.id,
      payload: { status: dto.status, date, time },
    })

    return result
  }
}
