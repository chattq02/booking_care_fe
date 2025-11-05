import { useWindowSize } from "@/hooks/use-window-size";
import { Table } from "antd";
import type { TableProps } from "antd";

interface GenericTableProps<T> extends TableProps<T> {
  data: T[];
  customHeight?: number;
}

export function DataGrid<T>({
  data,
  customHeight = 245,
  ...rest
}: GenericTableProps<T>) {
  const { height: tableHeight } = useWindowSize();

  return (
    <Table<T>
      dataSource={data}
      scroll={{ y: tableHeight - customHeight, x: 500 }}
      bordered
      style={{ maxHeight: tableHeight - customHeight }}
      {...rest}
    />
  );
}
