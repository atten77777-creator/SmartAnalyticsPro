import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Dashboard API calls
export const fetchDashboards = () => apiClient.get('/dashboards');
export const createDashboard = (dashboard: { name: string; description: string; refreshRule: string }) =>
  apiClient.post('/dashboards', dashboard);
export const updateDashboard = (id: string, dashboard: { name: string; description: string; refreshRule: string }) =>
  apiClient.put(/dashboards/, dashboard);
export const deleteDashboard = (id: string) => apiClient.delete(/dashboards/);

// Chart API calls
export const fetchChartsForDashboard = (dashboardId: string) => apiClient.get(/charts/);
export const createChart = (dashboardId: string, chart: { name: string; type: string; config: any; position: any }) =>
  apiClient.post(/charts/, chart);
export const updateChart = (dashboardId: string, chartId: string, chart: any) =>
  apiClient.put(/charts//, chart);
export const deleteChart = (dashboardId: string, chartId: string) =>
  apiClient.delete(/charts//);
export const fetchChartData = (dashboardId: string, chartId: string) =>
  apiClient.get(/charts///data);
