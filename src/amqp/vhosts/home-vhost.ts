import { RabbitMQ, RabbitMQConfig } from '../vhosts/index';
import { RabbitMQConsumer } from '../rabbitmq-consumer';
import { Container } from '../../container';
import { UserConsumer } from '../consumers/user';
import { Consumer } from '../consumers/consumer';
import { logger } from '../../logger';

export class HomeVHost extends RabbitMQ implements RabbitMQConsumer {
  container?: Container;
  consumers: Consumer[] = [];

  constructor(vHost: string, config: RabbitMQConfig, container?: Container) {
    super(vHost, config);
    this.container = container;
  }

  loadConsumers(): void {
    if (this.container) {
      this.consumers = [new UserConsumer('user.created', this.container)];
    } else {
      throw new Error(
        `Can not initialize consumers from '${this.vHost}' vhost because container is null`
      );
    }
  }

  startConsumers(container: Container): void {
    this.container = container;
    this.loadConsumers();
    this.consumers.map((consumer: Consumer) => {
      this.channel.consume(consumer.queue, consumer.onConsume(this.channel));
      logger.info(
        `RabbitMQ: '${this.vHost}' vhost started '${consumer.queue}' consume`
      );
    });
  }
}
