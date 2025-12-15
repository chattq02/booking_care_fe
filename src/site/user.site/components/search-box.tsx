import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import doctorUser from "../apis/doctor.api";
import { Avatar } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";

interface User {
  avatar: string;
  id: number;
  name: string;
  type: "USER" | "FACILITY";
  user_type: string;
  uuid: string;
  academicTitle?: string;
  imageUrl?: string;
}
export type SearchResult = User;

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
  debounceDelay?: number;
  minChars?: number;
}

export function SearchBox({
  placeholder = "Tìm kiếm...",
  onResultSelect,
  className,
  debounceDelay = 500,
  minChars = 2,
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hàm thực hiện tìm kiếm
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.length < minChars) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await doctorUser.getDoctorAndFacilitiesSearch(searchQuery);
      setResults(data.data);
    } catch (error) {
      setResults([]);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Tạo debounced search function với useCallback để tránh recreate mỗi lần render
  const debouncedSearchRef = useRef(
    debounce((searchQuery: string) => {
      performSearch(searchQuery);
    }, debounceDelay)
  );

  // Xử lý khi input thay đổi
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Debounce tìm kiếm
    if (newQuery.length >= minChars) {
      debouncedSearchRef.current(newQuery);
    } else {
      setResults([]);
    }
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      debouncedSearchRef.current.cancel(); // Cleanup debounce
    };
  }, []);

  // Xử lý khi chọn kết quả
  const handleResultSelect = (result: SearchResult) => {
    onResultSelect?.(result);
    setShowDropdown(false);
    setQuery(result.name);
  };

  // Xóa tìm kiếm
  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  // Khi click vào input
  const handleInputClick = () => {
    setShowDropdown(true);
  };

  // Khi focus vào input
  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const displayLoading = isLoading;
  const hasSearchResults = results.length > 0 && query.length >= minChars;

  const shouldShowDropdown =
    showDropdown &&
    (hasSearchResults || displayLoading || query.trim().length > 0);

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="pl-10 pr-10"
          aria-label="Search input"
          role="combobox"
          aria-expanded={shouldShowDropdown}
          aria-controls="search-results"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {shouldShowDropdown && (
        <div
          id="search-results"
          className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          <div className="max-h-80 overflow-auto p-2">
            {/* Loading State */}
            {displayLoading && query.length >= minChars && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Đang tìm kiếm...
                </span>
              </div>
            )}

            {/* Search Results */}
            {hasSearchResults && !displayLoading && (
              <div className="mb-3">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Kết quả tìm kiếm
                </div>
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={`result-${result.uuid}`}
                      type="button"
                      onClick={() => handleResultSelect(result)}
                      className="w-full flex items-center rounded-sm cursor-pointer px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors gap-2"
                    >
                      <Search className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <Avatar
                        size={32}
                        src={
                          result.type === "USER"
                            ? result.avatar
                            : result.imageUrl
                        }
                        icon={
                          result.type === "USER" ? (
                            <UserOutlined />
                          ) : (
                            <HomeOutlined />
                          )
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {result.type === "USER"
                            ? ` BS. ${result.name}`
                            : result.name}
                        </div>
                        {result.type === "USER" && (
                          <div className="truncate text-[12px] text-gray-500">
                            {result.academicTitle ?? "---"}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty Search Results */}
            {!displayLoading &&
              query.length >= minChars &&
              !hasSearchResults && (
                <div className="p-4 text-center">
                  <div className="text-muted-foreground mb-1">
                    Không tìm thấy kết quả cho "{query}"
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Thử với từ khóa khác hoặc kiểm tra chính tả
                  </div>
                </div>
              )}

            {/* Initial State - No Query */}
            {!query && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nhập từ khóa để bắt đầu tìm kiếm
              </div>
            )}
          </div>

          {/* Search tips */}
          {query.length > 0 && query.length < minChars && (
            <div className="border-t p-2 text-xs text-muted-foreground">
              Nhập ít nhất {minChars} ký tự để tìm kiếm
            </div>
          )}
        </div>
      )}
    </div>
  );
}
