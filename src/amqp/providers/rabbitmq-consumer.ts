import { Consumer } from '../../container/integrations/amqp/consumers/consumer';

export interface RabbitMQConsumer {
  consumers: Consumer[];
  loadConsumers(): void;
}
