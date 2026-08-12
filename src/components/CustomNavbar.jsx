import Logo from "@/assets/logo.png";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Image,
} from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutSession } from "@/utils/apiClient";

function CustomNavbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const showSidebarToggle = location.pathname.startsWith("/dashboard");

  if (["/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutSession();
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <Navbar className="py-2">
      <div className="flex items-center gap-2">
        {showSidebarToggle && <SidebarTrigger />}
        <Link to="/">
          <NavbarBrand>
            <Image src={Logo} alt="Nova Logo" width={64} className="mr-2" />
            <p className="font-semibold text-inherit text-3xl">Nova</p>
          </NavbarBrand>
        </Link>
      </div>
      <NavbarContent justify="end">
        {user ? (
          <NavbarItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                  <Link to="/dashboard">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link to="/login">Sign In</Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/signup">
                <Button className="p-6 rounded-full cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}

export default CustomNavbar;
