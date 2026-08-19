import "@fontsource-variable/outfit";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  BarChart3,
  Globe2,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Logo from "@/assets/logo.png";
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { logoutSession } from "@/utils/apiClient";
import { useAuth } from "@/contexts/AuthContext";

const primaryNavigation = [
  {
    path: "/dashboard",
    label: "Portfolio",
    description: "Research priorities",
    icon: LayoutDashboard,
  },
  {
    path: "/dashboard/macro",
    label: "Macro",
    description: "Regime intelligence",
    icon: Globe2,
    premium: true,
  },
  {
    path: "/dashboard/transactions",
    label: "Transactions",
    description: "Decision ledger",
    icon: BarChart3,
  },
];

function getInitials(user) {
  return (user?.name || user?.email || "Nova user")
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AppSidebar() {
  const location = useLocation();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  const visibleNavigation = primaryNavigation.filter(
    (item) => !item.premium || user?.tier !== "trial",
  );

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  useGSAP(
    () => {
      gsap.fromTo(
        ".sidebar-nav-item",
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" },
      );
    },
    { dependencies: [location.pathname], revertOnUpdate: true },
  );

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = async () => {
    try {
      await logoutSession();
    } finally {
      setUser(null);
      if (isMobile) setOpenMobile(false);
      navigate("/login");
    }
  };

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-0 font-['Outfit_Variable',sans-serif] [&_[data-sidebar=sidebar]]:bg-[#071113] [&_[data-sidebar=sidebar]]:text-white"
    >
      <SidebarHeader className="border-b border-white/8 p-3 group-data-[collapsible=icon]:p-2">
        <Link
          to="/dashboard"
          onClick={handleNavigate}
          className="group flex h-12 items-center gap-3 overflow-hidden rounded-xl px-2 transition-colors hover:bg-white/6 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span className="flex size-8 shrink-0 overflow-hidden rounded-lg bg-white p-1.5">
            <img src={Logo} alt="" className="size-full object-contain transition-transform duration-700 group-hover:scale-105" />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block text-lg font-semibold leading-none tracking-[-0.04em] text-white">Nova</span>
            <span className="mt-1 block truncate text-[9px] font-semibold uppercase tracking-[0.17em] text-white/35">Intelligence workspace</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-1">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
            Research workflow
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {visibleNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <SidebarMenuItem key={item.path} className="sidebar-nav-item">
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      isActive={active}
                      tooltip={item.label}
                      className="h-13 rounded-xl px-3 text-white/55 transition-[background-color,color,transform] duration-300 hover:translate-x-0.5 hover:bg-white/7 hover:text-white data-active:bg-[#dff7ef] data-active:text-emerald-950 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
                    >
                      <Link to={item.path} onClick={handleNavigate}>
                        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors group-data-[collapsible=icon]:size-4! group-data-[collapsible=icon]:bg-transparent! ${active ? "bg-emerald-950 text-white group-data-[collapsible=icon]:text-emerald-950" : "bg-white/6 text-white/55"}`}>
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                          <span className="block truncate text-sm font-semibold">{item.label}</span>
                          <span className={`mt-0.5 block truncate text-[10px] ${active ? "text-emerald-900/55" : "text-white/30"}`}>{item.description}</span>
                        </span>
                        {active && <span className="size-1.5 shrink-0 rounded-full bg-emerald-600 group-data-[collapsible=icon]:hidden" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="sidebar-nav-item mx-1 mt-6 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.035] p-4 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-200/45">Research standard</p>
            <ArrowUpRight className="size-3.5 text-cyan-200/35" />
          </div>
          <p className="mt-3 text-xs leading-5 text-white/45">Review signals against mandate constraints before taking action.</p>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/8 p-3 group-data-[collapsible=icon]:p-2">
        <div className="mb-2 flex items-center gap-3 overflow-hidden rounded-xl bg-white/[0.035] p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#dff7ef] text-[10px] font-bold text-emerald-950">{getInitials(user)}</span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-xs font-semibold text-white/85">{user?.email?.split("@")[0] || "Nova user"}</span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-white/30">{user?.tier || "Member"} access</span>
          </span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={handleLogout}
              className="h-10 rounded-xl px-3 text-white/40 transition-colors hover:bg-rose-500/10 hover:text-rose-200 group-data-[collapsible=icon]:mx-auto"
            >
              <LogOut className="size-4" />
              <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
