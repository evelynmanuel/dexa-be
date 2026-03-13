import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common'
import * as amqplib from 'amqplib'
import { AuditAction } from './audit-log.entity'

export interface AuditLogDto {
  action: AuditAction
  actorId: string
  actorName: string
  targetId?: string
  payload?: Record<string, any>
  ipAddress?: string
}

const QUEUE_NAME = 'wfh.audit'

@Injectable()
export class AuditService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuditService.name)
  private connection: amqplib.Connection | null = null
  private channel: amqplib.Channel | null = null

  async onModuleInit() {
    await this.connect()
  }

  async onModuleDestroy() {
    await this.disconnect()
  }

  private async connect() {
    try {
      const url = 'amqp://guest:guest@localhost:5672'
      this.connection = await amqplib.connect(url)
      this.channel = await this.connection.createChannel()

      await this.channel.assertQueue(QUEUE_NAME, { durable: true })

      this.logger.log(`Connected to RabbitMQ. Queue: "${QUEUE_NAME}"`)

      this.connection.on('error', (err) => {
        this.logger.error('RabbitMQ connection error: ' + err.message)
        this.channel = null
        this.connection = null
      })
    } catch (err) {
      this.logger.warn(
        'RabbitMQ not available, audit logging will be skipped: ' + err.message,
      )
      this.channel = null
      this.connection = null
    }
  }

  private async disconnect() {
    try {
      await this.channel?.close()
      await this.connection?.close()
    } catch (_) {}
  }

  async log(dto: AuditLogDto): Promise<void> {
    if (!this.channel) {
      this.logger.warn(
        '[Audit] RabbitMQ channel not ready, skipping log: ' + dto.action,
      )
      return
    }

    try {
      const message = Buffer.from(
        JSON.stringify({
          ...dto,
          timestamp: new Date().toISOString(),
        }),
      )

      this.channel.sendToQueue(QUEUE_NAME, message, { persistent: true })
    } catch (err) {
      this.logger.error('[Audit] Failed to publish message: ' + err.message)
    }
  }
}
