import { useRoutes } from "react-router-dom";
import { userRoutes } from "./routes";

export default function UserApp() {
  return useRoutes([userRoutes]);
}
