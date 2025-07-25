import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../types/firebase';
import { Asset } from '../types/asset';
import AssetForm from '../components/AssetForm';
import LoadingSpinner from '../components/LoadingSpinner';
import AssetGrid from '../components/AssetGrid';
import { useDisplayAssets } from '../contexts/DisplayAssetsContext';
import { useAssets } from '../hooks/useAssets';
import { Card, CardContent, Typography, Button } from '../components/ui';

const Manage: React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  const { deleteAsset: originalDeleteAsset, addAsset: originalAddAsset, editAsset: originalEditAsset } = useAssets(user);
  const { displayAssets, isLoading, refreshAssets } = useDisplayAssets();
  
  // Extract unique institutions from existing assets - to be used for the AssetForm
  const existingInstitutions = React.useMemo(() => {
    const institutions = displayAssets.map(asset => asset.institution).filter(Boolean);
    return [...new Set(institutions)] as string[];
  }, [displayAssets]);
  
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this asset?');
    if (!confirmed) return;
    await originalDeleteAsset(id);
    setSelectedAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const handleDeleteSelected = async () => {
    if (selectedAssets.length === 0) return;
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedAssets.length} asset${selectedAssets.length > 1 ? 's' : ''}?`);
    if (!confirmed) return;
    
    const selectedIds = selectedAssets.map(asset => asset.id).filter((id): id is string => id !== undefined);
    await Promise.all(selectedIds.map(id => originalDeleteAsset(id)));
    setSelectedAssets([]);
    setClearSelection(true);
    // Reset clearSelection after a short delay
    setTimeout(() => setClearSelection(false), 100);
  };
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formInitialData, setFormInitialData] = useState<Asset | undefined>(undefined);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [clearSelection, setClearSelection] = useState(false);

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
      const wasUpdated = await originalEditAsset(formInitialData.id, assetData);
      setFormInitialData(undefined);
      if (wasUpdated) {
        refreshAssets();
      }
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
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="primary"
                onClick={() => {
                  setFormInitialData(undefined);
                  setShowForm(true);
                }}
              >
                Add Asset
              </Button>
              {selectedAssets.length > 0 && (
                <Button
                  variant="danger"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected ({selectedAssets.length})
                </Button>
              )}
            </div>
            {isLoading ? (
              <LoadingSpinner className="my-8" />
            ) : displayAssets.length === 0 ? (
              <Typography variant="body">No assets found.</Typography>
            ) : (
              <AssetGrid 
                assets={displayAssets} 
                onEdit={asset => { setFormInitialData(asset); setShowForm(true); }} 
                onDelete={handleDelete}
                onSelectionChange={setSelectedAssets}
                clearSelection={clearSelection}
              />
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
        existingInstitutions={existingInstitutions}
      />
    </div>
  );
};

export default Manage; 