import { HomeVHost } from './vhosts/home-vhost';
import { RabbitMQConfig, RabbitMQ } from '../amqp/vhosts/index';
import { WorkVHost } from './vhosts/work-vhost';
import { Container } from '../container';
export class AMQPServer {
  private readonly config: RabbitMQConfig;
  private homeVHost!: HomeVHost;
  private workVHost!: WorkVHost;

  constructor(vHostsName: string[], config: RabbitMQConfig) {
    this.config = config;
    this.instantiateByName(vHostsName);
  }

  async start() {
    await this.homeVHost.init();
    await this.workVHost.init();
  }

  getHomeVHost(): HomeVHost {
    return this.homeVHost;
  }

  getWorkVHost(): WorkVHost {
    return this.workVHost;
  }

  startAllConsumers(container: Container): void {
    this.homeVHost.startConsumers(container);
  }

  private instantiateByName(vHostNames: string[]) {
    vHostNames.map(vHostName => {
      switch (vHostName) {
        case 'home':
          this.homeVHost = new HomeVHost(vHostName, this.config);
          break;
        case 'work':
          this.workVHost = new WorkVHost(vHostName, this.config);
          break;
      }
    });
  }
}
