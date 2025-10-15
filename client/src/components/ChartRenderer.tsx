import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartRendererProps = {
  type: string;
  data: any;
  config?: any; // For future styling options
};

const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, config }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white', // Make legend text white for dark theme
        }
      },
      title: {
        display: false, // Title is handled by ChartContainer
      },
    },
    scales: {
      x: {
        ticks: { color: 'white' }, // X-axis labels
        grid: { color: 'rgba(255, 255, 255, 0.1)' }, // X-axis grid lines
      },
      y: {
        ticks: { color: 'white' }, // Y-axis labels
        grid: { color: 'rgba(255, 255, 255, 0.1)' }, // Y-axis grid lines
      },
    },
  };

  switch (type) {
    case 'LineChart':
      return <Line data={data} options={options} />;
    case 'BarChart':
      return <Bar data={data} options={options} />;
    default:
      return (
        <div className="text-center text-gray-500">
          <p className="text-lg">Chart Type '{type}'</p>
          <p>Not yet supported.</p>
        </div>
      );
  }
};

export default ChartRenderer;
