const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const oracledb = require('oracledb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let pool;

async function initializePool() {
  try {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2,
    });
    console.log('Oracle DB connection pool created successfully.');
  } catch (err) {
    console.error('Error creating Oracle DB connection pool:', err);
    process.exit(1);
  }
}

initializePool();

app.get('/', (req, res) => {
  res.send('SmartAnalytics Pro Backend is running!');
});

// --- API Routes ---
app.use('/api/dashboards', require('./routes/dashboards'));
app.use('/api/charts', require('./routes/charts')); // Add this line

app.listen(PORT, () => {
  console.log(Server is running on http://localhost:);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  if (pool) {
    pool.close(10);
    console.log('Oracle DB connection pool closed.');
  }
  process.exit(0);
});
