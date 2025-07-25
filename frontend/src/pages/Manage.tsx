import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../types/firebase';
import { Asset } from '../types/asset';
import AssetForm from '../manage/AssetForm';
import LoadingSpinner from '../components/LoadingSpinner';
import AssetGrid from '../components/AssetGrid';
import { useDisplayAssets } from '../contexts/DisplayAssetsContext';
import { useAssets } from '../hooks/useAssets';
import { Card, CardContent, Typography, Button } from '../components/ui';

const Manage: React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  const { deleteAsset: originalDeleteAsset, addAsset: originalAddAsset, editAsset: originalEditAsset } = useAssets(user);
  const { displayAssets, isLoading, refreshAssets } = useDisplayAssets();
  
  const handleDelete = async (id: string) => {
    await originalDeleteAsset(id);
    refreshAssets(); // Refresh display assets after deleting
  };
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formInitialData, setFormInitialData] = useState<Asset | undefined>(undefined);

  const handleAddAsset = async (assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    setShowForm(false);
    setFormLoading(true);
    try {
      await originalAddAsset(assetData);
      refreshAssets(); // Refresh display assets after adding
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAsset = async (assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !formInitialData || !formInitialData.id) return;
    setShowForm(false);
    setFormLoading(true);
    try {
      await originalEditAsset(formInitialData.id, assetData);
      setFormInitialData(undefined);
      refreshAssets(); // Refresh display assets after editing
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-start p-8">
        <Typography variant="h1" className="mb-8">
          Manage Assets
        </Typography>
        <Card className="w-full p-6">
          <CardContent>
            <div className="flex justify-start mb-4">
              <Button
                variant="primary"
                onClick={() => {
                  setFormInitialData(undefined);
                  setShowForm(true);
                }}
              >
                Add Asset
              </Button>
            </div>
            {isLoading ? (
              <LoadingSpinner className="my-8" />
            ) : displayAssets.length === 0 ? (
              <Typography variant="body">No assets found.</Typography>
            ) : (
              <AssetGrid assets={displayAssets} onEdit={asset => { setFormInitialData(asset); setShowForm(true); }} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
        {/* Show spinner over content when form is saving and modal is closed */}
        {formLoading && !showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <LoadingSpinner className="" />
          </div>
        )}
      </div>
      <AssetForm
        key={showForm ? (formInitialData?.id || 'add') : 'closed'}
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={formInitialData ? handleEditAsset : handleAddAsset}
        formLoading={formLoading}
        initialData={formInitialData}
      />
    </div>
  );
};

export default Manage; 