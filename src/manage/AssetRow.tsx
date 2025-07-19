import React from 'react';
import { Asset } from '../types/asset';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const AssetRow: React.FC<{
  asset: Asset;
  onDelete: (id: string) => void;
  onEdit: (asset: Asset) => void;
}> = ({ asset, onDelete, onEdit }) => (
  <tr className="text-left">
    <td className="px-4 py-2 border text-left">{asset.institution}</td>
    <td className="px-4 py-2 border text-left">{asset.type}</td>
    <td className="px-4 py-2 border text-left">{asset.symbol || '-'}</td>
    <td className="px-4 py-2 border text-left">{asset.symbol ? asset.quantity : asset.amount}</td>
    <td className="px-4 py-2 border text-left">{asset.symbol ? '-' : (asset.currency || '-')}</td>
    <td className="px-4 py-2 border text-left">
      <div className="flex gap-2 justify-center">
        <button
          className="text-blue-500 hover:text-blue-700"
          title="Edit"
          onClick={() => onEdit(asset)}
        >
          <FiEdit2 className="w-5 h-5" />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          title="Delete"
          onClick={() => asset.id && onDelete(asset.id!)}
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </td>
  </tr>
);

export default AssetRow; 