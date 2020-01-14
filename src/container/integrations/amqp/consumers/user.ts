import { RabbitMQInjection } from '../../../../amqp/decorator';
import { Consumer } from './consumer';

@RabbitMQInjection('home')
export class UserConsumer implements Consumer {}
