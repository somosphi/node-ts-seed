import { RabbitMQ, RabbitMQConfig } from "./rabbitmq";

export class WorkVHost extends RabbitMQ {
  constructor(vHost: string, config: RabbitMQConfig) {
    super(vHost, config);
  }
}
