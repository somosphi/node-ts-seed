import { HttpIntegration } from '../../../../src/container/integrations/http';
import { expect } from '../../helpers';

class TestHttpIntegration extends HttpIntegration {
  getInstance() {
    return this.instance;
  }
}

describe('HttpIntegration', () => {

  describe('#constructor', () => {
    it('should set instance property', () => {
      const httpIntegration = new TestHttpIntegration({
        baseURL: 'http://localhost:7001',
      });
      expect(httpIntegration.getInstance()).to.be.not.eql(null);
    });
  });
});
