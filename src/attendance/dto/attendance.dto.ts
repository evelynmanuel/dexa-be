import { IsEnum, IsOptional } from 'class-validator'
import { AttendanceStatus } from '../entity/attendance.entity'

export class CreateAttendanceDto {
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus
}

export class AttendanceFilterDto {
  @IsOptional()
  startDate?: string

  @IsOptional()
  endDate?: string

  @IsOptional()
  userId?: string
}
