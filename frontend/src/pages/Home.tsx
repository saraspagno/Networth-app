import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChartToggle, NetworthByType, NetworthByInstitution, NetworthByCurrency } from '../components/charts';
import { useDisplayAssets } from '../contexts/DisplayAssetsContext';
import { useNetworthData } from '../hooks/useNetworthData';
import { Card, CardContent, Typography, Button } from '../components/ui';

const Home: React.FunctionComponent = () => {
  const [isPieChart, setIsPieChart] = useState(true);
  const { displayAssets, isLoading: displayAssetsLoading } = useDisplayAssets();
  const { totalNetworth, typeData, institutionData, currencyData, isLoading: networthLoading } = useNetworthData(displayAssets);

  if (displayAssetsLoading || networthLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!displayAssets || displayAssets.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <Card className="p-6">
              <CardContent>
                <Typography variant="h1" className="mb-2">
                  Welcome to Networth Tracker
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  Add your first asset to start tracking your networth
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Typography variant="body" className="text-gray-600 mb-4">
                No assets found
              </Typography>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/manage'}
              >
                Add Your First Asset
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Networth Display */}
        <div className="mb-8">
          <Card className="p-6">
            <CardContent>
              <Typography variant="h1" className="mb-2">
                Your Networth is ${totalNetworth.toLocaleString()}
              </Typography>
              <Typography variant="body" className="text-gray-600">
                Track your financial growth over time
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Chart Toggle */}
        <ChartToggle isPieChart={isPieChart} onToggle={setIsPieChart} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NetworthByType isPieChart={isPieChart} data={typeData} />
          <NetworthByInstitution isPieChart={isPieChart} data={institutionData} />
          <NetworthByCurrency isPieChart={isPieChart} data={currencyData} />
        </div>
      </div>
    </div>
  );
};

export default Home; 