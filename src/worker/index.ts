import { FetchUsersJob } from './jobs/fetch-users';
import { AppContainer } from '../container';
import { WorkerJob } from '../types';

export class Worker {
  protected jobs: WorkerJob[];

  constructor(container: AppContainer) {
    this.jobs = [new FetchUsersJob(container)];
  }

  get jobsCount(): number {
    return this.jobs.length;
  }

  start(): void {
    this.jobs.filter(job => !job.running).forEach(job => job.start());
  }

  stop(): void {
    this.jobs.filter(job => job.running).forEach(job => job.stop());
  }
}
