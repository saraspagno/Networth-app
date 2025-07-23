import { addDoc, updateDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../types/firebase';
import { USERS_COLLECTION } from '../types/user';
import { ASSETS_COLLECTION, Asset } from '../types/asset';
import { getAssetCurrency } from '../utils/assetCurrency';

export async function addAsset(user: { uid: string }, assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const cleanedData = await prepareAssetWithCurrency(assetData);
  await addDoc(collection(db, USERS_COLLECTION, user.uid, ASSETS_COLLECTION), {
    ...cleanedData,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function editAsset(user: { uid: string }, assetId: string, assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const cleanedData = await prepareAssetWithCurrency(assetData);
  await updateDoc(
    doc(db, USERS_COLLECTION, user.uid, ASSETS_COLLECTION, assetId),
    {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    }
  );
}

async function prepareAssetWithCurrency(assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const currency = await getAssetCurrency(assetData.type, assetData.symbol);
  return Object.fromEntries(
    Object.entries({ ...assetData, currency }).filter(([_, v]) => v !== undefined)
  );
} 