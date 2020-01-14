import { RabbitMQ } from '../../../../amqp/decorator';
import { Consumer } from './consumer';

@RabbitMQ('home')
export class UserConsumer implements Consumer {}
