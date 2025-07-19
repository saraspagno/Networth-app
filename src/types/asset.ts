export const ASSETS_COLLECTION = 'assets';

export enum AssetType {
  Stocks = 'Stocks',
  Bonds = 'Bonds',
  Crypto = 'Crypto',
  Cash = 'Cash',
  BankDeposit = 'Deposit',
  Pension = 'Pension',
}

export const ASSET_TYPES = [
  AssetType.Stocks,
  AssetType.Bonds,
  AssetType.Crypto,
  AssetType.Cash,
  AssetType.BankDeposit,
  AssetType.Pension,
];

export type Asset = {
  id?: string; // Firestore document ID
  userId: string; // Owner of the asset
  institution: string; // e.g. JPMorgan, Stanley, etc.
  type: AssetType | string;
  symbol?: string; // Only for stocks, crypto, bonds
  quantity?: number; // Only for stocks, crypto, bonds
  amount?: number; // For cash, bank deposit, pension, etc.
  currency?: string; // Only for relevant types, e.g. USD, EUR, etc.
  createdAt?: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
}; 