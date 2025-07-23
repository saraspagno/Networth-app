import { useEffect, useState } from 'react';
import { Asset, AssetType, getCurrencySymbol } from '../types/asset';
import { getStockAmount, getCryptoAmount } from '../api/prices';

export function useDisplayAssets(assets: Asset[]) {
  const [displayAssets, setDisplayAssets] = useState<Asset[]>([]);

  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;

    async function updateAmounts() {
      const updated = await Promise.all(assets.map(async asset => {
        let amountStr: string = '';
        let amountNum: number | undefined = undefined;
        if (asset.type === AssetType.Stock || asset.type === AssetType.Bonds) {
          if (asset.symbol && asset.quantity != null) {
            amountNum = await getStockAmount(asset.symbol, asset.quantity) || undefined;
          }
        } else if (asset.type === AssetType.Crypto) {
          if (asset.symbol && asset.quantity != null) {
            amountNum = await getCryptoAmount(asset.symbol, asset.quantity) || undefined;
          }
        } else if (
          asset.type === AssetType.Cash ||
          asset.type === AssetType.BankDeposit ||
          asset.type === AssetType.Pension
        ) {
          amountNum = asset.quantity;
        }
        if (typeof amountNum === 'number') {
          amountNum = Math.round(amountNum * 100) / 100;
          amountStr = getCurrencySymbol(asset.currency) + amountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
          // Provide a default string when amount is not available
          amountStr = getCurrencySymbol(asset.currency) + '0.00';
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

  return displayAssets;
} 