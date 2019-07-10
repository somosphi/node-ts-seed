import { Cron } from '../../../../src/worker/jobs/cron';
import { assert, sinon } from '../../helpers';

class TestCron extends Cron {
  constructor() {
    super('* * * * * *');
  }

  async handler(): Promise<void> {
  }

  onComplete(): void {
  }

  async errorHandler(): Promise<void> {
  }
  // @ts-ignore
  execute() {
    return super.execute();
  }
}

describe('Cron', () => {
  describe('#execute', () => {
    it('shold call handler', async () => {
      const handlerFake = sinon.fake.resolves(undefined);

      const cron = new TestCron();
      cron.handler = handlerFake;

      await cron.execute();
      assert(handlerFake.calledOnce);
    });

    it('shold call errorHandler', async () => {
      const error = new Error();
      const handlerFake = sinon.fake.rejects(error);
      const errorHandlerFake = sinon.fake.resolves(undefined);
      const cron = new TestCron();
      cron.errorHandler = errorHandlerFake;
      cron.handler = handlerFake;

      await cron.execute();
      assert(errorHandlerFake.calledOnceWith(error));
    });
  });
});
