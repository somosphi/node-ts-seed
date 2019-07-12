import { nock, expect } from '../../helpers';
import { JsonPlaceholderIntegration }
  from '../../../src/container/integrations/json-placeholder';

describe('JsonPlaceholderIntegration', () => {
  const baseURL = 'http://localhost:1500/jsonplaceholder';
  const nockInstance = nock(baseURL);
  const jsonPlaceholderInstance = new JsonPlaceholderIntegration({ baseURL });

  describe('#getUsers', () => {
    it('should return users response', async () => {
      const payload = [
        {
          id: 1,
          name: 'fuluna',
          email: 'fuluna@aah.com',
        },
      ];

      nockInstance
        .get('/users')
        .reply(200, payload);

      const users = await jsonPlaceholderInstance.getUsers();
      expect(users).to.be.eql(payload);
    });
  });
});
