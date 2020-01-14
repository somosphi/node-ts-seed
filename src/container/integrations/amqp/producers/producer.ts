import { RabbitMQ } from '../../../../amqp/vhosts';

export interface Producer {
  vHost: RabbitMQ;
  send(message: object): void;
}
