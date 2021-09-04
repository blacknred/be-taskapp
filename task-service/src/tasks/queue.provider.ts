import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const queueProvider = {
  provide: 'QUEUE_SERVICE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get('QUEUE_URL')],
        queue: 'tasks',
        noAck: true,
        queueOptions: {
          durable: true,
        },
      },
    }),
};
