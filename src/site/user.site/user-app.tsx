import { useRoutes } from "react-router-dom";
import { userRoutes } from "./routes/user.routes";

export default function UserApp() {
  return useRoutes(userRoutes);
}
