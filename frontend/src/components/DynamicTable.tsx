'use client';

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

type RowData = Record<string, any>;

type Props = {
  data: RowData[];
  filterColumns?: string[];
};

function generateColumns(data: RowData[]): ColumnDef<RowData>[] {
  if (!data.length) return [];

  const sample = data[0];
  const keys = Object.keys(sample).filter(k => k !== 'sub_items');

  const columns: ColumnDef<RowData>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="text-xl transition-transform duration-300 hover:scale-125"
          >
            {row.getIsExpanded() ? '➖' : '➕'}
          </button>
        ) : null,
    },
    ...keys.map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      cell: info => info.getValue() ?? '—',
    })),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => alert(`Edit row with id: ${row.id}`)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
            aria-label="Edit row"
          >
            ✏️
          </button>
          <button
            onClick={() => alert(`Delete row with id: ${row.id}`)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
            aria-label="Delete row"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return columns;
}


export default function DynamicTable({ data, filterColumns = [] }: Props) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pageSize, setPageSize] = React.useState(10);
  const [goPage, setGoPage] = React.useState('');
  const [filterSidebarOpen, setFilterSidebarOpen] = React.useState(true);
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({});

  const columns = React.useMemo(() => generateColumns(data), [data]);

  const filteredData = React.useMemo(() => {
    let filtered = data;

    if (globalFilter) {
      const lower = globalFilter.toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(lower)
        )
      );
    }

    if (filterColumns.length) {
      filtered = filtered.filter(row =>
        filterColumns.every(column =>
          columnFilters[column]
            ? String(row[column] ?? '').toLowerCase().includes(columnFilters[column].toLowerCase())
            : true
        )
      );
    }

    return filtered;
  }, [data, globalFilter, filterColumns, columnFilters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getSubRows: row => row.sub_items || [],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
  });

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const handleGoToPage = () => {
    const page = Number(goPage);
    if (!isNaN(page) && page >= 1 && page <= table.getPageCount()) {
      table.setPageIndex(page - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden bg-white rounded-lg shadow-md">
      {/* Sidebar */}
      <aside
  className={`w-full lg:w-64 transition-all duration-300 ease-in-out bg-gray-50 border-r z-10 p-4 ${
    filterSidebarOpen ? '' : 'hidden'
  }`}
>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <button
            onClick={() => setFilterSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {filterColumns.length > 0 ? (
          <div className="space-y-4">
            {filterColumns.map((col) => (
              <div key={col}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </label>
                <input
                  type="text"
                  value={columnFilters[col] || ''}
                  onChange={(e) =>
                    setColumnFilters((prev) => ({ ...prev, [col]: e.target.value }))
                  }
                  className="border px-3 py-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Filter ${col}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No filter columns provided.</p>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={() => setFilterSidebarOpen((prev) => !prev)}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            {filterSidebarOpen ? 'Hide Filters ◀' : 'Show Filters ▶'}
          </button>
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border px-4 py-2 rounded shadow-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-auto border rounded-md shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-800">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 border-b font-medium whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-blue-50 transition duration-200">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ paddingLeft: `${row.depth * 1.5}rem` }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            Show
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border px-2 py-1 rounded focus:outline-none"
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            entries
          </div>

          <div className="flex items-center gap-2">
            Go to page:
            <input
              type="number"
              min={1}
              max={table.getPageCount()}
              value={goPage}
              onChange={(e) => setGoPage(e.target.value)}
              className="w-16 border px-2 py-1 rounded"
            />
            <button
              onClick={handleGoToPage}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
              <strong>{table.getPageCount()}</strong>
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
