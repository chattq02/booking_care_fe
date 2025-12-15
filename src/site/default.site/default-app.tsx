import { useRoutes } from "react-router-dom";
import { indexRoutes } from "./routes/index.route";

export default function DefaultApp() {
  return useRoutes(indexRoutes);
}
