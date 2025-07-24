import React, { useState } from 'react';
import { Asset, ASSET_TYPES, AssetType } from '../types/asset';
import { Card, CardContent, Typography, Button } from '../components/ui';

interface AssetFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (asset: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  formLoading?: boolean;
  initialData?: Partial<Asset>;
}

const AssetForm: React.FC<AssetFormProps> = ({ open, onClose, onSubmit, formLoading = false, initialData = {} }) => {
  const [institution, setInstitution] = useState(initialData.institution || '');
  const [type, setType] = useState<AssetType | string>(initialData.type || AssetType.Stock);
  const [symbol, setSymbol] = useState(initialData.symbol || '');
  const [quantity, setQuantity] = useState(initialData.quantity || '');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!institution) return setError('Institution is required');
    if (!type) return setError('Type is required');
    if (!symbol) return setError('Symbol is required');
    if (!quantity || isNaN(Number(quantity))) return setError('Quantity is required and must be a number');

    onSubmit({
      institution,
      type,
      symbol,
      quantity: Number(quantity),
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
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
            disabled={formLoading}
          >
            &times;
          </button>
          <Typography variant="h2" className="mb-4">
            Add Asset
          </Typography>
          <form className="space-y-3 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
            {error && <Typography variant="body" className="text-red-500 text-center">{error}</Typography>}
            <div>
              <label className="block mb-1 font-medium">Institution</label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                required
              />
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
              <label className="block mb-1 font-medium">Symbol</label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
                min="0"
                step="any"
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