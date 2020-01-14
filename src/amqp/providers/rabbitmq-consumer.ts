import { Consumer } from './consumer';

export interface RabbitMQConsumer {
  vHostName: string;
  consumers: Consumer[];
  loadConsumers(): void;
}
