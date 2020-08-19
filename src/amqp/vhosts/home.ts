import { RabbitMQ, RabbitMQConfig } from './index';
import { RabbitMQConsumer } from '../rabbitmq-consumer';
import { AppContainer } from '../../container';
import { UserConsumer } from '../consumers/user';
import { Consumer } from '../consumers/consumer';
import { logger } from '../../logger';

export class HomeVHost extends RabbitMQ implements RabbitMQConsumer {
  container?: AppContainer;

  consumers: Consumer[] = [];

  constructor(vHost: string, config: RabbitMQConfig, container?: AppContainer) {
    super(vHost, config);
    this.container = container;
  }

  loadConsumers(): void {
    if (this.container) {
      this.consumers = [new UserConsumer('user.find', this.container)];
    } else {
      throw new Error(
        `Can not initialize consumers from '${this.vHost}' vhost because container is null`
      );
    }
  }

  startConsumers(container: AppContainer): void {
    this.container = container;
    this.loadConsumers();
    this.consumers.forEach((consumer: Consumer) => {
      this.channel.consume(consumer.queue, consumer.onConsume(this.channel));
      logger.info(
        `RabbitMQ: '${this.vHost}' vhost started '${consumer.queue}' consume`
      );
    });
  }
}
