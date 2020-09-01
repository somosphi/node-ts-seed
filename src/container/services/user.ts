import { inject, provide } from 'injection';
import { UserRepository, User } from '../repositories/user';
import { JsonPlaceholderIntegration } from '../integrations/http/json-placeholder';
import { UserSources } from '../../enums';
import { ResourceNotFoundError } from '../../errors';
import { UserProducer } from '../integrations/amqp/producers/user';

@provide()
export class UserService {
  constructor(
    @inject() protected userRepository: UserRepository,
    @inject() protected jsonPlaceholderIntegration: JsonPlaceholderIntegration,
    @inject() protected userProducer: UserProducer
  ) {}

  all(): Promise<User[]> {
    return this.userRepository.all();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return user;
  }

  async create(
    userDto: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const { name, username, emailAddress } = userDto;

    try {
      const id = await this.userRepository.create(userDto);
      this.userProducer.send({ id, name, username, emailAddress });
      return id;
    } catch (err) {
      throw new Error(`Error creating user - reason: ${err}`);
    }
  }

  async fetchFromJsonPlaceholder(): Promise<string[]> {
    const jsonPlaceholderUsers = await this.jsonPlaceholderIntegration.getUsers();

    const jsonPlaceholderEmails = jsonPlaceholderUsers.map(
      jsonPlaceholderUser => jsonPlaceholderUser.email
    );

    const fetchedIds: string[] = [];

    await this.userRepository.transaction(async trx => {
      const sourceDatabaseUsers = await this.userRepository.getByEmailsWithSource(
        jsonPlaceholderEmails,
        UserSources.JsonPlaceholder,
        trx
      );

      await Promise.all(
        jsonPlaceholderUsers.map(async jsonPlaceholderUser => {
          const jsonPlaceholderEmail = jsonPlaceholderUser.email.toLowerCase();

          const sourceDatabaseUser = sourceDatabaseUsers.find(
            sourceDatabaseUser =>
              sourceDatabaseUser.emailAddress === jsonPlaceholderEmail
          );

          if (!sourceDatabaseUser) {
            const createData = {
              name: jsonPlaceholderUser.name,
              username: jsonPlaceholderUser.username,
              emailAddress: jsonPlaceholderEmail,
              source: UserSources.JsonPlaceholder,
            };
            fetchedIds.push(await this.userRepository.create(createData, trx));
          }
        })
      );
    });

    return fetchedIds;
  }
}
