import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import _ from "lodash";

interface SearchBoxProps {
  onSearch: (value: string) => void;
  value: string;
}

export default function SearchBox({ onSearch, value }: SearchBoxProps) {
  const [keyword, setKeyword] = useState(value);

  // ⚡ debounce khi người dùng đang gõ
  const debouncedSearch = _.debounce((val: string) => {
    onSearch(val.trim()); // nếu rỗng thì coi như search all
  }, 600);

  useEffect(() => {
    debouncedSearch(keyword);
    return () => {
      debouncedSearch.cancel();
    };
  }, [keyword]);

  // ✅ nhấn Enter → tìm ngay (kể cả rỗng)
  const handlePressEnter = () => {
    debouncedSearch.cancel(); // hủy debounce cũ
    onSearch(keyword.trim()); // "" = tìm all
  };

  // ✅ clear input → search all
  const handleClear = () => {
    setKeyword("");
    onSearch("");
  };

  return (
    <div style={{ width: 285 }}>
      <Input
        size="middle"
        allowClear
        placeholder="Nhập tên, CCCD, email, điện thoại để tìm kiếm"
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onPressEnter={handlePressEnter}
        onClear={handleClear}
      />
    </div>
  );
}
