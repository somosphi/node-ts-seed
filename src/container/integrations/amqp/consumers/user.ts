import { Consumer } from './consumer';
import { RabbitMQ } from '../../../../amqp/vhosts';
import { Container } from '../../..';

export class UserConsumer extends Consumer {
  constructor(vHost: RabbitMQ, container: Container) {
    super(vHost, container);
  }
}
