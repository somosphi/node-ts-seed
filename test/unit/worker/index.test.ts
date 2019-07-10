import { Worker } from '../../../src/worker';
import { Container } from '../../../src/container';
import { expect } from '../helpers';

describe('Worker', () => {
  describe('#jobConunt', () => {
    it('return length by jobs', () => {
      const container = new Container({
        // @ts-ignore
        jsonPlaceholderConfig: {},
      });

      const worker = new Worker(container);
      const result: number = worker.jobsCount;

      expect(result).to.be.not.eqls(null);
      expect(result).to.be.a('number');
    });
  });

  describe('#start', () => {
    it('start jobs', () => {
      const container = new Container({
        // @ts-ignore
        jsonPlaceholderConfig: {},
      });

      const worker = new Worker(container);
      worker.start();
    });
  });

  describe('#stop', () => {
    it('stop jobs', () => {
      const container = new Container({
        // @ts-ignore
        jsonPlaceholderConfig: {},
      });

      const worker = new Worker(container);
      worker.stop();
    });
  });
});
