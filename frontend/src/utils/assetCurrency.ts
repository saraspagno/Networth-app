import { AssetType } from '../types/asset';
import { getStockCurrency } from '../api/prices';

// Synchronous currency inference for non-stock types
export function inferAssetCurrency(type: string, symbol?: string): string {
  if (type === AssetType.Crypto) return 'USD';
  if ([AssetType.Cash, AssetType.BankDeposit, AssetType.Pension, AssetType.Bond].includes(type as AssetType)) return symbol || '';
  return '';
}

// Async currency inference for all types (uses API for stocks)
export async function getAssetCurrency(type: string, symbol?: string): Promise<string> {
  if (type === AssetType.Stock && symbol) {
    const stockCurrency = await getStockCurrency(symbol);
    if (stockCurrency) return stockCurrency;
    return '';
  }
  return inferAssetCurrency(type, symbol);
} 