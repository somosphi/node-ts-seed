import { Producer } from './producer';
import { logger } from '../../../../logger';
import { Channel, Options } from 'amqplib';

export interface UserMessage {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
}

export class UserProducer extends Producer {
  private readonly exchange: string = 'user.dx';
  private readonly routingKey: string = 'user.create';

  constructor(channel: Channel) {
    super(channel);
  }

  sendMessage(content: UserMessage) {
    const options: Options.Publish = {
      priority: 0,
      deliveryMode: 2,
      contentEncoding: 'UTF-8',
      contentType: 'application/json',
    };

    super.send(this.exchange, this.routingKey, content, options);
  }
}
