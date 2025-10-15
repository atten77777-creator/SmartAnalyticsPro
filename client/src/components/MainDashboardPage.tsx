import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import ChartContainer from './ChartContainer';
import ChartRenderer from './ChartRenderer';
import { fetchChartsForDashboard, createChart } from '../services/api';

const ResponsiveGridLayout = WidthProvider(Responsive);

type Dashboard = {
  id: string;
  name: string;
  description: string;
};

type Chart = {
  id: string;
  name: string;
  type: string;
  position: Layout;
};

type MainDashboardPageProps = {
  activeDashboard: Dashboard | null;
  onToggleChat: () => void;
};

const MainDashboardPage: React.FC<MainDashboardPageProps> = ({ activeDashboard, onToggleChat }) => {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {
    if (activeDashboard) {
      fetchChartsForDashboard(activeDashboard.id)
        .then(response => {
          const fetchedCharts = response.data;
          setCharts(fetchedCharts);
          setLayout(fetchedCharts.map((chart: Chart) => chart.position));
        })
        .catch(error => console.error('Failed to fetch charts:', error));
    } else {
      setCharts([]);
      setLayout([]);
    }
  }, [activeDashboard]);

  const handleAddNewChart = () => {
    if (!activeDashboard) return;
    // For now, we'll add a placeholder chart. The modal will come next.
    const newChart = {
      name: 'New Awesome Chart',
      type: 'BarChart',
      config: {},
      position: { x: 0, y: 0, w: 4, h: 4 }, // Default position
    };
    createChart(activeDashboard.id, newChart)
      .then(response => {
        setCharts(prev => [...prev, response.data]);
        setLayout(prev => [...prev, response.data.position]);
      })
      .catch(error => console.error('Failed to create chart:', error));
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    // TODO: Persist the new layout to the backend
  };

  if (!activeDashboard) {
    return (
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center glass rounded-lg p-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to SmartAnalytics Pro</h2>
          <p className="text-gray-400">Please select a dashboard from the sidebar to begin, or create a new one.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col p-4">
      <header className="flex justify-between items-center mb-4 p-4 glass rounded-lg">
        <h1 className="text-3xl font-bold">{activeDashboard.name}</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleAddNewChart}
            className="px-4 py-2 bg-neon-cyan text-gray-900 font-semibold rounded-md hover:bg-cyan-300 transition-colors"
          >
            + New Chart
          </button>
          <button onClick={onToggleChat} className="px-4 py-2 glass rounded-lg hover:bg-white/20 transition-colors">
            Chat with AI
          </button>
        </div>
      </header>

      <div className="flex-1">
        {charts.length === 0 ? (
          <div className="flex items-center justify-center h-full glass rounded-lg">
            <div className="text-center">
              <p className="text-xl mb-4">This dashboard is empty.</p>
              <button onClick={handleAddNewChart} className="px-6 py-3 bg-neon-cyan text-gray-900 font-semibold rounded-md hover:bg-cyan-300 transition-colors">
                + Add Your First Chart
              </button>
            </div>
          </div>
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            onLayoutChange={handleLayoutChange}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            isDraggable={true}
            isResizable={true}
          >
            {charts.map((chart) => (
              <div key={chart.id} className="glass">
                <ChartContainer
                  id={chart.id}
                  name={chart.name}
                  onEdit={() => alert('Edit chart!')}
                  onDelete={() => alert('Delete chart!')}
                >
                  <ChartRenderer type={chart.type} data={{}} /> {/* We'll pass real data later */}
                </ChartContainer>
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>
    </main>
  );
};

export default MainDashboardPage;
