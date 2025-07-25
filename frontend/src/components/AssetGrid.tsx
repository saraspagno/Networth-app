import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Asset, AssetType } from '../types/asset';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { Button } from './ui';

interface AssetGridProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

// Color mapping for different asset types
const getTypeTagStyle = (type: string) => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    [AssetType.Stock]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    [AssetType.Bond]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    [AssetType.Crypto]: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    [AssetType.Cash]: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    [AssetType.BankDeposit]: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    [AssetType.Pension]: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  };

  return colorMap[type] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
};

// Custom cell renderer for Type column
const TypeTagRenderer = (params: any) => {
  const type = params.value;
  const style = getTypeTagStyle(type);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      {type}
    </span>
  );
};

// Custom cell renderer for Quantity column
const QuantityRenderer = (params: any) => {
  const quantity = params.value;
  
  if (quantity === null || quantity === undefined || quantity === '') {
    return '-';
  }
  
  // Format number with thousands separators and appropriate decimal places
  const num = parseFloat(quantity);
  if (isNaN(num)) {
    return quantity;
  }
  
  // For whole numbers, show as integers. For decimals, show up to 4 decimal places
  const formatted = Number.isInteger(num) 
    ? num.toLocaleString()
    : num.toLocaleString(undefined, { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 4 
      });
  
  return formatted;
};

const AssetGrid: React.FC<AssetGridProps> = ({ assets, onEdit, onDelete }) => {
  const columnDefs: ColDef<Asset>[] = [
    { headerName: 'Institution', field: 'institution', sortable: true, filter: true, flex: 1 },
    { 
      headerName: 'Type', 
      field: 'type', 
      sortable: true, 
      filter: true, 
      flex: 1,
      cellRenderer: TypeTagRenderer
    },
    { headerName: 'Symbol', field: 'symbol', sortable: true, filter: true, flex: 1 },
    { 
      headerName: 'Quantity', 
      field: 'quantity', 
      sortable: true, 
      filter: true, 
      flex: 1,
      cellRenderer: QuantityRenderer
    },
    { headerName: 'Currency', field: 'currency', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Amount',
      field: 'amount',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: '',
      cellRenderer: (params: any) => (
        <div className="inline-flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(params.data)}
            className="p-1"
          >
            <FiEdit />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(params.data.id)}
            className="p-1"
          >
            <FiTrash />
          </Button>
        </div>
      ),
      sortable: false,
      filter: false,
      width: 120,
    },
  ];

  return (
    <div className="ag-theme-alpine w-full" style={{ minHeight: 400 }}>
      <AgGridReact
        rowData={assets}
        columnDefs={columnDefs}
        domLayout="autoHeight"
        suppressRowClickSelection
      />
    </div>
  );
};

export default AssetGrid;
