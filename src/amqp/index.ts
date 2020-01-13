import { HomeVHost } from "./providers/home-vhost";
import { RabbitMQConfig } from "./providers/rabbitmq";

export class AMQPServer {
  protected readonly config: RabbitMQConfig;

  constructor(config: RabbitMQConfig) {
    this.config = config;
  }

  private async loadVHosts() {
    const homeVHost = new HomeVHost("home", this.config);
    await homeVHost.init();
  }

  async start() {
    await this.loadVHosts();
  }
}
