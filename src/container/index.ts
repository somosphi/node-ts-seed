import knex from 'knex';
import { UserModel } from './models/user';
import { UserService } from './services/user';
import {
  JsonPlaceholderIntegration,
  JsonPlaceholderConfig,
} from './integrations/http/json-placeholder';
import { UserProducer } from './integrations/amqp/producers/user';

export interface ServiceContext {
  userModel: UserModel;
  jsonPlaceholderIntegration: JsonPlaceholderIntegration;
  userProducer: UserProducer;
}

export interface ContainerConfig {
  mysqlDatabase: knex;
  jsonPlaceholderConfig: JsonPlaceholderConfig;
}

export class Container {
  readonly userService: UserService;

  constructor(config: ContainerConfig) {
    const serviceContext: ServiceContext = {
      userModel: new UserModel(config.mysqlDatabase),
      jsonPlaceholderIntegration: new JsonPlaceholderIntegration(
        config.jsonPlaceholderConfig
      ),
      userProducer: new UserProducer(),
    };
    this.userService = new UserService(serviceContext);
  }
}
