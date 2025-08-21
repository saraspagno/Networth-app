import { addDoc, collection, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../types/firebase';
import { USERS_COLLECTION } from '../types/user';
import { AssetSnapshot, SNAPSHOTS_COLLECTION, SnapshotData } from '../types/snapshot';

export async function saveAssetSnapshot(userId: string, assets: AssetSnapshot[]) {
  const now = new Date();
  const dateKey = now.getFullYear().toString() + 
                  (now.getMonth() + 1).toString().padStart(2, '0') + 
                  now.getDate().toString().padStart(2, '0') + 
                  now.getHours().toString().padStart(2, '0') + 
                  now.getMinutes().toString().padStart(2, '0');
  
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

export async function getSnapshots(userId: string): Promise<SnapshotData[]> {
  const snapshotsRef = collection(db, USERS_COLLECTION, userId, SNAPSHOTS_COLLECTION);
  const q = query(snapshotsRef, orderBy('date', 'asc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as unknown as SnapshotData[];
}

// Utility function to get total networth over time
export function getTotalNetworthOverTime(snapshots: SnapshotData[]): Array<{date: string, total: number}> {
  return snapshots.map(snapshot => {
    const total = snapshot.assets.reduce((sum, asset) => sum + asset.usdValue, 0);
    return {
      date: snapshot.date,
      total: Math.round(total * 100) / 100
    };
  });
}

// Utility function to get networth by type over time (for future use)
export function getNetworthByTypeOverTime(snapshots: SnapshotData[]): Array<{date: string, typeData: Record<string, number>}> {
  return snapshots.map(snapshot => {
    const typeData: Record<string, number> = {};
    snapshot.assets.forEach(asset => {
      typeData[asset.type] = (typeData[asset.type] || 0) + asset.usdValue;
    });
    return { date: snapshot.date, typeData };
  });
}
