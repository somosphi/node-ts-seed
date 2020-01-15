import { Consumer } from './consumer';

export interface RabbitMQConsumer {
  consumers: Consumer[];
  loadConsumers(): void;
}
