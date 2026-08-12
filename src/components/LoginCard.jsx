import { Button, Input } from "@heroui/react";
import axios from "@/utils/apiClient";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { useAuth } from "@/contexts/AuthContext";
import { createSession, saveSession } from "@/utils/token";
import { toast } from "sonner";

const urlFetch = generateApiOrigin("/auth/login");

function LoginCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { fetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible((visible) => !visible);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      const response = await axios.post(urlFetch, {
        email,
        password,
      });

      if (response.status === 200) {
        saveSession(createSession(response.data));
        await fetchUser();
        navigate("/");
        toast("Login successful! Welcome back.", {
          type: "success",
          position: "top-center",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast("Email or password is incorrect. Please try again.", {
            type: "error",
            position: "top-center",
          });
          return;
        }

        console.error("Login request failed with status:", error.response?.status);
      } else {
        console.error("An unexpected login error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-white/[0.075] p-2 shadow-[0_32px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="rounded-[1.3rem] border border-white/10 bg-[#0c0e13]/88 p-6 text-left sm:p-8">
        <div className="mb-7">
          <h2 className="text-2xl font-medium tracking-[-0.035em]">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-white/45">
            Access your research workspace securely.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            isRequired
            className="login-auth-input"
            label="Work email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            startContent={<Mail className="size-[18px] text-white/35" />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            classNames={{
              input: "text-white placeholder:text-white/25",
              inputWrapper:
                "h-14 border border-white/10 bg-white/[0.055] shadow-none transition-colors data-[hover=true]:bg-white/[0.08] group-data-[focus=true]:border-violet-300/60 group-data-[focus=true]:bg-white/[0.08]",
              label: "text-white/45 group-data-[filled-within=true]:text-white/55",
            }}
          />
          <Input
            isRequired
            className="login-auth-input"
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            autoComplete="current-password"
            minLength={6}
            startContent={<LockKeyhole className="size-[18px] text-white/35" />}
            endContent={
              <button
                aria-label={isVisible ? "Hide password" : "Show password"}
                className="rounded-md p-1 text-white/35 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-violet-300"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            classNames={{
              input: "text-white placeholder:text-white/25",
              inputWrapper:
                "h-14 border border-white/10 bg-white/[0.055] shadow-none transition-colors data-[hover=true]:bg-white/[0.08] group-data-[focus=true]:border-violet-300/60 group-data-[focus=true]:bg-white/[0.08]",
              label: "text-white/45 group-data-[filled-within=true]:text-white/55",
            }}
          />

          <div className="flex items-center justify-between gap-4 py-1 text-sm">
            <span className="text-white/35">Private and encrypted</span>
            <Link
              className="text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              to="/forgotpassword"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            className="h-14 w-full rounded-full bg-white text-base font-semibold text-[#090b10] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-violet-100"
            type="submit"
            isLoading={isLoading}
          >
            Sign in to Nova
          </Button>
          <Button
            as={Link}
            to="/signup"
            variant="bordered"
            className="h-14 w-full rounded-full border-white/15 bg-transparent text-base font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.07]"
          >
            Create an account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginCard;
