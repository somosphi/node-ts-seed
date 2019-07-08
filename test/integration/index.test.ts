import { expect, request } from './helpers';
import { User } from '../../src/container/models/user';

const validateUser = (user: User): void => {
  expect(user.id).to.be.a('string');
  expect(user.name).to.be.a('string');
  expect(user.username).to.be.a('string');
  expect(user.emailAddress).to.be.a('string');
  expect(new Date(user.createdAt).toISOString()).to.be.eql(user.createdAt);
  expect(new Date(user.updatedAt).toISOString()).to.be.eql(user.updatedAt);
};

describe('Integration test', async () => {

  describe('Http server', () => {
    const idsToCheckFind: string[] = [];

    it('should throw NOT_FOUND error in not registered routes', async () => {
      const pathsToTest = [
        '/invalid',
        '/yolo',
        '/test/ola',
      ];

      await Promise.all(
        pathsToTest.map(async (path) => {
          const results = await Promise.all([
            request.get(path),
            request.post(path),
            request.put(path),
            request.delete(path),
          ]);

          results.forEach((result) => {
            expect(result.status).to.be.eql(404);
            expect(result.body.code).to.be.eql('NOT_FOUND');
          });
        }),
      );
    });

    it('should return users when call "GET /users"', async () => {
      const response = await request.get('/users');
      const users: User[] = response.body;

      expect(response.status).to.be.eql(200);
      expect(users).to.be.instanceOf(Array);
      users.forEach((user) => {
        validateUser(user);
        idsToCheckFind.push(user.id);
      });
    });

    it('should return user when call "GET /users/:id"', async () => {
      await Promise.all(
        idsToCheckFind.map(async (id) => {
          const response = await request.get(`/users/${id}`);
          expect(response.status).to.be.eql(200);

          const user: User = response.body;
          validateUser(user);
        }),
      );
    });

    it('should return RESOURCE_NOT_FOUND error when call "GET /users/:id"', async () => {
      const invalidIds = ['999999999', '7894561234'];
      await Promise.all(
        invalidIds.map(async (id) => {
          const response = await request.get(`/users/${id}`);
          expect(response.status).to.be.eql(404);
          expect(response.body.code).to.be.eql('RESOURCE_NOT_FOUND');
        }),
      );
    });
  });
});
