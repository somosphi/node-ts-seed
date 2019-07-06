import { Cron } from './cron';
import { UserService } from '../../container/services/user';
import { logger } from '../../logger';
import { Container } from '../../container';

export class FetchUsersJob extends Cron {
  protected userService: UserService;

  constructor(container: Container) {
    super('*/30 * * * * *');
    this.userService = container.userService;
  }

  protected async handler(): Promise<void> {
    await this.userService.fetchFromJsonPlaceholder();
    logger.info('Fetched from json placeholder api');
  }

  protected async errorHandler(err: Error): Promise<void> {
    logger.error('Failed to fetch from json placeholder api', err);
  }
}
