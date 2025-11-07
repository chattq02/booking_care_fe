import { memo, useMemo, type ReactNode } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useWindowSize } from "@/hooks/use-window-size";
import { v4 } from "uuid";

interface GenericTableProps<T> extends TableProps<T> {
  data: T[];
  customHeight?: number;
  customScrollX?: number | string; // 👈 thêm prop này
  customScrollY?: number | string;
}

function DataGridInner<T>({
  data,
  customHeight = 250,
  customScrollX = "max-content",
  customScrollY,
  ...rest
}: GenericTableProps<T>) {
  const { height: windowHeight } = useWindowSize();

  const scrollConfig = useMemo(
    () => ({
      y: Math.max(windowHeight - customHeight, 200), // Giới hạn tối thiểu
      x: customScrollX,
    }),
    [windowHeight, customHeight, customScrollY]
  );

  // Tối ưu: chỉ tính toán lại dataSource khi data thực sự thay đổi
  const dataSource = useMemo(() => {
    return data;
  }, [data]);

  // Tối ưu performance cho Table
  const tableProps = useMemo(
    () => ({
      ...rest,
      bordered: true,
      dataSource,
      scroll: scrollConfig,
      rowKey: "id",
      className: `
        ${rest.className ?? ""}
        [&_.ant-table-cell]:py-1!
        [&_.ant-table-thead_.ant-table-cell]:py-3!
      `,
    }),
    [rest, dataSource]
  );

  return <Table key={v4()} {...tableProps} />;
}

export const DataGrid = memo(DataGridInner) as <T>(
  props: GenericTableProps<T>
) => ReactNode;
