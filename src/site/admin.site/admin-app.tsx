import { useRoutes } from "react-router-dom";
import { adminRoutes } from "./routes";

export default function AdminApp() {
  return useRoutes([adminRoutes]);
}
