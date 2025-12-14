import { type FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Fingerprint } from "lucide-react";

type AuthMode = "signin" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("signin");

  const copy = useMemo(
    () =>
      mode === "signin"
        ? {
            title: "Sign in to AI-DEF Command",
            description:
              "Resume mission planning, manage fleets, and monitor live telemetry from a secure console.",
            cta: "Sign in",
            switchLabel: "New to AI-DEF?",
            switchCta: "Create account",
          }
        : {
            title: "Create your access",
            description:
              "Provision access for your team with role-aware permissions and rapid onboarding.",
            cta: "Create account",
            switchLabel: "Already have access?",
            switchCta: "Sign in",
          },
    [mode],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="relative min-h-screen overflow-hidden py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-[#1f3b68] opacity-60 blur-3xl md:h-96 md:w-96" />
        <div className="absolute top-1/4 right-[-10%] h-80 w-80 rounded-full bg-[#0f1628] opacity-80 blur-[120px] md:right-10" />
        <div className="absolute bottom-[-15%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#243b63] opacity-70 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.06),transparent_30%)]" />
      </div>

      <div className="relative container">
        <div className="mx-auto max-w-140">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/8 via-white/4 to-white/2 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-2.5 shadow-2xl backdrop-blur-xl lg:p-5">
              <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`flex-1 rounded-full px-4 py-2 transition-all duration-300 ${
                    mode === "signin"
                      ? "bg-white text-black shadow-[0_10px_50px_rgba(0,0,0,0.2)]"
                      : "text-foreground/70 hover:text-foreground bg-transparent"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`flex-1 rounded-full px-4 py-2 transition-all duration-300 ${
                    mode === "signup"
                      ? "bg-white text-black shadow-[0_10px_50px_rgba(0,0,0,0.2)]"
                      : "text-foreground/70 hover:text-foreground bg-transparent"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="mb-6 space-y-3">
                <h2 className="text-3xl font-bold max-md:text-2xl">
                  {copy.title}
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  {copy.description}
                </p>
              </div>

              <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
                {mode === "signup" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-y-1 text-sm">
                      <span className="text-foreground/70">Full name</span>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Alex Smith"
                        className="text-foreground placeholder:text-foreground/60 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base transition focus:border-white focus:ring-2 focus:ring-white/30 focus:outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-y-1 text-sm">
                      <span className="text-foreground/70">Unit or team</span>
                      <input
                        type="text"
                        name="team"
                        placeholder="Mission ops"
                        className="text-foreground placeholder:text-foreground/60 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base transition focus:border-white focus:ring-2 focus:ring-white/30 focus:outline-none"
                      />
                    </label>
                  </div>
                )}

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

                <label className="flex flex-col gap-y-1 text-sm">
                  <span className="text-foreground/70">Password</span>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="********"
                    className="text-foreground placeholder:text-foreground/50 focus:border-foreground/50 focus:ring-foreground/40 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base transition focus:ring-2 focus:outline-none"
                  />
                </label>

                {mode === "signin" && (
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
                )}

                <button
                  type="submit"
                  className="group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
                >
                  <span className="relative">{copy.cta}</span>
                </button>
              </form>

              <div className="text-foreground/70 mt-5 flex items-center gap-2 text-sm">
                <span>{copy.switchLabel}</span>

                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "signin" ? "signup" : "signin")
                  }
                  className="hover:text-foreground/70 font-medium text-white transition duration-300"
                >
                  {copy.switchCta}
                </button>
              </div>

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
