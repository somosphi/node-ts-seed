import knex from 'knex';
import { Container } from 'injection';
import { UserRepository } from './repositories/user';
import { UserService } from './services/user';
import { JsonPlaceholderIntegration } from './integrations/http/json-placeholder';
import { UserProducer } from './integrations/amqp/producers/user';
import { WorkVHost } from '../amqp/vhosts/work';
import { HomeVHost } from '../amqp/vhosts/home';
import { env } from '../env';

export interface ContainerConfig {
  homeVHost: HomeVHost;
  workVHost: WorkVHost;
}

export class AppContainer extends Container {
  constructor(protected config: ContainerConfig) {
    super();
    this.loadProviders().forEach(provider => this.bind(provider));
    
    const configs = this.loadConfigs();
    for (let key in configs) {
      this.registerObject(key, configs[key]);
    }
  }

  protected loadProviders(): Function[] {
    return [UserService, UserRepository, JsonPlaceholderIntegration, UserProducer];
  }

  loadConfigs(): any {
    return {
      mysqlDatabase: knex(env.knexConfig),
      workVHost: this.config.workVHost,
    };
  }
}
