import knex from 'knex';
import { Container } from 'injection';
import { UserRepository } from './repositories/user';
import { UserService } from './services/user';
import { JsonPlaceholderIntegration } from './integrations/http/json-placeholder';
import { UserProducer } from './integrations/amqp/producers/user';
import { env } from '../env';
import { ContainerConfig } from '../types';

export class AppContainer extends Container {
  constructor(protected config: ContainerConfig) {
    super();
    this.loadProviders().forEach(provider => this.bind(provider));

    const configs = this.loadConfigs();
    for (const key in configs) {
      if (key) {
        this.registerObject(key, configs[key]);
      }
    }
  }

  protected loadProviders(): Function[] {
    return [
      UserService,
      UserRepository,
      JsonPlaceholderIntegration,
      UserProducer,
    ];
  }

  loadConfigs(): any {
    return {
      mysqlDatabase: knex(env.knexConfig),
      workVHost: this.config.workVHost,
    };
  }
}
