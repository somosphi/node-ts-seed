import { FetchUsersJob } from '../../../src/worker/jobs/fetch-users';
import { sinon, assert } from '../../helpers';
import { Cron } from '../../../src/worker/jobs/cron';

class TestFetchUsersJob extends FetchUsersJob {
  async handler(): Promise<void> {
    await super.handler();
  }

  async errorHandler(err: Error): Promise<void> {
    await super.errorHandler(err);
  }
}

describe('FetchUsers', () => {
  describe('#handler', () => {
    it('should call fetch users from jsonPlaceholder', async () => {

      const fetchUsers = [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: 'Gwenborough',
            zipcode: '92998-3874',
            geo: {
              lat: '-37.3159',
              lng: '81.1496',
            },
          },
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: {
            name: 'Romaguera-Crona',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets',
          },
        },
        {
          id: 2,
          name: 'Ervin Howell',
          username: 'Antonette',
          email: 'Shanna@melissa.tv',
          address: {
            street: 'Victor Plains',
            suite: 'Suite 879',
            city: 'Wisokyburgh',
            zipcode: '90566-7771',
            geo: {
              lat: '-43.9509',
              lng: '-34.4618',
            },
          },
          phone: '010-692-6593 x09125',
          website: 'anastasia.net',
          company: {
            name: 'Deckow-Crist',
            catchPhrase: 'Proactive didactic contingency',
            bs: 'synergize scalable supply-chains',
          },
        },
      ];

      const userServiceFake = {
        fetchFromJsonPlaceholder: sinon.fake.resolves(fetchUsers),
      };

      const container = {
        userService: userServiceFake,
      };

      // @ts-ignore
      const fetchUsersJob = new TestFetchUsersJob(container);
      await fetchUsersJob.handler();

      assert(userServiceFake.fetchFromJsonPlaceholder.calledOnce);
    });
  });

  describe('#errorHandler', () => {
    it('should call super errorHandler method error', async () => {
      const cronErrHandler = sinon.fake.returns(undefined);

      // @ts-ignore
      const originalErrHandler = Cron.prototype.errorHandler;
      // @ts-ignore
      Cron.prototype.errorHandler = cronErrHandler;
      // @ts-ignore
      const fetchUsersJob = new TestFetchUsersJob({});

      const err = new Error();
      await fetchUsersJob.errorHandler(err);
      assert(cronErrHandler.calledOnceWith(err));
      // @ts-ignore
      Cron.prototype.errorHandler = originalErrHandler;
    });
  });
});
