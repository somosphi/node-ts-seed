import { HomeVHost } from './vhosts/home-vhost';
import { RabbitMQConfig, RabbitMQ } from './providers/rabbitmq';
import { WorkVHost } from './vhosts/work-vhost';
import { Container } from '../container';
export class AMQPServer {
  protected readonly config: RabbitMQConfig;
  protected readonly vHosts: string[];
  protected container: Container;
  static readyVhosts: RabbitMQ[] = [];

  constructor(vHosts: string[], config: RabbitMQConfig, container: Container) {
    this.config = config;
    this.vHosts = vHosts;
    this.container = container;
  }

  async start() {
    this.vHosts.map(async vHost => {
      switch (vHost) {
        case 'home':
          const homeVHost = new HomeVHost(vHost, this.config);
          await homeVHost.init();
          AMQPServer.readyVhosts.push(homeVHost);
          break;
        case 'work':
          const workVHost = new WorkVHost(vHost, this.config);
          await workVHost.init();
          AMQPServer.readyVhosts.push(workVHost);
          break;
      }
    });
  }
}
