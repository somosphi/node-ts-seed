import knex from 'knex';
import { UserModel } from './models/user';
import { UserService } from './services/user';
import { JsonPlaceholderIntegration, JsonPlaceholderConfig } from './integrations/json-placeholder';

export interface ServiceContext {
  mysqlDatabase: knex;
  userModel: UserModel;
  jsonPlaceholderIntegration: JsonPlaceholderIntegration;
}

export interface ContainerConfig {
  mysqlDatabase: knex;
  jsonPlaceholderConfig: JsonPlaceholderConfig;
}

export class Container {
  readonly userService: UserService;

  constructor(config: ContainerConfig) {
    const serviceContext: ServiceContext = {
      mysqlDatabase: config.mysqlDatabase,
      userModel: new UserModel(config.mysqlDatabase),
      jsonPlaceholderIntegration: new JsonPlaceholderIntegration(config.jsonPlaceholderConfig),
    };

    this.userService = new UserService(serviceContext);
  }
}
