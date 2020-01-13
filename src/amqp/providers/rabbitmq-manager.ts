import { Options, Channel } from "amqplib";
import { logger } from "../../logger";

export class RabbitMQManager {
  protected readonly channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  async bindQueue(
    queueName: string,
    routingKeyName: string,
    pattern: string,
    args?: any
  ) {
    const resp = await this.channel.bindQueue(
      queueName,
      routingKeyName,
      pattern,
      args
    );
    logger.info(
      `Bind Queue => queueName ${queueName} - routingKeyName: ${routingKeyName}`
    );
  }

  async createExchange(
    exchangeName: string,
    type: string,
    additionalParams?: Options.AssertExchange
  ) {
    const resp = await this.channel.assertExchange(
      exchangeName,
      type,
      additionalParams
    );
    logger.info(`Create Exchange: response - ${resp.exchange}`);
  }

  async createQueue(queueName: string, additionalParams?: Options.AssertQueue) {
    const resp = await this.channel.assertQueue(queueName, additionalParams);
    logger.info(`Create Queue: response: ${resp.queue}`);
  }
}
