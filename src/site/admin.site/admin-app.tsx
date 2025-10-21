import { Route, Routes } from "react-router-dom";
import NotFound from "../NotFound";

export default function AdminApp() {
  return (
    <Routes>
      {/* Trang chính */}
      <Route path="/" element={<div>Dashboard</div>} />

      {/* Các route khác */}
      <Route path="/users" element={<div>aâ</div>} />
      <Route path="/settings" element={<div>settings</div>} />

      {/* Route cuối cùng — 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
