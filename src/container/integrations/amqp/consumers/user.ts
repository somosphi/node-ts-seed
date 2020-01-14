import { RabbitMQInjection } from '../../../../amqp/decorator';
import { Consumer } from './consumer';
import { RabbitMQ } from '../../../../amqp/providers/rabbitmq';

@RabbitMQInjection('home')
export class UserConsumer implements Consumer {}

  @Consume('fila')
  startConsume(mensagem: string) {
    console.log('hehe');
  }
}
