import { Bash } from '../../src/bash';
import { expect, sinon, assert } from '../helpers';

describe('Bash', () => {
  class TestBash extends Bash {
    setCommands(value: any) {
      this.commands = value;
    }
    getCommandBySignature(signature: string) {
      return super.getCommandBySignature(signature);
    }
  }

  describe('#commandsCount', () => {

    it('should return 0 when commands is empty array', () => {
      // @ts-ignore
      const bash = new TestBash({});
      bash.setCommands([]);
      expect(bash.commandsCount).to.be.eql(0);
    });

    it('should return 1 when commands have one command', () => {
      // @ts-ignore
      const bash = new TestBash({});
      bash.setCommands([{}]);
      expect(bash.commandsCount).to.be.eql(1);
    });
  });

  describe('#getCommandBySignature', () => {
    it('should return command when send a registered signature command', () => {
      // @ts-ignore
      const bash = new TestBash({});
      const payload = { signature: 'opa' };
      bash.setCommands([payload]);
      const command = bash.getCommandBySignature(payload.signature);
      expect(command).to.be.eql(payload);
    });

    it('should return undefined when send a not registered signature command', () => {
      // @ts-ignore
      const bash = new TestBash({});
      const payload = { signature: 'opa' };
      bash.setCommands([payload]);
      const command = bash.getCommandBySignature('yolo');
      expect(command).to.be.eql(undefined);
    });
  });

  describe('#execute', () => {
    it('should fail getting commands and dont throw error', async () => {
      // @ts-ignore
      const bash = new TestBash({});
      const commands = [
        { signature: 'opa', handle: sinon.fake.resolves(undefined) },
        { signature: 'ola', handle: sinon.fake.resolves(undefined) },
      ];
      bash.setCommands(commands);
      await bash.execute(['kkkk', 'haha']);
      commands.forEach((command) => {
        assert(command.handle.notCalled);
      });
    });

    it('should get commands and call handle method using valid signatures', async () => {
      // @ts-ignore
      const bash = new TestBash({});
      const commands = [
        { signature: 'opa', handle: sinon.fake.resolves(undefined) },
        { signature: 'ola', handle: sinon.fake.resolves(undefined) },
      ];
      bash.setCommands(commands);
      await bash.execute(commands.map(command => command.signature));
      commands.forEach((command) => {
        assert(command.handle.calledOnce);
      });
    });
  });
});
