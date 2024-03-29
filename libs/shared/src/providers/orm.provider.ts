import { LoadStrategy } from '@mikro-orm/core';
import {
  MikroOrmModuleAsyncOptions,
  MikroOrmModuleOptions,
} from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AsyncLocalStorage } from 'node:async_hooks';

const ALS = new AsyncLocalStorage<any>();

export function getOrmOptions(
  options?: MikroOrmModuleOptions,
): MikroOrmModuleAsyncOptions {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      Object.assign(
        {
          clientUrl: configService.get('POSTGRES_URL'),
          debug: configService.get('NODE_ENV') === 'development',
          loadStrategy: LoadStrategy.JOINED,
          context: () => ALS.getStore(), // use AsyncLocalStorage instance
          registerRequestContext: false, // disable automatic middleware
          autoLoadEntities: true,
          ensureIndexes: true,
          type: 'postgresql',
          flushMode: 1,
          // preferReadReplicas: true,
          // replicas: [
          //   { name: 'read-1', host: 'read_host_1', user: 'read_user' },
          //   { name: 'read-2', host: 'read_host_2' },
          // ],
        },
        options,
      ),
  };
}
