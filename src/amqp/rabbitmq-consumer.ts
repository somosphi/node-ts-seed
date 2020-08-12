import { AppContainer } from '../container';
import { Consumer } from './consumers/consumer';

export interface RabbitMQConsumer {
  container?: AppContainer;
  consumers: Consumer[];
  loadConsumers(): void;
  startConsumers(container: AppContainer): void;
}
