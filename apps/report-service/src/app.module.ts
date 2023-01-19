import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@taskapp/core';
import { getOrmOptions } from '@taskapp/shared';
import * as Joi from 'joi';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        SERVICE_NAME: Joi.string().required(),
        API_VERSION: Joi.string().required(),
        POSTGRES_URL: Joi.string().required(),
        EVENTSTORE_URL: Joi.string().required(),
      }),
    }),
    MikroOrmModule.forRootAsync(getOrmOptions()),
    CoreModule,
    ReportsModule,
  ],
})
export class AppModule {}
