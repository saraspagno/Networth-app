import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Asset, AssetType, getCurrencySymbol } from '../types/asset';
import { getStockAmount, getCryptoAmount } from '../api/prices';
import { saveAssetSnapshot } from '../controllers/snapshotController';
import { AssetSnapshot } from '../types/snapshot';

interface DisplayAssetsContextType {
  displayAssets: Asset[];
  isLoading: boolean;
  refreshAssets: () => void;
  saveSnapshot: (userId: string) => Promise<void>;
}

const DisplayAssetsContext = createContext<DisplayAssetsContextType | undefined>(undefined);

export const useDisplayAssets = () => {
  const context = useContext(DisplayAssetsContext);
  if (!context) {
    throw new Error('useDisplayAssets must be used within a DisplayAssetsProvider');
  }
  return context;
};

interface DisplayAssetsProviderProps {
  children: React.ReactNode;
  assets: Asset[];
}

export const DisplayAssetsProvider: React.FC<DisplayAssetsProviderProps> = ({ children, assets }) => {
  const [displayAssets, setDisplayAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateAmounts = useCallback(async () => {
    if (assets.length === 0) {
      setDisplayAssets([]);
      return;
    }

    setIsLoading(true);
    try {
      const updated = await Promise.all(assets.map(async asset => {
        let amountStr: string = '';
        let amountNum: number | undefined = undefined;
        
        if (asset.type === AssetType.Stock) {
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
          asset.type === AssetType.Pension ||
          asset.type === AssetType.Bond
        ) {
          amountNum = asset.quantity;
        }
        
        if (typeof amountNum === 'number') {
          amountNum = Math.round(amountNum * 100) / 100;
          amountStr = getCurrencySymbol(asset.currency) + amountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
          amountStr = getCurrencySymbol(asset.currency) + '0.00';
        }
        
        return { ...asset, amount: amountStr };
      }));
      
      // Sort assets by institution for consistent ordering
      const sorted = updated.sort((a, b) => {
        const institutionA = a.institution?.toLowerCase() || '';
        const institutionB = b.institution?.toLowerCase() || '';
        return institutionA.localeCompare(institutionB);
      });
      
      setDisplayAssets(sorted);
    } catch (error) {
      console.error('Error updating asset amounts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [assets]);

  const refreshAssets = () => {
    updateAmounts();
  };

  const saveSnapshot = useCallback(async (userId: string) => {
    if (displayAssets.length === 0) return;
    
    const snapshotData: AssetSnapshot[] = displayAssets.map(asset => {
      // Extract USD value from the amount string (remove currency symbol and parse)
      const amountStr = asset.amount.replace(/[^0-9.-]/g, '');
      const usdValue = parseFloat(amountStr) || 0;
      
      return {
        symbol: asset.symbol || '',
        type: asset.type,
        institution: asset.institution || '',
        currency: asset.currency,
        quantity: asset.quantity || 0,
        usdValue: usdValue
      };
    });
    
    await saveAssetSnapshot(userId, snapshotData);
  }, []); // Remove displayAssets dependency

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    updateAmounts();
    
    // Set up interval for auto-refresh every 60 seconds
    interval = setInterval(updateAmounts, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, [updateAmounts]);

  return (
    <DisplayAssetsContext.Provider value={{ displayAssets, isLoading, refreshAssets, saveSnapshot }}>
      {children}
    </DisplayAssetsContext.Provider>
  );
}; 