import readline from 'readline';
import { logger } from '../logger';
import { AppContainer } from '../container';
import { Command } from './commands/command';
import { FetchUsersCommand } from './commands/fetch-users';

export class Bash {
  protected commands: Command[];

  protected readline: readline.Interface;

  constructor(container: AppContainer) {
    this.commands = [new FetchUsersCommand(container)];
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    this.readline.on('line', async line => {
      await this.execute(line.trim().split(' '));
    });
  }

  get commandsCount(): number {
    return this.commands.length;
  }

  protected getCommandBySignature(signature: string): Command | undefined {
    return this.commands.find(command => command.signature === signature);
  }

  async execute(signatures: string[]): Promise<void> {
    for (const signature of signatures) {
      const command = this.getCommandBySignature(signature);
      if (!command) {
        logger.warn('Invalid command signature', { signature });
        return;
      }
      try {
        await command.handle();
        logger.info('Bash command handled with successfully', { signature });
      } catch (err) {
        logger.error(err);
      }
    }
  }
}
