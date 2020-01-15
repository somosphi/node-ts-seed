import { Consumer } from './consumer';
import { Container } from '../../container';
import { ConsumeMessage } from 'amqplib';

export class UserConsumer extends Consumer {
  constructor(queue: string, container: Container) {
    super(queue, container);
  }

  messageHandler(message: ConsumeMessage | null) {
    console.log(message);
  }
}
