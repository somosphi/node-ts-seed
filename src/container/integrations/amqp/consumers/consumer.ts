import { RabbitMQ } from '../../../../amqp/providers/rabbitmq';

export interface Consumer {
  vHost?: RabbitMQ;
}
