import CustomNavbar from "../components/CustomNavbar.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext.jsx";
import Footer from "../components/Footer.jsx";

export default function RootLayout() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div>
        <CustomNavbar />
        <Outlet />
        <Footer />
      </div>
    </AuthProvider>
  );
}
