import { RabbitMQ } from '../../../../amqp/vhosts';

export interface Producer {
  send(message: object): void;
}
