import { useRoutes } from "react-router-dom";
import { doctorRoutes, publicDoctorRoutes } from "./routes";

export default function DoctorApp() {
  return useRoutes([doctorRoutes, ...publicDoctorRoutes]);
}
