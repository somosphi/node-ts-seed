import { RabbitMQ as RabbitMQAbstract } from './providers/rabbitmq';
import { AMQPServer } from '.';

// tslint:disable-next-line:variable-name
export const RabbitMQ = (vHostName: string) =>
  function(constructorFunction: Function) {
    const vHost = AMQPServer.readyVhosts.find(
      (vHost: RabbitMQAbstract) => vHost.vHost === vHostName
    );
    constructorFunction.prototype.vHost = vHost;
  };
