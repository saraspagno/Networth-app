import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Asset } from '../types/asset';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiEdit, FiTrash } from 'react-icons/fi';

interface AssetGridProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

const AssetGrid: React.FC<AssetGridProps> = ({ assets, onEdit, onDelete }) => {
  const columnDefs: ColDef<Asset>[] = [
    { headerName: 'Institution', field: 'institution', sortable: true, filter: true, flex: 1 },
    { headerName: 'Type', field: 'type', sortable: true, filter: true, flex: 1 },
    { headerName: 'Symbol', field: 'symbol', sortable: true, filter: true, flex: 1 },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, flex: 1 },
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
        <div className="inline-flex gap-4">
          <button onClick={() => onEdit(params.data)}><FiEdit /></button>
          <button onClick={() => onDelete(params.data.id)}><FiTrash /></button>
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
