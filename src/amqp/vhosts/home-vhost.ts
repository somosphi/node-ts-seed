import { RabbitMQ, RabbitMQConfig } from '../providers/rabbitmq';
import { RabbitMQConsumer } from '../providers/rabbitmq-consumer';
import { Consumer } from '../providers/consumer';

export class HomeVHost extends RabbitMQ implements RabbitMQConsumer {
  vHostName: string;
  consumers: Consumer[];

  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
    this.vHostName = this.vHost;
  }

  loadConsumers(): void {}
}
