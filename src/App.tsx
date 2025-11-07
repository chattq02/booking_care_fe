import "./App.css";
import "./index.css";
import AdminApp from "./site/admin.site/admin-app";
import DoctorApp from "./site/doctor.site/doctor-app";
import NotFound from "./site/NotFound";
import UserApp from "./site/user.site/user-app";

function App() {
  const host = window.location.hostname;

  if (host.includes("admin")) return <AdminApp />;
  if (host.includes("user")) return <UserApp />;
  if (host.includes("doctor")) return <DoctorApp />;

  return <NotFound />;
}

export default App;
