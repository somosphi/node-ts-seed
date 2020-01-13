import { HomeVHost } from "./providers/home-vhost";
import { RabbitMQConfig } from "./providers/rabbitmq";
import { WorkVHost } from "./providers/work-vhost";

export class AMQPServer {
  protected readonly config: RabbitMQConfig;

  constructor(config: RabbitMQConfig) {
    this.config = config;
  }

  async start() {
    await this.init();
  }

  private async init() {
    const homeVHost = new HomeVHost("home", this.config);
    await homeVHost.init();

    const workVHost = new WorkVHost("work", this.config);
    await workVHost.init();
  }
}
