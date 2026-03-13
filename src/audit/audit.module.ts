import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuditLog } from './audit-log.entity'
import { AuditService } from './audit.service'
import { AuditConsumer } from './audit.consumer'
import { AuditController } from './audit.controller'

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog], 'auditConnection')],
  providers: [AuditService, AuditConsumer],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
