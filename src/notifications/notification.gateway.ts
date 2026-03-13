import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

export interface NotificationPayload {
  type:
    | 'PROFILE_UPDATED'
    | 'EMPLOYEE_CREATED'
    | 'EMPLOYEE_DEACTIVATED'
    | 'ATTENDANCE_SUBMITTED'
  message: string
  employeeName: string
  timestamp: string
  data?: Record<string, any>
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    console.log(`[WS] Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS] Client disconnected: ${client.id}`)
  }

  sendToAdmins(payload: NotificationPayload) {
    this.server.emit('notification', payload)
  }
}
