import { FetchUsersJob } from './jobs/fetch-users';
import { Container } from '../container';

export interface WorkerJob {
  running: boolean;
  start(): void;
  stop(): void;
}

export class Worker {
  protected jobs: WorkerJob[];

  constructor(container: Container) {
    this.jobs = [
      new FetchUsersJob(container),
    ];
  }

  start(): void {
    this.jobs
      .filter(job => !job.running)
      .forEach(job => job.start());
  }

  stop(): void {
    this.jobs
      .filter(job => job.running)
      .forEach(job => job.stop());
  }
}
