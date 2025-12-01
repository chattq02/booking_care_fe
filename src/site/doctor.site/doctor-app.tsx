import { useRoutes } from "react-router-dom";
import { doctorRoutes } from "./routes";

export default function DoctorApp() {
  return useRoutes(doctorRoutes);
}
