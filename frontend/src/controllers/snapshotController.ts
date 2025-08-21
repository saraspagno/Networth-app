import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../types/firebase';
import { USERS_COLLECTION } from '../types/user';
import { AssetSnapshot, SNAPSHOTS_COLLECTION } from '../types/snapshot';

export async function saveAssetSnapshot(userId: string, assets: AssetSnapshot[]) {
  const today = new Date();
  const dateKey = today.getFullYear().toString() + 
                  (today.getMonth() + 1).toString().padStart(2, '0') + 
                  today.getDate().toString().padStart(2, '0');
  
  const snapshotData = {
    date: dateKey,
    timestamp: serverTimestamp(),
    assets: assets
  };

  await addDoc(
    collection(db, USERS_COLLECTION, userId, SNAPSHOTS_COLLECTION), 
    snapshotData
  );
}
