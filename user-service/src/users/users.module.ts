import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProvider } from './providers/database.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, databaseProvider],
  exports: [databaseProvider],
})
export class UsersModule {}