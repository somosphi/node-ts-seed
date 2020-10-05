import { IsInt, IsUrl, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class EnvValidator {
  knexConfig: any;

  @IsInt()
  @IsNotEmpty()
  httpPort: number;

  @IsNotEmpty()
  httpBodyLimit: string;

  @IsUrl()
  jsonPlaceholderUrl: string;

  @IsNotEmpty()
  rabbitMQEnabled: string;

  @IsEnum(['amqp'])
  rabbitMQProtocol: string;

  @IsNotEmpty()
  rabbitMQHost: string;

  @IsInt()
  rabbitMQPort: number;

  @IsNotEmpty()
  rabbitMQUsername: string;

  @IsNotEmpty()
  rabbitMQPassword: string;

  @IsNotEmpty()
  rabbitMQHomeVHost: string;

  @IsNotEmpty()
  rabbitMQWorkVHost: string;

  @IsNumber()
  rabbitMQConsumerPrefetch: number;

  @IsNumber()
  rabbitMQProducerPrefetch: number;

  constructor(props: any) {
    Object.assign(this, props);
  }
}
