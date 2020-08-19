import { Consumer } from './consumer';
import { AppContainer } from '../../container';
import { ConsumeMessage } from 'amqplib';
import { BufferConverter } from '../buffer-converter';
import validatorMiddleware from '../middleware/validator';
import { findUserSchema } from '../schemas/user';
import { logger } from '../../logger';
import { User } from '../../container/repositories/user';
import { UserService } from '../../container/services/user';

export interface FindUserMessage {
  id: string;
}

export class UserConsumer extends Consumer {
  protected readonly userService: UserService;

  constructor(queue: string, container: AppContainer) {
    super(queue, container);
    this.userService = this.container.get<UserService>(UserService);
  }

  messageHandler(message: ConsumeMessage | null) {
    if (message) {
      const messageContent: FindUserMessage = validatorMiddleware.validation(
        findUserSchema
      )<FindUserMessage>(BufferConverter.convertToJson(message.content));
      this.findUserById(messageContent);
    }
  }

  async findUserById(findUserMessage: FindUserMessage) {
    const user: User = await this.userService.findById(findUserMessage.id);
    logger.info(JSON.stringify(user));
  }
}
