import { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { getExchangedAmount } from '../api/prices';

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface NetworthData {
  totalNetworth: number;
  typeData: ChartDataPoint[];
  institutionData: ChartDataPoint[];
  currencyData: ChartDataPoint[];
  isLoading: boolean;
}

const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', 
  '#00ff00', '#0088ff', '#ff0088', '#8800ff', '#ff8800'
];

export function useNetworthData(displayAssets: Asset[]): NetworthData {
  const [networthData, setNetworthData] = useState<NetworthData>({
    totalNetworth: 0,
    typeData: [],
    institutionData: [],
    currencyData: [],
    isLoading: false
  });

  useEffect(() => {
    let isMounted = true;

    async function calculateNetworth() {
      // Set loading to true when starting calculations
      if (isMounted) {
        setNetworthData(prev => ({ ...prev, isLoading: true }));
      }

      const typeMap = new Map<string, number>();
      const institutionMap = new Map<string, number>();
      const currencyMap = new Map<string, number>();
      
      let totalNetworth = 0;

      // Process each asset
      for (const asset of displayAssets) {
        const amountStr = asset.amount.replace(/[^0-9.-]/g, '');
        const amount = parseFloat(amountStr) || 0;        
        if (amount <= 0) continue;
        let usdAmount = amount;
        if (asset.currency !== 'USD') {
          try {
            const converted = await getExchangedAmount(asset.currency, 'USD', amount);
            usdAmount = converted || 0; 
          } catch (error) {
            console.warn(`Failed to convert ${asset.currency} to USD for asset ${asset.id}:`, error);
            usdAmount = 0; 
          }
        }

        // Update total networth
        totalNetworth += usdAmount;

        // Update type data
        const type = asset.type;
        typeMap.set(type, (typeMap.get(type) || 0) + usdAmount);

        // Update institution data
        const institution = asset.institution;
        institutionMap.set(institution, (institutionMap.get(institution) || 0) + usdAmount);

        // Update currency data (original currency, not converted)
        currencyMap.set(asset.currency, (currencyMap.get(asset.currency) || 0) + usdAmount);
      }

      // Convert maps to chart data arrays
      const typeData: ChartDataPoint[] = Array.from(typeMap.entries()).map(([name, value], index) => ({
        name,
        value: Math.round(value * 100) / 100,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));

      const institutionData: ChartDataPoint[] = Array.from(institutionMap.entries()).map(([name, value], index) => ({
        name,
        value: Math.round(value * 100) / 100,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));

      const currencyData: ChartDataPoint[] = Array.from(currencyMap.entries()).map(([name, value], index) => ({
        name,
        value: Math.round(value * 100) / 100,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));

      if (isMounted) {
        setNetworthData({
          totalNetworth: Math.round(totalNetworth * 100) / 100,
          typeData,
          institutionData,
          currencyData,
          isLoading: false
        });
      }
    }

    calculateNetworth();

    return () => {
      isMounted = false;
    };
  }, [displayAssets]);

  return networthData;
} 