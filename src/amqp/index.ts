import { HomeVHost } from './vhosts/home-vhost';
import { RabbitMQConfig, RabbitMQ } from '../amqp/vhosts/index';
import { WorkVHost } from './vhosts/work-vhost';
import { Container } from '../container';
import { RabbitMQConsumer } from './rabbitmq-consumer';

export interface VHosts {
  home: HomeVHost;
  work: WorkVHost;
}

export class AMQPServer {
  vhosts: VHosts;

  constructor(config: RabbitMQConfig) {
    this.vhosts = {
      home: new HomeVHost('home', config),
      work: new WorkVHost('work', config),
    };
  }

  async start() {
    await Promise.all(
      Object.values(this.vhosts).map(async (vHost: RabbitMQ) => {
        return vHost.init();
      })
    );
  }

  startAllConsumers(container: Container): void {
    Object.values(this.vhosts).map((vHost: RabbitMQConsumer) => {
      if (vHost.startConsumers) vHost.startConsumers(container);
    });
  }
}
