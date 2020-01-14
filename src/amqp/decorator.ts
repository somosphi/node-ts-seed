import { RabbitMQ as RabbitMQAbstract } from './providers/rabbitmq';
import { AMQPServer } from '.';

export const createConsumerDecorator = () =>
  function(queueName: string): Function {
    return function(target: any, propertyName: string) {
      console.log(queueName);
      console.log(target.vHost);
    };
  };

// tslint:disable-next-line:variable-name
export const RabbitMQInjection = (vHostName: string) =>
  function(constructorFunction: Function) {
    const vHost = AMQPServer.readyVhosts.find(
      (vHost: RabbitMQAbstract) => vHost.vHost === vHostName
    );
    constructorFunction.prototype.vHost = vHost;
  };

// tslint:disable-next-line:variable-name
export const Consume = createConsumerDecorator();
