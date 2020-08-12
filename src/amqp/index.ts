import { HomeVHost } from './vhosts/home';
import { RabbitMQConfig, RabbitMQ } from '../amqp/vhosts/index';
import { WorkVHost } from './vhosts/work';
import { AppContainer } from '../container';
import { RabbitMQConsumer } from './rabbitmq-consumer';
import { logger } from '../logger';

export interface VHostMap {
  home: HomeVHost;
  work: WorkVHost;
}

export class AMQPServer {
  protected readonly enabled: boolean;
  vhosts: VHostMap;

  constructor(config: RabbitMQConfig, enabled: boolean) {
    this.vhosts = {
      home: new HomeVHost('home', config),
      work: new WorkVHost('work', config),
    };
    this.enabled = enabled;
  }

  async start() {
    if (this.enabled) {
      await Promise.all(
        Object.values(this.vhosts).map(async (vHost: RabbitMQ) => {
          return vHost.init();
        })
      );
      logger.info(`RabbitMQ: AMQP server started`);
    }
  }

  startAllConsumers(container: AppContainer): void {
    if (this.enabled) {
      Object.values(this.vhosts).map((vHost: RabbitMQConsumer) => {
        if (vHost.startConsumers) vHost.startConsumers(container);
      });
    }
  }
}
