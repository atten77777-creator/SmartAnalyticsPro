const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');

// Middleware to check if dashboard exists
const checkDashboardExists = (req, res, next) => {
  const dashboard = dataStore.getDashboardById(req.params.dashboardId);
  if (!dashboard) {
    return res.status(404).json({ error: 'Dashboard not found.' });
  }
  next();
};

router.use('/:dashboardId', checkDashboardExists);

// @desc   Get all charts for a dashboard
// @route  GET /api/charts/:dashboardId
router.get('/:dashboardId', (req, res) => {
  try {
    const charts = dataStore.getChartsByDashboardId(req.params.dashboardId);
    res.json(charts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch charts.' });
  }
});

// @desc   Add a new chart to a dashboard
// @route  POST /api/charts/:dashboardId
router.post('/:dashboardId', (req, res) => {
  try {
    const { name, type, config, position } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Chart name and type are required.' });
    }
    const newChart = dataStore.createChart(req.params.dashboardId, { name, type, config, position });
    res.status(201).json(newChart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chart.' });
  }
});

// @desc   Update a chart
// @route  PUT /api/charts/:dashboardId/:chartId
router.put('/:dashboardId/:chartId', (req, res) => {
  try {
    const updatedChart = dataStore.updateChart(req.params.dashboardId, req.params.chartId, req.body);
    if (!updatedChart) {
      return res.status(404).json({ error: 'Chart not found.' });
    }
    res.json(updatedChart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chart.' });
  }
});

// @desc   Delete a chart
// @route  DELETE /api/charts/:dashboardId/:chartId
router.delete('/:dashboardId/:chartId', (req, res) => {
  try {
    const success = dataStore.deleteChart(req.params.dashboardId, req.params.chartId);
    if (!success) {
      return res.status(404).json({ error: 'Chart not found.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chart.' });
  }
});

// @desc   Get data for a specific chart (Mock Data for now)
// @route  GET /api/charts/:dashboardId/:chartId/data
router.get('/:dashboardId/:chartId/data', (req, res) => {
  try {
    // In a real app, this would execute a SQL query based on the chart's config.
    // For now, we return mock data.
    const mockData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Sales',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
        {
          label: 'Profit',
          data: [2, 3, 20, 5, 1, 4],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    };
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chart data.' });
  }
});

module.exports = router;
