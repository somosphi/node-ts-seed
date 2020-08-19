export abstract class Command {
  abstract signature: string;

  abstract handle(): Promise<void>;
}
