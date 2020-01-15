import { Container } from '../container';
import { Consumer } from './consumers/consumer';

export interface RabbitMQConsumer {
  container?: Container;
  consumers: Consumer[];
  loadConsumers(): void;
  startConsumers(container: Container): void;
}
