import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography } from '../ui';

interface NetworthByInstitutionProps {
  isPieChart: boolean;
  data: Array<{ name: string; value: number; color: string }>;
}

const NetworthByInstitution: React.FC<NetworthByInstitutionProps> = ({ isPieChart, data }) => {
  if (isPieChart) {
    return (
      <Card className="p-6">
        <CardContent>
          <Typography variant="h3" className="mb-4">
            Networth by Institution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
                fontSize={10}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Value']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardContent>
        <Typography variant="h3" className="mb-4">
          Networth by Institution
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Value']} />
            <Legend fontSize={10} />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NetworthByInstitution; 