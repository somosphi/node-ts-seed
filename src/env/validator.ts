import { IsInt, IsUrl, IsEnum, IsNotEmpty } from 'class-validator';

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

  constructor(props: any) {
    Object.assign(this, props);
  }
}
