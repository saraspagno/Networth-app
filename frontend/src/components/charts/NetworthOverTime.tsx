import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, Typography } from '../ui';

interface NetworthOverTimeProps {
  data: Array<{date: string, total: number}>;
}

const NetworthOverTime: React.FC<NetworthOverTimeProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <CardContent>
          <Typography variant="h3" className="mb-4">Networth Over Time</Typography>
          <Typography variant="body" className="text-gray-600">
            No snapshot data available yet. Save some snapshots to see your progress over time.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Calculate Y-axis range with padding
  const minValue = Math.min(...data.map(item => item.total));
  const maxValue = Math.max(...data.map(item => item.total));
  const padding = 50000; // 50k padding
  const yAxisMin = Math.max(0, minValue - padding);
  const yAxisMax = maxValue + padding;

  // Format dates for better display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(
      parseInt(item.date.substring(0, 4)),
      parseInt(item.date.substring(4, 6)) - 1,
      parseInt(item.date.substring(6, 8)),
      parseInt(item.date.substring(8, 10)),
      parseInt(item.date.substring(10, 12))
    ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <Card className="p-6">
      <CardContent>
        <Typography variant="h3" className="mb-4">Networth Over Time</Typography>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[yAxisMin, yAxisMax]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Networth']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworthOverTime;
