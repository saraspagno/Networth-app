import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../types/firebase';
import { Asset } from '../types/asset';
import AssetForm from '../manage/AssetForm';
import LoadingSpinner from '../components/LoadingSpinner';
import AssetGrid from '../components/AssetGrid';
import { useAssets } from '../hooks/useAssets';
import { useDisplayAssets } from '../hooks/useDisplayAssets';
import { addAsset, editAsset } from '../manage/assetController';

const Manage: React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  const { assets, loading, handleDelete } = useAssets(user);
  const displayAssets = useDisplayAssets(assets);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formInitialData, setFormInitialData] = useState<Asset | undefined>(undefined);

  const handleAddAsset = async (assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    setShowForm(false);
    setFormLoading(true);
    try {
      await addAsset(user, assetData);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAsset = async (assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !formInitialData || !formInitialData.id) return;
    setShowForm(false);
    setFormLoading(true);
    try {
      await editAsset(user, formInitialData.id, assetData);
      setFormInitialData(undefined);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-start p-8">
        <h1 className="text-4xl font-bold mb-8">Manage Assets</h1>
        <div className="w-full bg-white rounded shadow p-10 px-8">
          <div className="flex justify-start mb-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
              onClick={() => {
                setFormInitialData(undefined);
                setShowForm(true);
              }}
            >
              Add Asset
            </button>
          </div>
          {loading ? (
            <LoadingSpinner className="my-8" />
          ) : assets.length === 0 ? (
            <div>No assets found.</div>
          ) : (
            <AssetGrid assets={displayAssets} onEdit={asset => { setFormInitialData(asset); setShowForm(true); }} onDelete={handleDelete} />
          )}
        </div>
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