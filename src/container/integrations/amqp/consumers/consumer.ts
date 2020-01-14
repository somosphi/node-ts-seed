import { RabbitMQ } from '../../../../amqp/vhosts/index';

export interface Consumer {
  vHost: RabbitMQ;
}
