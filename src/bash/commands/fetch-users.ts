import { Command } from './command';
import { Container } from '../../container';
import { UserService } from '../../container/services/user';

export class FetchUsersCommand extends Command {
  signature = 'fetch-users';
  protected readonly userService: UserService;

  constructor(container: Container) {
    super();
    this.userService = container.userService;
  }

  async handle(): Promise<void> {
    await this.userService.fetchFromJsonPlaceholder();
  }
}
