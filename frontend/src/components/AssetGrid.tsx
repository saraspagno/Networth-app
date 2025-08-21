import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Asset, AssetType } from '../types/asset';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { Button } from './ui';

interface AssetGridProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onSelectionChange?: (selectedRows: Asset[]) => void;
  clearSelection?: boolean;
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

const AssetGrid: React.FC<AssetGridProps> = ({ assets, onEdit, onDelete, onSelectionChange, clearSelection }) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRows] = useState<Asset[]>([]);

  const columnDefs: ColDef<Asset>[] = [
    { 
      headerName: 'Institution', 
      field: 'institution', 
      sortable: true, 
      filter: true, 
      flex: 1,
      sort: 'asc' // Default sort by institution ascending
    },
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
      width: 80,
      cellClass: 'ag-center-cell',
      headerClass: 'ag-center-header',
    },
    {
      headerName: '',
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 35,
      sortable: false,
      filter: false,
      headerClass: 'ag-center-header',
      cellClass: 'ag-center-cell'
    },
  ];

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const onSelectionChanged = () => {
    if (gridApi) {
      const selectedNodes = gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      setSelectedRows(selectedData);
      onSelectionChange?.(selectedData);
    }
  };

  // Clear selection when clearSelection prop changes
  React.useEffect(() => {
    if (clearSelection && gridApi) {
      gridApi.deselectAll();
      setSelectedRows([]);
    }
  }, [clearSelection, gridApi]);

  return (
    <div className="ag-theme-alpine w-full" style={{ minHeight: 400 }}>
      <style>
        {`
          .ag-center-cell {
            text-align: center !important;
            justify-content: center !important;
            padding:  0px !important;
          }
          .ag-center-header {
            text-align: center !important;
            justify-content: center !important;
            padding:  0px !important;
          }
          
          /* Remove border highlighting for checkbox column */
          .ag-cell[col-id="checkbox"]:focus,
          .ag-cell[col-id="checkbox"].ag-cell-focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
          
          /* Remove border highlighting for checkbox header */
          .ag-header-cell[col-id="checkbox"]:focus,
          .ag-header-cell[col-id="checkbox"].ag-header-cell-focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
        `}
      </style>
      <AgGridReact
        rowData={assets}
        columnDefs={columnDefs}
        domLayout="autoHeight"
        suppressRowClickSelection
        rowSelection="multiple"
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
};

export default AssetGrid;
