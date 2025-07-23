import React from 'react';

interface ChartToggleProps {
  isPieChart: boolean;
  onToggle: (isPie: boolean) => void;
}

const ChartToggle: React.FC<ChartToggleProps> = ({ isPieChart, onToggle }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-white rounded-lg shadow-md p-1">
        <div className="flex">
          <button
            onClick={() => onToggle(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isPieChart
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => onToggle(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isPieChart
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bar Chart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartToggle; 