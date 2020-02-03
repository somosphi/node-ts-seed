import knex from 'knex';
import { Container, provide } from 'injection';
import { UserModel } from './models/user';
import { UserService } from './services/user';
import {
  JsonPlaceholderIntegration,
  JsonPlaceholderConfig,
} from './integrations/json-placeholder';
export interface ContainerConfig {
  mysqlDatabase: knex;
  jsonPlaceholderConfig: JsonPlaceholderConfig;
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
    return [UserService, UserModel, JsonPlaceholderIntegration];
  }

  loadConfigs(): Config[] {
    return [
      { name: 'mysqlDatabase', value: this.config.mysqlDatabase },
      {
        name: 'jsonPlaceholderConfig',
        value: this.config.jsonPlaceholderConfig,
      },
    ];
  }
}
