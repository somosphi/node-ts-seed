import { RabbitMQ, RabbitMQConfig } from '../providers/rabbitmq';
import { RabbitMQConsumer } from '../providers/rabbitmq-consumer';
import { UserConsumer } from '../../container/integrations/amqp/consumers/user';
import { Consumer } from '../../container/integrations/amqp/consumers/consumer';

export class HomeVHost extends RabbitMQ implements RabbitMQConsumer {
  consumers: Consumer[] = [];

  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
    this.loadConsumers();
  }

  loadConsumers(): void {
    this.consumers = [new UserConsumer()];
  }
}
