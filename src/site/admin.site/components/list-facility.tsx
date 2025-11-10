import { Select, Skeleton } from "antd";
import { useEffect, useState, useCallback } from "react";
import type { ResponseMedicalFacility } from "../pages/medical-facility/type";
import medicalFacilityAdmin from "../apis/medical-facility";
import { toast } from "sonner";
import { debounce } from "lodash";

const { Option } = Select;

interface ListFacilityProps {
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

export default function ListFacility({
  defaultValue,
  onChange,
  style,
}: ListFacilityProps) {
  const [data, setData] = useState<ResponseMedicalFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  /** --- API Fetch --- */
  const fetchFacilities = useCallback(
    async (pageNum = 1, search = "", append = false) => {
      try {
        setIsLoading(true);
        const res = await medicalFacilityAdmin.getList({
          keyword: search,
          page: pageNum,
          per_page: 10,
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
    fetchFacilities(1, keyword);
  }, []);

  /** --- Infinite Scroll --- */
  const handleScroll = async (e: any) => {
    const { target } = e;
    const isBottomReached =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 1;

    if (isBottomReached && hasMore && !isLoading) {
      await fetchFacilities(page, keyword, true);
    }
  };

  /** --- Search Debounce --- */
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setKeyword(value);
      setPage(1);
      fetchFacilities(1, value);
    }, 500),
    [fetchFacilities]
  );

  return (
    <Select
      id="listMedical"
      style={style || { width: 350 }}
      value={defaultValue ? String(defaultValue) : undefined}
      onChange={onChange}
      placeholder="Tìm khoa theo cơ sở y tế..."
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
