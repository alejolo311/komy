import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps {
  columns: any[];
  data: any[];
  className?: string;
}

export function DataTable({ columns, data, className }: DataTableProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800/50">
      <Table className={className}>
        <TableHeader>
          <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.id || column.accessorKey}
                className="h-12 px-4 text-gray-700 dark:text-gray-300 text-left align-middle font-medium"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-gray-500 dark:text-gray-400"
              >
                No hay datos disponibles
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow
                key={i}
                className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id || column.accessorKey}
                    className="p-4 align-middle text-gray-900 dark:text-gray-200"
                  >
                    {column.cell
                      ? column.cell({ row: { original: row } })
                      : row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}