import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { databaseConfig } from './config/database.config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { AttendanceModule } from './attendance/attendance.module'
import { NotificationModule } from './notifications/notification.module'
import { AuditLog } from './audit/audit-log.entity'
import { AuditModule } from './audit/audit.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forRoot({
      name: 'auditConnection',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'abc123',
      database: 'dexa-audit',
      entities: [AuditLog],
      synchronize: true,
    }),

    UserModule,
    AttendanceModule,
    AuthModule,
    NotificationModule,
    AuditModule,
  ],
})
export class AppModule {}
