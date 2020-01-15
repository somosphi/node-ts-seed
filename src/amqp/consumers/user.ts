import { Consumer } from './consumer';
import { Container } from '../../container';
import { ConsumeMessage } from 'amqplib';

export class UserConsumer extends Consumer {
  constructor(queue: string, container: Container) {
    super(queue, container);
  }

  onConsume(message: ConsumeMessage | null) {
    console.log(message);
  }
}
