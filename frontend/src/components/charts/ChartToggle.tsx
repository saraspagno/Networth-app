import React from 'react';
import { Card, Button } from '../ui';

interface ChartToggleProps {
  isPieChart: boolean;
  onToggle: (isPie: boolean) => void;
}

const ChartToggle: React.FC<ChartToggleProps> = ({ isPieChart, onToggle }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <Card className="p-1">
        <div className="flex">
          <button
            onClick={() => onToggle(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isPieChart
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => onToggle(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isPieChart
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Bar Chart
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ChartToggle; 