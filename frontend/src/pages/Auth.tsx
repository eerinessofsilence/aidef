import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fingerprint, Eye, EyeClosed } from "lucide-react";

type AuthResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
};

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const API_BASE = (() => {
    const raw =
      import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
    const trimmed = raw.replace(/\/+$/, "");
    if (!trimmed) return "/api";
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  })();

  const copy = {
    title: "Sign in to AI-DEF Command",
    description:
      "Resume mission planning, manage fleets, and monitor live telemetry from a secure console.",
    cta: "Sign in",
  };

  const extractErrorMessage = (data: unknown) => {
    if (!data || typeof data !== "object") return "Unexpected server response.";
    const record = data as Record<string, unknown>;
    if (typeof record.detail === "string") return record.detail;

    const [firstKey] = Object.keys(record);
    const value = record[firstKey];
    if (Array.isArray(value) && value.length && typeof value[0] === "string") {
      return value[0];
    }
    if (typeof value === "string") return value;
    return "Unable to process request. Please try again.";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const remember = formData.get("remember") === "on";

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const payload = { email, password };
    const endpoint = "/auth/login/";

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }

      const parsed = data as Partial<AuthResponse>;
      const storage = remember ? localStorage : sessionStorage;
      if (typeof parsed.token === "string") {
        storage.setItem("authToken", parsed.token);
      }
      if (parsed.user && typeof parsed.user === "object") {
        storage.setItem("authUser", JSON.stringify(parsed.user));
      }

      setSuccess("Signed in successfully.");
      window.dispatchEvent(new Event("auth-updated"));
      navigate("/client-portal", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-[#1f3b68] opacity-60 blur-3xl md:h-96 md:w-96" />
        <div className="absolute bottom-[-15%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#243b63] opacity-70 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.06),transparent_30%)]" />
      </div>

      <div className="relative container">
        <div className="mx-auto max-w-140">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/8 via-white/4 to-white/2 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-2.5 shadow-2xl backdrop-blur-xl lg:p-5">
              <div className="mb-6 space-y-3">
                <h2 className="text-3xl font-bold max-md:text-2xl">
                  {copy.title}
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  {copy.description}
                </p>
              </div>

              <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-y-1 text-sm">
                  <span className="text-foreground/70">Work email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@aidef.com"
                    className="text-foreground placeholder:text-foreground/50 focus:border-foreground/50 focus:ring-foreground/40 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base transition focus:ring-2 focus:outline-none"
                  />
                </label>

                <label className="relative flex flex-col gap-y-1 text-sm">
                  <span className="text-foreground/70">Password</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="********"
                    className="text-foreground placeholder:text-foreground/50 focus:border-foreground/50 focus:ring-foreground/40 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 pr-24 text-base transition focus:ring-2 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-foreground/50 hover:text-foreground absolute top-9.5 right-3 text-xs font-semibold tracking-wide uppercase transition duration-300"
                  >
                    {showPassword ? <EyeClosed /> : <Eye />}
                  </button>
                </label>

                <div className="text-foreground/70 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="remember"
                      className="text-foreground/50 h-4 w-4 rounded border border-white/20 bg-white/10 focus:ring-white/40"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-foreground/50 hover:text-foreground/70 font-medium transition-all duration-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative">
                    {loading ? "Processing..." : copy.cta}
                  </span>
                </button>
              </form>

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400/70">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400/70">
                  {success}
                </div>
              )}

              <div className="text-foreground/70 mt-6 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Fingerprint className="h-5 w-5" />
                  Secure access policies
                </div>
                <p>
                  By continuing you agree to the operational access policy and{" "}
                  <Link
                    to="/terms-of-condition"
                    className="hover:text-foreground/70 font-medium text-white transition duration-300"
                  >
                    Terms of Condition
                  </Link>
                  . For elevated roles, hardware-backed MFA is required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
