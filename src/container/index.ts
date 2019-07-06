import knex from 'knex';
import { UserModel } from './models/user';
import { UserService } from './services/user';
import { JsonPlaceholderIntegration, JsonPlaceholderConfig } from './integrations/json-placeholder';

export interface ServiceContext {
  userModel: UserModel;
  jsonPlaceholderIntegration: JsonPlaceholderIntegration;
}

export interface ContainerConfig {
  jsonPlaceholderConfig: JsonPlaceholderConfig;
}

export class Container {
  readonly userService: UserService;

  constructor(mysqlDatabase: knex, config: ContainerConfig) {
    const serviceContext: ServiceContext = {
      userModel: new UserModel(mysqlDatabase),
      jsonPlaceholderIntegration: new JsonPlaceholderIntegration(config.jsonPlaceholderConfig),
    };

    this.userService = new UserService(serviceContext);
  }
}
