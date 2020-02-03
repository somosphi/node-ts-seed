import { Cron } from './cron';
import { UserService } from '../../container/services/user';
import { logger } from '../../logger';
import { AppContainer } from '../../container';

export class FetchUsersJob extends Cron {
  protected userService: UserService;

  constructor(container: AppContainer) {
    super('*/60 * * * * *');
    this.userService = container.get<UserService>(UserService);
  }

  protected async handler(): Promise<void> {
    const fetchedUsers = await this.userService.fetchFromJsonPlaceholder();
    logger.info('Fetched users from json placeholder api', {
      usersCount: fetchedUsers.length,
    });
  }

  protected async errorHandler(err: Error): Promise<void> {
    super.errorHandler(err);
    logger.warn('Failed to fetch from json placeholder api');
  }
}
