import CustomNavbar from "@/components/CustomNavbar.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import Footer from "@/components/Footer.jsx";
import { Toaster } from "@/components/ui/sonner.jsx";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { AppSidebar } from "@/components/AppSidebar.jsx";

const pagesWithoutFooter = ["/login", "/signup"];

export default function RootLayout() {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/dashboard");

  return (
    <AuthProvider>
      <TooltipProvider>
        <SidebarProvider>
          {showSidebar && <AppSidebar />}
          <SidebarInset>
            <CustomNavbar />
            <Outlet />
            {!pagesWithoutFooter.includes(location.pathname) && <Footer />}
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  );
}
