import knex from 'knex';
import { UserModel } from './models/user';
import { UserService } from './services/user';
import {
  JsonPlaceholderIntegration,
  JsonPlaceholderConfig,
} from './integrations/http/json-placeholder';
import { UserProducer } from './integrations/amqp/producers/user';
import { WorkVHost } from '../amqp/vhosts/work';
import { HomeVHost } from '../amqp/vhosts/home';

export interface ServiceContext {
  userModel: UserModel;
  jsonPlaceholderIntegration: JsonPlaceholderIntegration;
  userProducer: UserProducer;
}

export interface ContainerConfig {
  mysqlDatabase: knex;
  jsonPlaceholderConfig: JsonPlaceholderConfig;
  homeVHost: HomeVHost;
  workVHost: WorkVHost;
}

export class Container {
  userService: UserService;

  constructor(config: ContainerConfig) {
    const serviceContext: ServiceContext = {
      userModel: new UserModel(config.mysqlDatabase),
      jsonPlaceholderIntegration: new JsonPlaceholderIntegration(
        config.jsonPlaceholderConfig
      ),
      userProducer: new UserProducer(config.workVHost),
    };
    this.userService = new UserService(serviceContext);
  }
}
