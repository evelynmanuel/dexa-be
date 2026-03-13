import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as amqplib from 'amqplib'
import { AuditLog } from './audit-log.entity'

const QUEUE_NAME = 'wfh.audit'

@Injectable()
export class AuditConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuditConsumer.name)
  private connection: amqplib.Connection | null = null
  private channel: amqplib.Channel | null = null

  constructor(
    @InjectRepository(AuditLog, 'auditConnection')
    private auditRepository: Repository<AuditLog>,
  ) {}

  async onModuleInit() {
    await this.startConsuming()
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close()
      await this.connection?.close()
    } catch (_) {}
  }

  private async startConsuming() {
    try {
      const url = 'amqp://guest:guest@localhost:5672'
      this.connection = await amqplib.connect(url)
      this.channel = await this.connection.createChannel()

      await this.channel.assertQueue(QUEUE_NAME, { durable: true })

      this.channel.prefetch(1)

      this.logger.log(`AuditConsumer listening on queue "${QUEUE_NAME}"`)

      this.channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return

        const ch = this.channel
        if (!ch) return

        try {
          const data = JSON.parse(msg.content.toString())

          const entry = this.auditRepository.create({
            action: data.action,
            actorId: data.actorId,
            actorName: data.actorName,
            targetId: data.targetId,
            payload: data.payload,
            ipAddress: data.ipAddress,
          })

          await this.auditRepository.save(entry)

          ch.ack(msg)

          this.logger.debug(
            `[Audit] Saved: ${data.action} by ${data.actorName}`,
          )
        } catch (err) {
          this.logger.error('[Audit] Failed to process message: ' + err.message)
          ch.nack(msg, false, true)
        }
      })

      this.connection.on('error', (err) => {
        this.logger.error('RabbitMQ consumer connection error: ' + err.message)
      })
    } catch (err) {
      this.logger.warn(
        'AuditConsumer could not connect to RabbitMQ: ' + err.message,
      )
    }
  }
}
