export interface RouteConfig {
  method: string;
  path: string;
  func: Function;
  middlewares: Function[];
}

const createRouteDecorator = (method: string) =>
  function(path: string, middlewares: Function[] = []): Function {
    return function(target: any, propertyName: string) {
      if (!target.routeConfigs) {
        target.routeConfigs = [];
      }
      const func = target[propertyName];
      if (func instanceof Function) {
        target.routeConfigs.push({
          path,
          method,
          middlewares,
          func: target[propertyName],
        });
      }
    };
  };

// tslint:disable-next-line:variable-name
export const Controller = (path: string) =>
  function(constructorFunction: Function) {
    constructorFunction.prototype.path = path;
  };

// tslint:disable-next-line:variable-name
export const Get = createRouteDecorator('get');

// tslint:disable-next-line:variable-name
export const Post = createRouteDecorator('post');

// tslint:disable-next-line:variable-name
export const Put = createRouteDecorator('put');

// tslint:disable-next-line:variable-name
export const Patch = createRouteDecorator('patch');

// tslint:disable-next-line:variable-name
export const Delete = createRouteDecorator('delete');
