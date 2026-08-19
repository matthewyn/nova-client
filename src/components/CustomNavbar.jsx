import { useRef } from "react";
import "@fontsource-variable/outfit";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Logo from "@/assets/logo.png";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutSession } from "@/utils/apiClient";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const dashboardRoutes = [
  { match: "/dashboard/transactions", label: "Transaction oversight" },
  { match: "/dashboard/macro", label: "Macro intelligence" },
  { match: "/dashboard", label: "Portfolio intelligence" },
];

function getInitials(user) {
  const identity = user?.name || user?.email || "Nova user";
  return identity
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function CustomNavbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);
  const showSidebarToggle = location.pathname.startsWith("/dashboard");
  const routeLabel = dashboardRoutes.find((route) =>
    location.pathname.startsWith(route.match),
  )?.label;

  useGSAP(
    () => {
      gsap.fromTo(
        ".nav-reveal",
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.045, ease: "power2.out" },
      );

      gsap.fromTo(
        navbarRef.current,
        { boxShadow: "0 0 0 rgba(15, 23, 42, 0)" },
        {
          boxShadow: "0 14px 40px rgba(15, 23, 42, 0.08)",
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "+=120",
            scrub: true,
          },
        },
      );
    },
    { scope: navbarRef, dependencies: [location.pathname], revertOnUpdate: true },
  );

  if (["/login", "/signup"].includes(location.pathname)) return null;

  const handleLogout = async () => {
    try {
      await logoutSession();
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/88 font-['Outfit_Variable',sans-serif] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-[96rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="nav-reveal flex min-w-0 items-center gap-3">
          {showSidebarToggle && (
            <>
              <SidebarTrigger className="size-9 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-950 hover:text-white" />
              <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            </>
          )}

          <Link to={user ? "/dashboard" : "/"} className="group flex items-center gap-2.5">
            <span className="flex size-9 overflow-hidden rounded-xl bg-[#0b1618] p-1.5 shadow-[0_8px_24px_-12px_rgba(8,47,52,0.8)]">
              <img
                src={Logo}
                alt=""
                className="size-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </span>
            <span className="hidden sm:block">
              <span className="block text-lg font-semibold leading-none tracking-[-0.04em] text-slate-950">Nova</span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.17em] text-slate-400">Investment intelligence</span>
            </span>
          </Link>
        </div>

        {showSidebarToggle && routeLabel && (
          <div className="nav-reveal pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
            <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" />
            <span className="text-xs font-semibold text-slate-600">{routeLabel}</span>
          </div>
        )}

        <div className="nav-reveal flex items-center gap-2 sm:gap-3">
          {!showSidebarToggle && location.pathname === "/" && (
            <a
              href="#how-nova-works"
              className="hidden text-sm font-medium text-slate-500 transition-colors hover:text-slate-950 md:block"
            >
              How Nova works
            </a>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2 text-left shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                  aria-label="Open account menu"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-[#0b1618] text-[11px] font-bold text-white">
                      {getInitials(user)}
                    </AvatarFallback>
                    <AvatarBadge className="bg-emerald-500 ring-white" />
                  </Avatar>
                  <span className="hidden max-w-36 sm:block">
                    <span className="block truncate text-xs font-semibold text-slate-900">
                      {user.name || user.email?.split("@")[0] || "Nova user"}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {user.tier || "Member"}
                    </span>
                  </span>
                  <ChevronDown className="size-3.5 text-slate-400 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.35)]">
                <DropdownMenuLabel className="px-2 py-2">
                  <span className="block truncate text-sm font-semibold text-slate-950">{user.email || "Authenticated account"}</span>
                  <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">Research workspace</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => navigate("/dashboard")} className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-slate-700 focus:bg-slate-100">
                    <LayoutDashboard className="size-4 text-slate-400" />
                    Portfolio dashboard
                    <ArrowUpRight className="ml-auto size-3.5 text-slate-400" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuItem variant="destructive" onSelect={handleLogout} className="cursor-pointer gap-3 rounded-xl px-3 py-2.5">
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="hidden h-10 items-center px-3 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 sm:inline-flex">Sign in</Link>
              <Link to="/signup" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0b1618] px-4 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(8,47,52,0.75)] transition-transform hover:-translate-y-0.5">Start workspace <ArrowUpRight className="size-4" /></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default CustomNavbar;
