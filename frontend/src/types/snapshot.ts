export interface AssetSnapshot {
  symbol: string;
  type: string;
  institution: string;
  currency: string;
  quantity: number;
  usdValue: number;
}

export interface SnapshotData {
  date: string;
  timestamp: any; // Firestore timestamp
  assets: AssetSnapshot[];
}

export const SNAPSHOTS_COLLECTION = 'assetSnapshots';
