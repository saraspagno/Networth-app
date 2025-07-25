import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../types/firebase';
import { USERS_COLLECTION } from '../types/user';
import { ASSETS_COLLECTION, Asset } from '../types/asset';
import { addAsset as addAssetController, editAsset as editAssetController } from '../controllers/assetController';

// Helper function to check if asset data has changed
const hasAssetChanged = (original: Asset, updated: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): boolean => {
  // Compare quantities as numbers to handle type differences
  const originalQuantity = typeof original.quantity === 'number' ? original.quantity : Number(original.quantity);
  const updatedQuantity = typeof updated.quantity === 'number' ? updated.quantity : Number(updated.quantity);
  
  return (
    original.institution !== updated.institution ||
    original.type !== updated.type ||
    original.symbol !== updated.symbol ||
    originalQuantity !== updatedQuantity
  );
};

export function useAssets(user: { uid: string } | null | undefined) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching assets:', error);
        setAssets([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const deleteAsset = useCallback(async (id: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    await deleteDoc(doc(db, USERS_COLLECTION, user.uid, ASSETS_COLLECTION, id));
  }, [user]);

  const addAsset = useCallback(async (assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    await addAssetController(user, assetData);
  }, [user]);

  const editAsset = useCallback(async (assetId: string, assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return false;
    
    // Find the original asset to compare
    const originalAsset = assets.find(asset => asset.id === assetId);
    if (!originalAsset) {
      console.error('Original asset not found for comparison');
      await editAssetController(user, assetId, assetData);
      return true;
    }
    
    // Check if the asset has actually changed
    if (!hasAssetChanged(originalAsset, assetData)) {
       return false; // Return false to indicate no update was performed
    }
    
    await editAssetController(user, assetId, assetData);
    return true; // Return true to indicate update was performed
  }, [user, assets]);

  return { assets, loading, deleteAsset, addAsset, editAsset };
} 