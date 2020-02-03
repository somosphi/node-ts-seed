import { Worker } from '../../src/worker';
import { AppContainer } from '../../src/container';
import { expect } from '../helpers';

describe('Worker', () => {
  const container = new AppContainer({
    // @ts-ignore
    jsonPlaceholderConfig: {},
  });
  describe('#jobConunt', () => {
    it('return length by jobs', () => {
      const worker = new Worker(container);
      const result: number = worker.jobsCount;

      expect(result).to.be.not.eqls(null);
      expect(result).to.be.a('number');
    });
  });

  describe('#start', () => {
    it('start jobs', () => {
      const worker = new Worker(container);
      worker.start();
    });
  });

  describe('#stop', () => {
    it('stop jobs', () => {
      const worker = new Worker(container);
      worker.stop();
    });
  });
});
