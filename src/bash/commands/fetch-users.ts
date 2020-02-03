import { Command } from './command';
import { AppContainer } from '../../container';
import { UserService } from '../../container/services/user';

export class FetchUsersCommand extends Command {
  signature: string = 'fetch-users';
  protected readonly userService: UserService;

  constructor(container: AppContainer) {
    super();
    this.userService = container.get<UserService>(UserService);
  }

  async handle(): Promise<void> {
    await this.userService.fetchFromJsonPlaceholder();
  }
}
