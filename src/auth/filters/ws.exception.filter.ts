import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io'

@Catch()
export class SocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    client.emit('error', {
      exception: exception.name,
      status: exception.status
    });
  }
}