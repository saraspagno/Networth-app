import React, { useState, useMemo } from 'react';
import { Asset, ASSET_TYPES, AssetType } from '../types/asset';
import { Card, CardContent, Typography, Button } from '../components/ui';

// Helper function to format number with thousands separators
const formatNumber = (value: string): string => {
  // Remove all non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Handle decimal points properly
  const parts = cleanValue.split('.');
  if (parts.length > 2) return value; // Don't allow multiple decimal points
  
  // Format the integer part with thousands separators
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Reconstruct with decimal part if it exists
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
};

// Helper function to parse formatted number back to numeric value
const parseFormattedNumber = (value: string): string => {
  return value.replace(/,/g, '');
};

interface AssetFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (asset: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  formLoading?: boolean;
  initialData?: Partial<Asset>;
  existingInstitutions?: string[];
}

const AssetForm: React.FC<AssetFormProps> = ({ open, onClose, onSubmit, formLoading = false, initialData = {}, existingInstitutions = [] }) => {
  const [institution, setInstitution] = useState(initialData.institution || '');
  const [type, setType] = useState<AssetType | string>(initialData.type || AssetType.Stock);
  const [symbol, setSymbol] = useState(initialData.symbol || '');
  const [quantity, setQuantity] = useState(initialData.quantity ? formatNumber(initialData.quantity.toString()) : '');

  const [error, setError] = useState('');
  const [showInstitutionSuggestions, setShowInstitutionSuggestions] = useState(false);
  
  // Filter institutions based on current input
  const filteredInstitutions = useMemo(() => {
    if (!institution.trim()) return existingInstitutions;
    return existingInstitutions.filter(inst => 
      inst.toLowerCase().includes(institution.toLowerCase())
    );
  }, [institution, existingInstitutions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!institution) return setError('Institution is required');
    if (!type) return setError('Type is required');
    if (!symbol) return setError('Symbol is required');
    
    const parsedQuantity = parseFormattedNumber(quantity);
    if (!parsedQuantity || isNaN(Number(parsedQuantity))) return setError('Quantity is required and must be a number');

    onSubmit({
      institution,
      type,
      symbol,
      quantity: Number(parsedQuantity),
      currency: '',
      amount: ''
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black bg-opacity-30 absolute inset-0" style={{ left: 0 }} onClick={onClose} />
      <Card className="w-full max-w-lg relative z-10 flex flex-col items-center justify-center">
        <CardContent className="p-6 w-full">
          <button
            className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-5xl font-bold"
            onClick={onClose}
            disabled={formLoading}
          >
            &times;
          </button>
          <Typography variant="h2" className="mb-4">
            {initialData?.id ? 'Edit Asset' : 'Add Asset'}
          </Typography>
          <form className="space-y-3 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
            {error && <Typography variant="body" className="text-red-500 text-center">{error}</Typography>}
            <div className="relative">
              <label className="block mb-1 font-medium">Institution</label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={institution}
                onChange={e => {
                  setInstitution(e.target.value);
                  setShowInstitutionSuggestions(true);
                }}
                onFocus={() => setShowInstitutionSuggestions(true)}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking on them
                  setTimeout(() => setShowInstitutionSuggestions(false), 200);
                }}
                placeholder="e.g. JP Morgan"
                required
              />
              {showInstitutionSuggestions && filteredInstitutions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredInstitutions.map((inst, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => {
                        setInstitution(inst);
                        setShowInstitutionSuggestions(false);
                      }}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                {ASSET_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">
                {type === AssetType.Bond || type === AssetType.Cash || type === AssetType.BankDeposit || type === AssetType.Pension ? 'Currency' : 'Symbol'}
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                required
                placeholder={type === AssetType.Bond || type === AssetType.Cash || type === AssetType.BankDeposit || type === AssetType.Pension ? 'e.g. USD, EUR, GBP' : 'e.g. AAPL, MSFT'}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                {type === AssetType.Bond || type === AssetType.Cash || type === AssetType.BankDeposit || type === AssetType.Pension ? 'Amount' : 'Quantity'}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={quantity}
                onChange={e => setQuantity(formatNumber(e.target.value))}
                required
                placeholder={type === AssetType.Bond || type === AssetType.Cash || type === AssetType.BankDeposit || type === AssetType.Pension ? 'Enter the amount' : 'Enter the quantity'}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onClose} 
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={formLoading}
              >
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetForm; 