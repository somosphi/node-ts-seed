import { HomeVHost } from "./vhosts/home-vhost";
import { RabbitMQConfig } from "./providers/rabbitmq";
import { WorkVHost } from "./vhosts/work-vhost";

export class AMQPServer {
  protected readonly config: RabbitMQConfig;
  protected readonly vHosts: string[];

  constructor(vHosts: string[], config: RabbitMQConfig) {
    this.config = config;
    this.vHosts = vHosts;
  }

  async start() {
    this.vHosts.map(async vHost => {
      switch (vHost) {
        case "home":
          const homeVHost = new HomeVHost(vHost, this.config);
          await homeVHost.init();
          break;
        case "work":
          const workVHost = new WorkVHost(vHost, this.config);
          await workVHost.init();
          break;
      }
    });
  }
}
