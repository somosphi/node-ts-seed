import knex from 'knex';
import { Container } from 'injection';
import { UserModel } from './models/user';
import { UserService } from './services/user';
import {
  JsonPlaceholderIntegration,
  JsonPlaceholderConfig,
} from './integrations/http/json-placeholder';
import { UserProducer } from './integrations/amqp/producers/user';
import { WorkVHost } from '../amqp/vhosts/work';
import { HomeVHost } from '../amqp/vhosts/home';

export interface ContainerConfig {
  mysqlDatabase: knex;
  jsonPlaceholderConfig: JsonPlaceholderConfig;
  homeVHost: HomeVHost;
  workVHost: WorkVHost;
}

export interface Config {
  name: string;
  value: any;
}

export class AppContainer extends Container {
  constructor(protected config: ContainerConfig) {
    super();
    this.loadProviders().forEach(provider => this.bind(provider));
    this.loadConfigs().forEach(config =>
      this.registerObject(config.name, config.value)
    );
  }

  protected loadProviders(): Function[] {
    return [UserService, UserModel, JsonPlaceholderIntegration, UserProducer];
  }

  loadConfigs(): Config[] {
    return [
      { name: 'mysqlDatabase', value: this.config.mysqlDatabase },
      {
        name: 'jsonPlaceholderConfig',
        value: this.config.jsonPlaceholderConfig,
      },
      { name: 'workVHost', value: this.config.workVHost },
    ];
  }
}
