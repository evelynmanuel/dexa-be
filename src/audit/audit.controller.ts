import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuditLog } from './audit-log.entity'

@Controller('audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
  constructor(
    @InjectRepository(AuditLog, 'auditConnection')
    private auditRepository: Repository<AuditLog>,
  ) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.auditRepository.find({
      order: { createdAt: 'DESC' },
      take: limit ? parseInt(limit) : 50,
    })
  }
}
