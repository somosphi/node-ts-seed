import { Container } from '../../src/container';
import { expect } from '../helpers';

describe('Container', () => {

  describe('#constructor', () => {
    it('should contains public property "userService"', () => {
      const container = new Container({
        // @ts-ignore
        jsonPlaceholderConfig: {},
      });
      expect(container.userService).to.be.not.equal(null);
    });
  });
});
