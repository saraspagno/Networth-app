import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { db } from '../types/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../types/firebase';
import { Asset, ASSETS_COLLECTION } from '../types/asset';
import { USERS_COLLECTION } from '../types/user';
import { collection, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import AssetForm from '../manage/AssetForm';
import LoadingSpinner from '../components/LoadingSpinner';
import AssetGrid from '../components/AssetGrid';
import { getAssetCurrency } from '../utils/assetCurrency';
import { AssetType, getCurrencySymbol } from '../types/asset';
import { getStockAmount, getCryptoAmount } from '../api/prices';

const Manage: React.FunctionComponent = () => {
  const [user] = useAuthState(auth);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formInitialData, setFormInitialData] = useState<Asset | undefined>(undefined);
  const [displayAssets, setDisplayAssets] = useState<Asset[]>([]);


  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const assetsRef = collection(db, USERS_COLLECTION, user.uid, ASSETS_COLLECTION);
    const unsubscribe = onSnapshot(
      assetsRef,
      (snapshot) => {
        const assetsData: Asset[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Asset, 'id'>),
        }));
        setAssets(assetsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching assets:", error);
        setAssets([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Poll and update displayAssets every 60s or when assets change
  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;

    async function updateAmounts() {
      const updated = await Promise.all(assets.map(async asset => {
        let amountStr: string | undefined = undefined;
        let amountNum: number | undefined = undefined;
        if (asset.type === AssetType.Stock || asset.type === AssetType.Bonds) {
          if (asset.symbol && asset.quantity != null) {
            amountNum = await getStockAmount(asset.symbol, asset.quantity) || undefined;
          }
        } 
        else if (asset.type === AssetType.Crypto) {
          if (asset.symbol && asset.quantity != null) {
            amountNum = await getCryptoAmount(asset.symbol, asset.quantity) || undefined;
          }
        } 
        else if (
          asset.type === AssetType.Cash ||
          asset.type === AssetType.BankDeposit ||
          asset.type === AssetType.Pension
        ) {
          amountNum = asset.quantity;
        }
        if (typeof amountNum === 'number') {
          amountNum = Math.round(amountNum * 100) / 100;
          amountStr = getCurrencySymbol(asset.currency) + amountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return { ...asset, amount: amountStr };
      }));
      if (isMounted) setDisplayAssets(updated);
    }

    updateAmounts();
    interval = setInterval(updateAmounts, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [assets]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    await deleteDoc(doc(db, USERS_COLLECTION, user.uid, ASSETS_COLLECTION, id));
  };

 
  async function prepareAssetWithCurrency(assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const currency = await getAssetCurrency(assetData.type, assetData.symbol);
    return Object.fromEntries(
      Object.entries({ ...assetData, currency }).filter(([_, v]) => v !== undefined)
    );
  }

  const handleAddAsset = async (assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    setShowForm(false);
    setFormLoading(true);
    try {
      const cleanedData = await prepareAssetWithCurrency(assetData);
      await addDoc(collection(db, USERS_COLLECTION, user.uid, ASSETS_COLLECTION), {
        ...cleanedData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAsset = async (assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !formInitialData || !formInitialData.id) return;
    setShowForm(false);
    setFormLoading(true);
    try {
      const cleanedData = await prepareAssetWithCurrency(assetData);
      await updateDoc(
        doc(db, USERS_COLLECTION, user.uid, ASSETS_COLLECTION, formInitialData.id),
        {
          ...cleanedData,
          updatedAt: serverTimestamp(),
        }
      );
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