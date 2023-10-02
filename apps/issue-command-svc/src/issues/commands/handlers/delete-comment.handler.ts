import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { EventRepository } from '@taskapp/eventstore/event.repository';
import { NOTIFICATION_SERVICE } from '@taskapp/shared';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IssueAggregate } from '../../aggregations/issue.aggregate';
import { DeleteCommentCommand } from '../impl/delete-comment.command';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventRepository: EventRepository,
    @Inject(NOTIFICATION_SERVICE) private notificationsService: ClientProxy,
    @InjectPinoLogger(DeleteCommentHandler.name)
    private readonly logger: PinoLogger,
  ) {}

  async execute({ id, userId }: DeleteCommentCommand) {
    // TODO: db validation 409

    const issue = this.publisher.mergeObjectContext(new IssueAggregate({ id }));

    issue.deleteComment(userId);
    issue.commit();
  }
}
