import { useRoutes } from "react-router-dom";
import { adminRoutes } from "./routes/admin.route";

export default function AdminApp() {
  return useRoutes(adminRoutes);
}
