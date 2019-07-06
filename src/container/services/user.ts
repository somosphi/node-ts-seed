import * as R from 'ramda';
import { UserModel, User } from '../models/user';
import { JsonPlaceholderIntegration } from '../integrations/json-placeholder';
import { UserSources } from '../../enums';
import { ServiceContext } from '..';

export class UserService {
  protected readonly userModel: UserModel;
  protected readonly jsonPlaceholderIntegration: JsonPlaceholderIntegration;

  constructor(context: ServiceContext) {
    this.userModel = context.userModel;
    this.jsonPlaceholderIntegration = context.jsonPlaceholderIntegration;
  }

  all(): Promise<User[]> {
    return this.userModel.all();
  }

  async fetchFromJsonPlaceholder(): Promise<void> {
    const [
      users,
      jsonPlaceholderUsers,
    ] = await Promise.all([
      this.all(),
      this.jsonPlaceholderIntegration.getUsers(),
    ]);

    const jsonPlaceholderEmails = R.pluck('email', jsonPlaceholderUsers);
    const databaseEmails = R.pluck('emailAddress', users);

    const emailsToRemove = R.difference(databaseEmails, jsonPlaceholderEmails);
    await this.userModel.removeByEmailAddresses(emailsToRemove);

    const emailsToAdd = R.difference(jsonPlaceholderEmails, databaseEmails);
    await Promise.all(emailsToAdd.map(async (emailToAdd) => {
      const jsonPlaceholderUser = jsonPlaceholderUsers
        .find(jsonPlaceholderUser => jsonPlaceholderUser.email === emailToAdd);

      if (jsonPlaceholderUser) {
        await this.userModel.create({
          name: jsonPlaceholderUser.name,
          emailAddress: jsonPlaceholderUser.email,
          source: UserSources.JsonPlaceholder,
        });
      }
    }));
  }
}
