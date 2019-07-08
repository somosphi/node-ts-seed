import { Container } from '../../../src/container';
import { expect } from '../helpers';

describe('Container', () => {

  describe('#constructor', () => {
    it('should contains public property "userService"', () => {
      // @ts-ignore
      const container = new Container({}, {
        jsonPlaceholderConfig: {},
      });
      expect(container.userService).to.be.not.equal(null);
    });
  });
});
