// A simple in-memory data store for development.
// In production, this would be replaced by a real database (e.g., PostgreSQL, MongoDB).

let dashboards = [
  {
    id: 'dash1',
    name: 'Sales Performance',
    description: 'Monthly sales figures and trends.',
    refreshRule: '5m',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: 'dash2',
    name: 'Customer Analytics',
    description: 'Deep dive into customer segments and behavior.',
    refreshRule: '1h',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-10T11:30:00Z',
  },
];

// This will store charts for all dashboards. Key: dashboardId, Value: array of charts
let chartsByDashboard = {
  dash1: [
    {
      id: 'chart1',
      dashboardId: 'dash1',
      name: 'Monthly Sales Trend',
      type: 'LineChart',
      config: { /* chart specific config */ },
      position: { x: 0, y: 0, w: 6, h: 4 },
      createdAt: '2024-01-16T10:00:00Z',
    },
  ],
};

const getNextId = (prefix) => ${prefix};

const dataStore = {
  // --- Dashboards ---
  getDashboards: () => dashboards,
  getDashboardById: (id) => dashboards.find(d => d.id === id),
  createDashboard: (dashboardData) => {
    const newDashboard = { id: getNextId('dash'), ...dashboardData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    dashboards.push(newDashboard);
    return newDashboard;
  },
  updateDashboard: (id, updateData) => {
    const dashboardIndex = dashboards.findIndex(d => d.id === id);
    if (dashboardIndex === -1) return null;
    const updatedDashboard = { ...dashboards[dashboardIndex], ...updateData, updatedAt: new Date().toISOString() };
    dashboards[dashboardIndex] = updatedDashboard;
    return updatedDashboard;
  },
  deleteDashboard: (id) => {
    const dashboardIndex = dashboards.findIndex(d => d.id === id);
    if (dashboardIndex === -1) return false;
    dashboards.splice(dashboardIndex, 1);
    // Also delete all charts associated with this dashboard
    delete chartsByDashboard[id];
    return true;
  },

  // --- Charts ---
  getChartsByDashboardId: (dashboardId) => chartsByDashboard[dashboardId] || [],

  createChart: (dashboardId, chartData) => {
    if (!chartsByDashboard[dashboardId]) {
      chartsByDashboard[dashboardId] = [];
    }
    const newChart = {
      id: getNextId('chart'),
      dashboardId,
      ...chartData,
      createdAt: new Date().toISOString(),
    };
    chartsByDashboard[dashboardId].push(newChart);
    return newChart;
  },

  updateChart: (dashboardId, chartId, updateData) => {
    const charts = chartsByDashboard[dashboardId];
    if (!charts) return null;
    const chartIndex = charts.findIndex(c => c.id === chartId);
    if (chartIndex === -1) return null;
    const updatedChart = { ...charts[chartIndex], ...updateData };
    charts[chartIndex] = updatedChart;
    return updatedChart;
  },

  deleteChart: (dashboardId, chartId) => {
    const charts = chartsByDashboard[dashboardId];
    if (!charts) return false;
    const initialLength = charts.length;
    chartsByDashboard[dashboardId] = charts.filter(c => c.id !== chartId);
    return chartsByDashboard[dashboardId].length < initialLength;
  },
};

module.exports = dataStore;
