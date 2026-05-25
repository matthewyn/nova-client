import { Card, CardBody, Button, Input } from "@heroui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  HiMiniEnvelope,
  HiLockClosed,
  HiMiniUser,
  HiChevronLeft,
} from "react-icons/hi2";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { Link, useNavigate } from "react-router-dom";
import { saveToken } from "@/utils/token";
import { useAuth } from "@/contexts/AuthContext";
import { InputOtp } from "@heroui/react";
import { toast } from "sonner";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase";

export const EyeSlashFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
        fill="currentColor"
      />
      <path
        d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
        fill="currentColor"
      />
      <path
        d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
        fill="currentColor"
      />
      <path
        d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
        fill="currentColor"
      />
      <path
        d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const EyeFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
        fill="currentColor"
      />
      <path
        d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
        fill="currentColor"
      />
    </svg>
  );
};

const formatPhoneNumber = (value, countryCode) => {
  const digits = value.replace(/\D/g, "");

  const patterns = {
    US: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    },
    CA: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    },
    GB: (d) => {
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`;
    },
    AU: (d) => {
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 10)}`;
    },
    IN: (d) => {
      if (d.length <= 5) return d;
      return `${d.slice(0, 5)} ${d.slice(5, 10)}`;
    },
    ID: (d) => {
      if (d.length <= 4) return d;
      if (d.length <= 8) return `${d.slice(0, 4)}-${d.slice(4)}`;
      return `${d.slice(0, 4)}-${d.slice(4, 8)}-${d.slice(8, 11)}`;
    },
  };

  const formatter = patterns[countryCode];
  if (formatter) {
    return formatter(digits.slice(0, 15));
  }

  let formatted = "";
  for (let i = 0; i < digits.length && i < 15; i++) {
    if (i > 0 && i % 4 === 0) formatted += " ";
    formatted += digits[i];
  }
  return formatted;
};

const urlFetch = generateApiOrigin("/auth/signup");
const urlConfirm = generateApiOrigin("/auth/confirm");

function SignUpCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const [resendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const sendOtp = async () => {
    if (!recaptchaVerifier) {
      toast("Recaptcha belum siap. Silakan coba lagi.", {
        type: "error",
        position: "top-center",
      });
      return;
    }

    const phoneNumber = `+62${phone.replace(/\D/g, "")}`;

    try {
      setIsLoading(true);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier,
      );
      setConfirmationResult(confirmationResult);
      setResendCountdown(60);
      setIsOtp(true);
      toast("OTP berhasil dikirim ke nomor Anda.", {
        type: "success",
        position: "top-center",
      });
    } catch (error) {
      setResendCountdown(0);
      if (error.code === "auth/invalid-phone-number") {
        toast("Nomor telepon tidak valid. Pastikan format benar.", {
          type: "error",
          position: "top-center",
        });
      } else if (error.code === "auth/too-many-requests") {
        toast(
          "Terlalu banyak permintaan. Silakan coba lagi nanti atau hubungi dukungan.",
          {
            type: "error",
            position: "top-center",
          },
        );
      } else {
        toast("Gagal mengirim OTP. Pastikan nomor benar.", {
          type: "error",
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!name || !email || !password || !phone) {
      toast("Semua form harus diisi dengan benar", {
        type: "error",
        position: "top-center",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await axios.post(urlConfirm, {
        phone: `+62${phone.replace(/\D/g, "")}`,
        email: email,
      });
      if (result.status === 200) {
        setIsLoading(false);
        await sendOtp();
      }
    } catch (error) {
      setIsLoading(false);
      toast("Gagal mengirim OTP. Pastikan nomor dan email benar.", {
        type: "error",
        position: "top-center",
      });
    }
  };

  const handleBackToForm = () => {
    setIsOtp(false);
    setOtp("");
  };

  const verifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!confirmationResult) {
      toast("OTP belum dikirim. Silakan coba lagi.", {
        type: "error",
        position: "top-center",
      });
      return;
    }

    try {
      setIsLoading(true);
      await confirmationResult.confirm(otp);

      const phoneNumber = `+62${phone.replace(/\D/g, "")}`;
      const response = await axios.post(urlFetch, {
        name: name,
        email: email,
        password: password,
        phone: phoneNumber,
      });

      if (response.status === 201) {
        saveToken(response.data.token);
        await fetchUser();
        navigate("/");
        toast("Pendaftaran berhasil! Selamat datang di Nova AI.", {
          type: "success",
          position: "top-center",
        });
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          toast("Terjadi kesalahan pada server. Silakan coba lagi nanti.", {
            type: "error",
            position: "top-center",
          });
          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      } else {
        toast("OTP tidak valid. Pastikan Anda memasukkan kode yang benar.", {
          type: "error",
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const enteredAllDigits = otp.replace(/\D/g, "").length === 6;
    if (enteredAllDigits) {
      verifyOtp();
    }
  }, [otp]);

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    setRecaptchaVerifier(verifier);
    return () => {
      verifier.clear();
    };
  }, [auth]);

  return (
    <>
      <div id="recaptcha-container" />
      <div
        className="max-w-120 relative z-10 p-4 rounded-2xl 
         bg-white/30 backdrop-blur-xl"
      >
        {!isOtp ? (
          <>
            <h1 className="font-semibold text-2xl text-center mt-2">
              Mulai dengan Nova AI
            </h1>
            <p className="text-gray-500 text-center mt-1">
              Pendamping investasi yang tenang dan didukung AI, dirancang untuk
              membantu Anda dalam bertransaksi.
            </p>
            <form className="flex flex-col gap-3 mt-5" onSubmit={proceedToOtp}>
              <div>
                <Input
                  isRequired
                  label="Nama"
                  type="text"
                  placeholder="Nama"
                  startContent={
                    <HiMiniUser size={20} className="text-gray-400" />
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                />
              </div>
              <div>
                <Input
                  isRequired
                  label="Email"
                  type="email"
                  placeholder="Email"
                  startContent={
                    <HiMiniEnvelope size={20} className="text-gray-400" />
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Input
                type="tel"
                isRequired
                label="Nomor Telepon"
                placeholder="Nomor telepon"
                value={formatPhoneNumber(phone, "ID")}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value, "ID");
                  setPhone(formatted);
                }}
                className="flex-1"
                minLength={10}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">+62</span>
                  </div>
                }
              />
              <div>
                <Input
                  isRequired
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-solid outline-transparent"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  startContent={
                    <HiLockClosed size={20} className="text-gray-400" />
                  }
                  label="Password"
                  placeholder="Password"
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                />
              </div>
              <Button isLoading={isLoading} type="submit" className="primary">
                Mulai Perjalanan
              </Button>
              <p>
                Sudah punya akun?{" "}
                <Link className="text-sm text-indigo-500" to="/login">
                  Masuk
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <Button variant="outline" size="icon-lg" onClick={handleBackToForm}>
              <HiChevronLeft />
            </Button>

            <h1 className="font-semibold text-2xl text-center mt-2">
              Verifikasi Nomor Anda
            </h1>
            <p className="text-gray-500 text-center mt-1">
              Kami telah mengirimkan 6 digit kode OTP ke nomor{" "}
              <span className="font-bold">+62 {phone}</span>. Masukkan kode
              tersebut untuk melanjutkan proses pendaftaran Anda.
            </p>
            <form className="flex flex-col gap-2 mt-3">
              <div className="flex justify-center">
                <InputOtp
                  isRequired
                  value={otp}
                  onValueChange={setOtp}
                  length={6}
                  placeholder="0"
                />
              </div>
              <Button
                isLoading={isLoading}
                type="submit"
                className="primary mt-2"
                onClick={verifyOtp}
              >
                Verifikasi Nomor Anda
              </Button>
              <Button
                isLoading={isLoading}
                type="button"
                variant="bordered"
                isDisabled={resendCountdown > 0 || isLoading}
                onClick={sendOtp}
              >
                Kirim Ulang OTP {resendCountdown > 0 && `(${resendCountdown}s)`}
              </Button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default SignUpCard;
