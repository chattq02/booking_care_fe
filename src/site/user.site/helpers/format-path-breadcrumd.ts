/**
 * 👉 Hàm format slug sang chữ đẹp:
 * "kham-chuyen-khoa" → "Khám chuyên khoa"
 */
export function formatSlug(slug: string) {
  const map: Record<string, string> = {
    "kham-chuyen-khoa": "Khám chuyên khoa",
    "kham-tong-quat": "Khám tổng quát",
    "dich-vu": "Dịch vụ",
    "bac-si": "Bác sĩ",
    "thong-tin-ca-nhan": "Thông tin cá nhân",
  };

  return (
    map[slug] ||
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}
