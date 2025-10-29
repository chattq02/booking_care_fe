import { useRoutes } from "react-router-dom";
import { adminPrivateRoutes } from "./routes/private-route";
import { adminPublicRoutes } from "./routes/public-route";

export default function AdminApp() {
  return useRoutes([adminPrivateRoutes, ...adminPublicRoutes]);
}
