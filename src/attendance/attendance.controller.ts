import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AttendanceFilterDto, CreateAttendanceDto } from './dto/attendance.dto'
import { AttendanceService } from './attendance.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Get()
  findAll(@Query() filter: AttendanceFilterDto) {
    return this.service.findAll(filter)
  }

  @Post()
  create(@Request() req, @Body() dto: CreateAttendanceDto) {
    return this.service.create(req, dto)
  }
}
