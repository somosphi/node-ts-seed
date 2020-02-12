import { CronJob } from 'cron';
import { logger } from '../../logger';
import { WorkerJob } from '..';

export abstract class Cron extends CronJob implements WorkerJob {
  protected abstract handler(): Promise<void>;
  running: boolean;

  constructor(cronTime: string, timezone = 'Etc/UTC') {
    super(
      cronTime,
      () => this.execute(),
      () => this.onComplete(),
      false,
      timezone,
    );
    this.running = false;
  }

  protected onComplete(): void {
    //
  }

  protected async errorHandler(err: Error): Promise<void> {
    logger.error(err);
  }

  protected async execute(): Promise<void> {
    try {
      await this.handler();
    } catch (err) {
      try {
        await this.errorHandler(err);
      } catch (error) {
        logger.error(error);
      }
    }
  }
}
