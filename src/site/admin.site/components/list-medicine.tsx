import { Select, Skeleton } from "antd";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { debounce } from "lodash";
import type { ResponseDepartment } from "../pages/specialty/type";
import medicineApi from "../apis/medicine";
import type { DefaultOptionType } from "antd/es/select";

const { Option } = Select;

interface IProps {
  defaultValue?: string | number;
  onChange?:
    | ((value: string, option?: DefaultOptionType | undefined) => void)
    | undefined;
  style?: React.CSSProperties;
  facilityId: number;
  mode?: "multiple" | "tags" | undefined;
}

export default function ListMedicine({
  defaultValue,
  onChange,
  style,
  facilityId,
  mode,
}: IProps) {
  const [data, setData] = useState<ResponseDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  /** --- API Fetch --- */
  const fetchAPI = useCallback(
    async (pageNum = 1, search = "", append = false) => {
      try {
        setIsLoading(true);
        const res = await medicineApi.getList({
          keyword: search,
          page: pageNum,
          per_page: 10,
          facilityId: Number(facilityId),
        });

        const { data: newData = [], next_page_url } = res?.data || {};

        setData((prev) => (append ? [...prev, ...newData] : newData));
        setHasMore(!!next_page_url);
        setPage(pageNum + 1);
      } catch (err) {
        toast.error("Lỗi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /** --- Initial load --- */
  useEffect(() => {
    fetchAPI(1, keyword);
  }, []);

  /** --- Infinite Scroll --- */
  const handleScroll = async (e: any) => {
    const { target } = e;
    const isBottomReached =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 1;

    if (isBottomReached && hasMore && !isLoading) {
      await fetchAPI(page, keyword, true);
    }
  };

  /** --- Search Debounce --- */
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setKeyword(value);
      setPage(1);
      fetchAPI(1, value);
    }, 500),
    [fetchAPI]
  );

  return (
    <Select
      id="ListMedicine"
      mode={mode || undefined}
      style={style || { width: 350 }}
      value={defaultValue ? String(defaultValue) : undefined}
      onChange={onChange}
      placeholder="VD: Paracetamol"
      loading={isLoading}
      onPopupScroll={handleScroll}
      listHeight={200}
      showSearch
      onSearch={debouncedSearch}
      filterOption={false}
      notFoundContent={
        isLoading ? (
          <div style={{ textAlign: "center", padding: "8px" }}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
        ) : (
          "Không tìm thấy dữ liệu"
        )
      }
    >
      {data.map((item) => (
        <Option key={item.id} value={String(item.id)}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
}
