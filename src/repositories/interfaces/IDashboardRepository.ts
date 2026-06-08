import { DashboardSummary, DashboardAlert, DashboardActivity, DashboardInsight } from '../../domain/types';

export interface IDashboardRepository {
  getSummary(params?: { periodDays?: number }): Promise<DashboardSummary>;
  getAlerts(): Promise<DashboardAlert[]>;
  getInsights(): Promise<DashboardInsight[]>;
  getRecentActivity(): Promise<DashboardActivity[]>;
}
