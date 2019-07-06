import { CronJob } from 'cron';
import { logger } from '../../logger';
import { WorkerJob } from '..';

export abstract class Cron extends CronJob implements WorkerJob {
  protected abstract handler(): Promise<void>;
  running: boolean;

  constructor(cronTime: string, timezone: string = 'Etc/UTC') {
    super(
      cronTime,
      async () => {
        try {
          await this.handler();
        } catch (err) {
          this.errorHandler(err);
        }
      },
      () => this.onComplete(),
      false,
      timezone,
    );
    this.running = false;
  }

  protected onComplete(): void {
    //
  }

  protected errorHandler(err: Error): void {
    logger.error(err);
  }
}
