import React, { memo, useMemo, type ReactNode } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useWindowSize } from "@/hooks/use-window-size";

interface GenericTableProps<T> extends TableProps<T> {
  data: T[];
  customHeight?: number;
}

// ✅ Cách đúng để memo 1 component generic
function DataGridInner<T>({
  data,
  customHeight = 250,
  ...rest
}: GenericTableProps<T>) {
  const { height: windowHeight } = useWindowSize();

  const scrollConfig = useMemo(
    () => ({
      y: Math.max(150 - customHeight),
      x: "max-content" as const,
    }),
    [windowHeight, customHeight]
  );

  const dataSource = useMemo(() => data, [data]);

  return (
    <Table
      {...rest}
      bordered
      dataSource={dataSource}
      scroll={scrollConfig}
    />
  );
}

// ⚙️ Đây là “magic line” giúp vừa memo, vừa giữ generic <T>
export const DataGrid = memo(DataGridInner) as <T>(
  props: GenericTableProps<T>
) => ReactNode;
