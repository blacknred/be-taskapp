import * as Joi from '@hapi/joi';
import {
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as passport from 'passport';
import { RedisClient } from 'redis';
import { AuthModule } from './auth/auth.module';
import { cacheProvider } from './auth/providers/cache.provider';
import { MonitoringModule } from './monitoring/monitoring.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { CACHE_SERVICE } from './__shared__/consts';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_URL: Joi.string().required(),
        QUEUE_URL: Joi.string().required(),
        SECRET: Joi.string().required(),
        VAPID_PUBLIC_KEY: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    MonitoringModule,
  ],
  providers: [Logger, cacheProvider],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(CACHE_SERVICE) private readonly redis: RedisClient,
    private readonly configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    const secret = this.configService.get('SECRET');

    consumer
      .apply(
        helmet(),
        session({
          store: new (RedisStore(session))({
            client: this.redis,
            logErrors: true,
          }),
          saveUninitialized: false,
          secret,
          resave: false,
          cookie: {
            sameSite: 'lax',
            httpOnly: true,
            maxAge: 86400000,
            signed: isProd,
            secure: isProd,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
