import { Job } from '../jobs/job';

export class JobScheduler {
  private jobs: Map<string, Job> = new Map();

  public register(job: Job): void {
    this.jobs.set(job.name, job);
  }

  public async runJob(jobName: string): Promise<void> {
    const job = this.jobs.get(jobName);
    if (!job) {
      throw new Error(`Job "${jobName}" is not registered in the scheduler.`);
    }

    console.log(`Scheduler: Starting execution of Job [${jobName}]...`);
    try {
      await job.execute();
      console.log(`Scheduler: Job [${jobName}] executed successfully.`);
    } catch (err) {
      console.error(`Scheduler: Job [${jobName}] failed during execution:`, err);
      throw err;
    }
  }

  public getJobs(): Job[] {
    return Array.from(this.jobs.values());
  }
}
