import { Consumer } from './consumer';
import { Container } from '../../container';
import { ConsumeMessage } from 'amqplib';
import { BufferConverter } from '../buffer-converter';
import validatorMiddleware from '../middleware/validator';
import { findUserSchema } from '../schemas/user';
import { logger } from '../../logger';
import { User } from '../../container/models/user';

export interface FindUserMessage {
  id: string;
}

export class UserConsumer extends Consumer {
  constructor(queue: string, container: Container) {
    super(queue, container);
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
    const user: User = await this.container.userService.findById(
      findUserMessage.id
    );
    logger.info(JSON.stringify(user));
  }
}
