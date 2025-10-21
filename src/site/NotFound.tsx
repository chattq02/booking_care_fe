import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-lg mb-6">Trang bạn tìm không tồn tại.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}
