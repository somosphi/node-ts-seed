import { RabbitMQ, RabbitMQConfig } from '../vhosts/index';
import { RabbitMQConsumer } from '../rabbitmq-consumer';
import { Consumer } from '../consumer';

export class HomeVHost extends RabbitMQ implements RabbitMQConsumer {
  vHostName: string;
  //consumers: Consumer[];

  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
    this.loadConsumers();
  }

  loadConsumers(): void {
    this.consumers = [new UserConsumer()];
  }
}
