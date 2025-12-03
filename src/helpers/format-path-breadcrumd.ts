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
    "danh-sach-bac-si": "Danh sách bác sĩ",
    "lich-kham": "Lịch khám",
    "ham-vi": "Hàm vị - học vị",
    "chuyen-khoa": "Chuyên khoa",
    "co-so-y-te": "Cơ sở y tế",
    "tao-moi": "Tạo mới",
    "danh-sach-lich-hen": "Danh sách lịch hẹn",
    "danh-sach-benh-nhan": "Danh sách bệnh nhân khám",
  };

  return (
    map[slug] ||
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}
