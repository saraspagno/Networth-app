import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChartToggle, NetworthByType, NetworthByInstitution, NetworthByCurrency, NetworthOverTime } from '../components/charts';
import { useDisplayAssets } from '../contexts/DisplayAssetsContext';
import { useNetworthData } from '../hooks/useNetworthData';
import { Card, CardContent, Typography, Button } from '../components/ui';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../types/firebase';
import { getSnapshots, getTotalNetworthOverTime } from '../controllers/snapshotController';

const Home: React.FunctionComponent = () => {
  const [isPieChart, setIsPieChart] = useState(true);
  const [user] = useAuthState(auth);
  const statusRef = useRef<HTMLDivElement>(null);
  const [snapshotData, setSnapshotData] = useState<Array<{ date: string, total: number }>>([]);
  const { displayAssets, isLoading: displayAssetsLoading, saveSnapshot } = useDisplayAssets();
  const { totalNetworth, typeData, institutionData, currencyData, isLoading: networthLoading } = useNetworthData(displayAssets);

  const loadSnapshots = useCallback(async () => {
    if (!user) return;
    try {
      const snapshots = await getSnapshots(user.uid);
      const totalOverTime = getTotalNetworthOverTime(snapshots);
      console.log(totalOverTime);
      setSnapshotData(totalOverTime);
    } catch (error) {
      console.error('Error loading snapshots:', error);
    }
  }, [user]);

  // Load snapshots when component mounts
  useEffect(() => {
    if (user) {
      loadSnapshots();
    }
  }, [user, loadSnapshots]);

  const handleSaveSnapshot = async () => {
    if (!user) return;

    try {
      if (statusRef.current) {
        statusRef.current.textContent = '';
        statusRef.current.classList.remove('opacity-100');
        statusRef.current.classList.add('opacity-0');
      }

      await saveSnapshot(user.uid);

      if (statusRef.current) {
        statusRef.current.textContent = 'Snapshot saved successfully!';
        statusRef.current.classList.remove('opacity-0');
        statusRef.current.classList.add('opacity-100');
      }

      // Reload snapshots after saving
      await loadSnapshots();

      setTimeout(() => {
        if (statusRef.current) {
          statusRef.current.classList.remove('opacity-100');
          statusRef.current.classList.add('opacity-0');
        }
      }, 2000);
    } catch (error) {
      console.error('Error saving snapshot:', error);
    }
  };

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
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="h1" className="mb-2">
                    Your Networth is ${totalNetworth.toLocaleString()}
                  </Typography>
                  <Typography variant="body" className="text-gray-600">
                    Track your financial growth over time
                  </Typography>
                </div>
                <div className="w-32 flex flex-col items-end">
                  <Button
                    variant="primary"
                    onClick={handleSaveSnapshot}
                    disabled={!user || displayAssets.length === 0}
                  >
                    Save Snapshot
                  </Button>
                  <div
                    ref={statusRef}
                    className="mt-2 text-sm text-green-600 transition-opacity duration-1000 opacity-0"
                  />
                </div>
              </div>
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

        {/* Networth Over Time Chart */}
        <div className="mt-8">
          <NetworthOverTime data={snapshotData} />
        </div>
      </div>
    </div>
  );
};

export default Home; 