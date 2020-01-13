import { RabbitMQ, RabbitMQConfig } from "../providers/rabbitmq";

export class HomeVHost extends RabbitMQ {
  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
  }
}
