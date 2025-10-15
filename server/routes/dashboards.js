const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');

// @desc   Get all dashboards
// @route  GET /api/dashboards
router.get('/', (req, res) => {
  try {
    const dashboards = dataStore.getDashboards();
    res.json(dashboards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboards.' });
  }
});

// @desc   Get a single dashboard by ID
// @route  GET /api/dashboards/:id
router.get('/:id', (req, res) => {
  try {
    const dashboard = dataStore.getDashboardById(req.params.id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found.' });
    }
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard.' });
  }
});

// @desc   Create a new dashboard
// @route  POST /api/dashboards
router.post('/', (req, res) => {
  try {
    const { name, description, refreshRule } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Dashboard name is required.' });
    }
    const newDashboard = dataStore.createDashboard({ name, description, refreshRule });
    res.status(201).json(newDashboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dashboard.' });
  }
});

// @desc   Update a dashboard
// @route  PUT /api/dashboards/:id
router.put('/:id', (req, res) => {
  try {
    const { name, description, refreshRule } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Dashboard name is required.' });
    }
    const updatedDashboard = dataStore.updateDashboard(req.params.id, { name, description, refreshRule });
    if (!updatedDashboard) {
      return res.status(404).json({ error: 'Dashboard not found.' });
    }
    res.json(updatedDashboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dashboard.' });
  }
});

// @desc   Delete a dashboard
// @route  DELETE /api/dashboards/:id
router.delete('/:id', (req, res) => {
  try {
    const success = dataStore.deleteDashboard(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Dashboard not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dashboard.' });
  }
});

module.exports = router;
