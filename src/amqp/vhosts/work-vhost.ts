import { RabbitMQ, RabbitMQConfig } from '../vhosts/index';

export class WorkVHost extends RabbitMQ {
  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
  }
}
