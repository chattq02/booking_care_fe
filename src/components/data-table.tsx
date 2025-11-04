import { useWindowSize } from "@/hooks/use-window-size";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  pagination?: TablePaginationConfig;
  rowSelection?: any;
  onChange?: (pagination: TablePaginationConfig) => void;
  rowKey: string | ((record: T) => string | number);
}

export function DataGrid<T>({
  data,
  columns,
  loading,
  pagination,
  rowSelection,
  onChange,
  rowKey,
}: GenericTableProps<T>) {
  const { height: tableHeight } = useWindowSize();
  return (
    <Table<T>
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      loading={loading}
      rowSelection={rowSelection}
      pagination={pagination}
      scroll={{ y: tableHeight - 245, x: 500 }}
      bordered
      virtual
      onChange={onChange}
      style={{ maxHeight: tableHeight - 245 }}
    />
  );
}
