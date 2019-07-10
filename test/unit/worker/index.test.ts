import { Worker } from '../../../src/worker';
import { Container } from '../../../src/container';
import { expect } from '../helpers';

describe('Worker', () => {
  describe('#jobConunt', () => {
    it('return length by jobs', () => {
      // @ts-ignore
      const container = new Container({}, {
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
      // @ts-ignore
      const container = new Container({}, {
        jsonPlaceholderConfig: {},
      });

      const worker = new Worker(container);
      worker.start();
    });
  });

  describe('#stop', () => {
    it('stop jobs', () => {
      // @ts-ignore
      const container = new Container({}, {
        jsonPlaceholderConfig: {},
      });

      const worker = new Worker(container);
      worker.stop();
    });
  });
});
