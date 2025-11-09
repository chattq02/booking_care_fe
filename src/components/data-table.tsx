import { memo, useMemo, useState, useCallback, type ReactNode, useEffect, useRef } from "react";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { useWindowSize } from "@/hooks/use-window-size";
import type { ResizeCallbackData } from "react-resizable";
import { Resizable } from "react-resizable";

interface TitlePropsType {
  width: number;
  onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void;
}

const ResizableTitle: React.FC<React.HTMLAttributes<any> & TitlePropsType> = ({
  onResize,
  width,
  ...restProps
}) => {
  if (!width) return <th {...restProps} />;
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      minConstraints={[50, 0]}
      maxConstraints={[Infinity, 0]}
    >
      <th {...restProps} />
    </Resizable>
  );
};

interface GenericTableProps<T> extends TableProps<T> {
  data: T[];
  customHeight?: number;
  customScrollX?: number | string;

  maxHeight?: {
    isMax: boolean,
    customScrollY?: number
  }
}

function DataGridInner<T>({
  data,
  customHeight = 250,
  customScrollX = "max-content",
  maxHeight = {
    isMax: true,
    customScrollY: undefined
  },
  ...rest
}: GenericTableProps<T>) {
  const { height: windowHeight } = useWindowSize();

  const [columns, setColumns] = useState<TableColumnsType<T>>(
    rest.columns ?? []
  );


  useEffect(() => {
    if (rest.columns) {
      setColumns(rest.columns);
    }
  }, [rest.columns]);

  const dataSource = useMemo(() => data, [data]);
  // 🔧 Tối ưu scroll config
  const scrollConfig = useMemo(
    () => ({
      y: maxHeight.isMax ? Math.max(windowHeight - customHeight, 200) : dataSource.length < 20 ? undefined : maxHeight.customScrollY ?? 600,
      x: "max-content",
    }),
    [windowHeight, customHeight, customScrollX, maxHeight.customScrollY, maxHeight.isMax, dataSource]
  );


  // 🔧 Tối ưu: Dùng ref và requestAnimationFrame để giảm re-render
  const handleResize = useCallback((index: number) => {
    let animationFrameId: number;

    return (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        setColumns((prev) => {
          const next = [...prev];
          next[index] = {
            ...next[index],
            width: Math.max(size.width, 50) // Giới hạn width tối thiểu
          };
          return next;
        });
      });
    };
  }, []);

  // 🔧 Tối ưu: Memoize mergedColumns với dependency tối thiểu
  const mergedColumns = useMemo(() => {
    return columns.map((col, index) => ({
      ...col,
      ellipsis: true,
      // width: col.width ?? 180,
      onHeaderCell: (column: TableColumnsType<T>[number]) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    }));
  }, [columns, handleResize]);

  // 🔧 Tách component con cho table body để giảm re-render
  const TableComponent = useMemo(() => {
    return (
      <Table<T>
        {...rest}
        bordered={true}
        dataSource={dataSource}
        scroll={scrollConfig}
        sticky={true}
        rowKey={(record: any) => record.id ?? record.key}
        className={`
          ${rest.className ?? ""}
          [&_.ant-table-cell]:py-1!
          [&_.ant-table-thead_.ant-table-cell]:py-3!
        `}
        components={{ header: { cell: ResizableTitle } }}
        columns={mergedColumns}
      />
    );
  }, [rest, dataSource, scrollConfig, mergedColumns]);

  return TableComponent;
}

export const DataGrid = memo(DataGridInner) as <T>(
  props: GenericTableProps<T>
) => ReactNode;