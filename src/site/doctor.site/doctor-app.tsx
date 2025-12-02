import { useRoutes } from "react-router-dom";
import { doctorRoutes } from "./routes/doctor.route";

export default function DoctorApp() {
  return useRoutes(doctorRoutes);
}
