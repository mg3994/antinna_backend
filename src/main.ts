import { handleGet } from './app/do_get';
import { handlePost } from './app/do_post';
import { bootstrap } from './app/bootstrap';
import { CleanupJob } from './core/jobs/cleanup_job';
import { MonthlyGSTJob } from './core/jobs/monthly_gst_job';
import { NotificationRetryJob } from './core/jobs/notification_retry_job';
import { BloggerSyncJob } from './core/jobs/blogger_sync_job';
import { DatabaseBackupJob } from './core/jobs/database_backup_job';
import { JobScheduler } from './core/scheduler/scheduler';

// 1. HTTP Entry Points
export function doGet(e: any): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput {
  return handleGet(e);
}

export function doPost(e: any): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput {
  return handlePost(e);
}

// 2. Scheduler Dispatcher Entry Points (called by ScriptApp Cron Triggers)
function getJobScheduler(): JobScheduler {
  const scheduler = new JobScheduler();
  scheduler.register(new CleanupJob());
  scheduler.register(new MonthlyGSTJob());
  scheduler.register(new NotificationRetryJob());
  scheduler.register(new BloggerSyncJob());
  scheduler.register(new DatabaseBackupJob());
  return scheduler;
}

export function handleCleanupJob(): void {
  const scheduler = getJobScheduler();
  scheduler.runJob('CleanupJob');
}

export function handleMonthlyGSTJob(): void {
  const scheduler = getJobScheduler();
  scheduler.runJob('MonthlyGSTJob');
}

export function handleNotificationRetryJob(): void {
  const scheduler = getJobScheduler();
  scheduler.runJob('NotificationRetryJob');
}

export function handleBloggerSyncJob(): void {
  const scheduler = getJobScheduler();
  scheduler.runJob('BloggerSyncJob');
}

export function handleDatabaseBackupJob(): void {
  const scheduler = getJobScheduler();
  scheduler.runJob('DatabaseBackupJob');
}
