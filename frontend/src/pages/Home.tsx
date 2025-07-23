import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChartToggle, NetworthByType, NetworthByInstitution, NetworthByCurrency } from '../components/charts';
import { useAssets } from '../hooks/useAssets';
import { useDisplayAssets } from '../hooks/useDisplayAssets';
import { useNetworthData } from '../hooks/useNetworthData';
import { auth } from '../types/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Home: React.FunctionComponent = () => {
  const [isPieChart, setIsPieChart] = useState(true);
  const [user] = useAuthState(auth);
  const { assets, loading } = useAssets(user);
  const displayAssets = useDisplayAssets(assets);
  const { totalNetworth, typeData, institutionData, currencyData } = useNetworthData(displayAssets);

  if (loading) {
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

  if (!assets || assets.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome to Networth Tracker
              </h1>
              <p className="text-gray-600">Add your first asset to start tracking your networth</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-600 mb-4">No assets found</div>
              <a 
                href="/manage" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Your First Asset
              </a>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Networth is ${totalNetworth.toLocaleString()}
            </h1>
            <p className="text-gray-600">Track your financial growth over time</p>
          </div>
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