import CustomNavbar from "../components/CustomNavbar.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import { Toaster } from "../components/ui/sonner.jsx";

const pagesWithoutFooter = ["/login", "/signup"];

export default function RootLayout() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div>
        <CustomNavbar />
        <Outlet />
        {!pagesWithoutFooter.includes(location.pathname) && <Footer />}
        <Toaster />
      </div>
    </AuthProvider>
  );
}
