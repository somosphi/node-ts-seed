import { RabbitMQ, RabbitMQConfig } from '../vhosts/index';
import { RabbitMQConsumer } from '../rabbitmq-consumer';
import { Consumer } from '../consumer';

export class HomeVHost extends RabbitMQ implements RabbitMQConsumer {
  consumers: Consumer[] = [];

  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
  }

  loadConsumers(): void {}
}
