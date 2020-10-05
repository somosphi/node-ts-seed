import { HomeVHost } from './vhosts/home';
import { RabbitMQConfig, RabbitMQ, InitOptions } from './vhosts/index';
import { WorkVHost } from './vhosts/work';
import { AppContainer } from '../container';
import { logger } from '../logger';

export interface VHostMap {
  home: HomeVHost;
  work: WorkVHost;
}

export class AMQPServer {
  protected readonly enabled: boolean;

  vhosts: VHostMap;

  constructor(config: RabbitMQConfig, enabled: boolean) {
    // @ts-ignore
    this.vhosts = {
      home: new HomeVHost('home', config),
      work: new WorkVHost('work', config),
    };
    this.enabled = enabled;
  }

  async start(container: AppContainer, initOptions?: InitOptions) {
    if (this.enabled) {
      await Promise.all(
        Object.values(this.vhosts).map(async (vHost: RabbitMQ) => {
          return vHost.init(container, initOptions);
        })
      );
      logger.info(`RabbitMQ: AMQP server started`);
    }
  }
}
