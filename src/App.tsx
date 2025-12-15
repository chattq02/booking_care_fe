import "./App.css";
import "./index.css";
import AdminApp from "./site/admin.site/admin-app";
import DefaultApp from "./site/default.site/default-app";
import DoctorApp from "./site/doctor.site/doctor-app";
import UserApp from "./site/user.site/user-app";

function App() {
  const host = window.location.hostname;

  if (host.includes("admin")) return <AdminApp />;
  if (host.includes("user")) return <UserApp />;
  if (host.includes("doctor")) return <DoctorApp />;

  return <DefaultApp />;
}

export default App;
