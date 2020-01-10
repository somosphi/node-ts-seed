import { RabbitMQ, RabbitMQConfig } from "./rabbitmq";

export class HomeVHost extends RabbitMQ {
  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
  }
}
