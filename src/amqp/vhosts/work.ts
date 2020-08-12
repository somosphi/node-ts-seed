import { RabbitMQ, RabbitMQConfig } from '.';

export class WorkVHost extends RabbitMQ {
  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
  }
}
