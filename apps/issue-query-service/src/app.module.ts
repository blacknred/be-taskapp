import * as Joi from '@hapi/joi';
import { LoadStrategy } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CoreModule } from '@taskapp/core';
import { AsyncLocalStorage } from 'node:async_hooks';
import { NOTIFICATION_SERVICE } from './issues/consts';
import { IssuesModule } from './issues/issues.module';

const ALS = new AsyncLocalStorage<any>();

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVICE_NAME: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        POSTGRES_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
      }),
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        clientUrl: configService.get('POSTGRES_URL'),
        debug: configService.get('NODE_ENV') === 'development',
        loadStrategy: LoadStrategy.JOINED,
        context: () => ALS.getStore(),
        registerRequestContext: false,
        autoLoadEntities: true,
        ensureIndexes: true,
        type: 'postgresql',
        flushMode: 1,
      }),
    }),
    CoreModule,
    IssuesModule,
  ],
  providers: [
    {
      provide: NOTIFICATION_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RABBITMQ_URL')],
            queue: 'notifications',
            noAck: false,
            queueOptions: {
              durable: true,
            },
          },
        }),
    },
  ],
})
export class AppModule {}