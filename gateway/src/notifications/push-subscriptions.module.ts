import { Module } from '@nestjs/common';
import { SharedModule } from 'src/__shared__/shared.module';
import { notificationsProvider } from './providers/notifications.provider';
import { PushSubscriptionsController } from './push-subscriptions.controller';

@Module({
  imports: [SharedModule],
  providers: [notificationsProvider],
  controllers: [PushSubscriptionsController],
})
export class PushSubscriptionsModule {}
