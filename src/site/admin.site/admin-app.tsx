import { useRoutes } from "react-router-dom";
import { adminRoutes } from "./routes/private-route";

export default function AdminApp() {
  return useRoutes(adminRoutes);
}
