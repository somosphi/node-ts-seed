import { RabbitMQ as RabbitMQAbstract } from './vhosts/index';
import { AMQPServer } from '.';

// tslint:disable-next-line:variable-name
export const RabbitMQInjection = (vHostName: string) =>
  function(constructorFunction: Function) {
    const vHost = AMQPServer.readyVhosts.find(
      (vHost: RabbitMQAbstract) => vHost.vHost === vHostName
    );
    constructorFunction.prototype.vHost = vHost;
  };
