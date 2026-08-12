import {
  Button,
  Input,
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "sonner";
import axios from "@/utils/apiClient";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { createSession, saveSession } from "@/utils/token";
import { useAuth } from "@/contexts/AuthContext";
import { COUNTRIES, PhoneInput } from "@/components/PhoneInput.jsx";
import { TermsConditionsContent } from "@/components/TermsConditions.jsx";
import { auth } from "@/firebase";

const urlFetch = generateApiOrigin("/auth/signup");
const urlConfirm = generateApiOrigin("/auth/confirm");

const inputClassNames = {
  input: "text-white placeholder:text-white/25",
  inputWrapper:
    "h-14 border border-white/10 bg-white/[0.055] shadow-none transition-colors data-[hover=true]:bg-white/[0.08] group-data-[focus=true]:border-cyan-200/60 group-data-[focus=true]:bg-white/[0.08]",
  label: "text-white/45 group-data-[filled-within=true]:text-white/55",
};

function SignUpCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [tempAgreed, setTempAgreed] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifier = useRef(null);
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const sendOtp = async () => {
    if (!recaptchaVerifier.current) {
      toast("Recaptcha not ready. Please try again.", {
        type: "error",
        position: "top-center",
      });
      return;
    }

    const phoneNumber = `${selectedCountry.dialCode}${phone.replace(/\D/g, "")}`;

    try {
      setIsLoading(true);
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current,
      );
      setConfirmationResult(result);
      setResendCountdown(60);
      setIsOtp(true);
      toast("OTP successfully sent to your number.", {
        type: "success",
        position: "top-center",
      });
    } catch (error) {
      setResendCountdown(0);
      if (error.code === "auth/invalid-phone-number") {
        toast("Invalid phone number. Please ensure the format is correct.", {
          type: "error",
          position: "top-center",
        });
      } else if (error.code === "auth/too-many-requests") {
        toast("Too many requests. Please try again later or contact support.", {
          type: "error",
          position: "top-center",
        });
      } else {
        toast("Failed to send OTP. Please use another phone number.", {
          type: "error",
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToOtp = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password || !phone) {
      toast("All fields must be filled correctly", {
        type: "error",
        position: "top-center",
      });
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      toast("You must agree to the terms and conditions first.", {
        type: "error",
        position: "top-center",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await axios.post(urlConfirm, {
        phone: `${selectedCountry.dialCode}${phone.replace(/\D/g, "")}`,
        email,
      });
      if (result.status === 200) {
        setIsLoading(false);
        await sendOtp();
      }
    } catch {
      setIsLoading(false);
      toast(
        "Failed to send OTP. Please ensure the number and email are correct.",
        { type: "error", position: "top-center" },
      );
    }
  };

  const verifyOtp = async (event) => {
    event?.preventDefault();
    if (!confirmationResult) {
      toast("OTP not sent yet. Please try again.", {
        type: "error",
        position: "top-center",
      });
      return;
    }

    try {
      setIsLoading(true);
      await confirmationResult.confirm(otp);

      const phoneNumber = `${selectedCountry.dialCode}${phone.replace(/\D/g, "")}`;
      const response = await axios.post(urlFetch, {
        name,
        email,
        password,
        phone: phoneNumber,
        country: selectedCountry.name,
      });

      if (response.status === 201) {
        saveSession(createSession(response.data));
        await fetchUser();
        navigate("/");
        toast("Registration successful! Welcome to Nova AI.", {
          type: "success",
          position: "top-center",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          toast("Server error occurred. Please try again later.", {
            type: "error",
            position: "top-center",
          });
        }
        console.error("Signup request failed with status:", error.response?.status);
      } else {
        toast("Invalid OTP. Please ensure you entered the correct code.", {
          type: "error",
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) setTempAgreed(false);
    onOpenChange(open);
  };

  useEffect(() => {
    if (resendCountdown <= 0) return undefined;

    const timer = setTimeout(
      () => setResendCountdown((countdown) => countdown - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    recaptchaVerifier.current = verifier;

    return () => {
      verifier.clear();
      recaptchaVerifier.current = null;
    };
  }, []);

  return (
    <>
      <div id="recaptcha-container" />
      <div className="rounded-[1.9rem] border border-white/15 bg-white/[0.075] p-2 shadow-[0_32px_100px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
        <div className="rounded-[1.45rem] border border-white/10 bg-[#0a1417]/92 p-6 text-left sm:p-8">
          {!isOtp ? (
            <>
              <div className="mb-7 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-medium tracking-[-0.035em]">
                    Create your account
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Set up your private Nova research workspace.
                  </p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-cyan-200/20 bg-cyan-200/[0.07] text-cyan-100">
                  <ShieldCheck className="size-5" />
                </span>
              </div>

              <form className="signup-form flex flex-col gap-4" onSubmit={proceedToOtp}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    isRequired
                    className="signup-auth-input"
                    label="Full name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    startContent={<UserRound className="size-[18px] text-white/35" />}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    classNames={inputClassNames}
                  />
                  <Input
                    isRequired
                    className="signup-auth-input"
                    label="Work email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    startContent={<Mail className="size-[18px] text-white/35" />}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    classNames={inputClassNames}
                  />
                </div>

                <PhoneInput
                  appearance="dark"
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  phone={phone}
                  setPhone={setPhone}
                />

                <Input
                  isRequired
                  className="signup-auth-input"
                  label="Password"
                  placeholder="At least 8 characters"
                  type={isVisible ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  startContent={<LockKeyhole className="size-[18px] text-white/35" />}
                  endContent={
                    <button
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      className="rounded-md p-1 text-white/35 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-200"
                      type="button"
                      onClick={() => setIsVisible((visible) => !visible)}
                    >
                      {isVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  classNames={inputClassNames}
                />

                <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3.5">
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${
                      agreedToTerms
                        ? "border-cyan-200 bg-cyan-200 text-[#071013]"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    <Check className="size-3" />
                  </span>
                  <p className="text-sm leading-6 text-white/45">
                    By creating an account, you agree to Nova’s{" "}
                    <button
                      type="button"
                      className="font-medium text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
                      onClick={onOpen}
                    >
                      Terms and Conditions
                    </button>
                    .
                  </p>
                </div>

                <Button
                  isLoading={isLoading}
                  type="submit"
                  className="h-14 w-full rounded-full bg-white text-base font-semibold text-[#071013] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-cyan-100"
                >
                  Continue to verification
                </Button>

                <p className="text-center text-sm text-white/40">
                  Already have an account?{" "}
                  <Link className="font-medium text-white/80 transition-colors hover:text-white" to="/login">
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <div className="py-1">
              <button
                type="button"
                aria-label="Return to account details"
                onClick={() => {
                  setIsOtp(false);
                  setOtp("");
                }}
                className="grid size-10 place-items-center rounded-full border border-white/12 text-white/60 transition-colors hover:bg-white hover:text-[#071013] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <ArrowLeft className="size-4" />
              </button>

              <div className="mx-auto mt-3 max-w-md text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full border border-cyan-200/20 bg-cyan-200/[0.07] text-cyan-100">
                  <ShieldCheck className="size-6" />
                </span>
                <h2 className="mt-5 text-3xl font-medium tracking-[-0.04em]">
                  Verify your number
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/45">
                  Enter the six-digit code sent to{" "}
                  <span className="font-medium text-white/75">
                    {selectedCountry.dialCode} {phone}
                  </span>
                  .
                </p>
              </div>

              <form className="signup-otp-form mt-8 flex flex-col gap-4" onSubmit={verifyOtp}>
                <div className="flex justify-center">
                  <InputOtp
                    isRequired
                    value={otp}
                    onValueChange={setOtp}
                    length={6}
                    placeholder="0"
                    classNames={{
                      segmentWrapper: "gap-2",
                      segment:
                        "h-12 w-11 border border-white/12 bg-white/[0.055] text-white data-[focus=true]:border-cyan-200/60 sm:h-14 sm:w-12",
                    }}
                  />
                </div>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  className="mt-2 h-14 w-full rounded-full bg-white text-base font-semibold text-[#071013] hover:bg-cyan-100"
                >
                  Verify and create account
                </Button>
                <Button
                  isLoading={isLoading}
                  type="button"
                  variant="bordered"
                  isDisabled={resendCountdown > 0 || isLoading}
                  onClick={sendOtp}
                  className="h-14 w-full rounded-full border-white/15 bg-transparent text-base font-medium text-white hover:border-white/30 hover:bg-white/[0.07]"
                >
                  {resendCountdown > 0
                    ? `Send another code in ${resendCountdown}s`
                    : "Send another code"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        scrollBehavior="inside"
        size="lg"
        classNames={{
          base: "bg-[#f5f6f3] text-[#0a1114]",
          closeButton: "hover:bg-black/5",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-black/10 text-xl font-semibold">
                Terms and Conditions
              </ModalHeader>
              <ModalBody className="gap-0 pt-5 text-sm text-gray-700">
                <TermsConditionsContent />
              </ModalBody>
              <ModalFooter className="flex-col gap-4 border-t border-black/10">
                <label className="flex w-full cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={tempAgreed}
                    onChange={(event) => setTempAgreed(event.target.checked)}
                    className="size-4 accent-[#087f83]"
                  />
                  I have read and agree to the terms and conditions.
                </label>
                <div className="flex w-full justify-end gap-3">
                  <Button variant="bordered" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#071013] text-white"
                    isDisabled={!tempAgreed}
                    onPress={() => {
                      setAgreedToTerms(true);
                      onClose();
                    }}
                  >
                    Agree and continue
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SignUpCard;
