import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Home, LayoutDashboard, LogOut, Sheet } from "lucide-react";
import { HiMiniRectangleStack } from "react-icons/hi2";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { removeToken } from "../utils/token";
import { generateApiOrigin } from "../utils/apiOrigin";

const urlFetch = generateApiOrigin("/auth/logout");

export function AppSidebar() {
  const location = useLocation();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const response = await axios.post(urlFetch, null);
      if (response.status === 200) {
        removeToken();
        setUser(null);
        navigate("/login");
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <HiMiniRectangleStack className="w-5 h-5" />
          <div className="font-semibold text-lg">Nova</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/transactions")}
                >
                  <Link to="/dashboard/transactions">
                    <Sheet className="w-4 h-4" />
                    <span>Transaksi</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
