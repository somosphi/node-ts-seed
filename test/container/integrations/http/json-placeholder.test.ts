import { nock, expect, sinon } from '../../../helpers';
import { env } from '../../../../src/env';
import { JsonPlaceholderIntegration } from '../../../../src/container/integrations/http/json-placeholder';

describe('JsonPlaceholderIntegration', () => {
  const baseURL = 'http://localhost:1500/jsonplaceholder';
  const nockInstance = nock(baseURL);

  sinon.replace(env, 'jsonPlaceholderUrl', baseURL);
  const jsonPlaceholderInstance = new JsonPlaceholderIntegration();

  describe('#getUsers', () => {
    it('should return users response', async () => {
      const payload = [
        {
          id: 1,
          name: 'fuluna',
          email: 'fuluna@aah.com',
        },
      ];

      nockInstance.get('/users').reply(200, payload);

      const users = await jsonPlaceholderInstance.getUsers();
      expect(users).to.be.eql(payload);
    });
  });
});
