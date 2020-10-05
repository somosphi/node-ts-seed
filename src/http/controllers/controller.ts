import { RouteConfig } from '../decorators';

export abstract class BaseController {
  path?: string;

  routeConfigs?: RouteConfig[];
}
