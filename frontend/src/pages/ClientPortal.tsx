import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ClientPortal() {
  const navigate = useNavigate();
  const API_BASE = (() => {
    const raw =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "";
    const trimmed = raw.replace(/\/+$/, "");
    if (!trimmed) return "/api";
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  })();

  useEffect(() => {
    const token =
      (typeof window !== "undefined" &&
        (localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken"))) ||
      null;
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  return (
    <main className="container mx-auto min-h-screen px-4 py-32">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white max-md:text-2xl">
          Client Portal
        </h1>
        <p className="text-foreground/70 mt-3 text-lg">
          You are signed in. This space is ready for portal features such as
          dashboards, fleet management, and mission planning.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={async () => {
              const token =
                localStorage.getItem("authToken") ||
                sessionStorage.getItem("authToken");
              try {
                await fetch(`${API_BASE}/auth/logout/`, {
                  method: "POST",
                  headers: token
                    ? { Authorization: `Token ${token}` }
                    : undefined,
                  credentials: "include",
                });
              } catch (err) {
                console.error(err);
              }

              localStorage.removeItem("authToken");
              sessionStorage.removeItem("authToken");
              localStorage.removeItem("authUser");
              sessionStorage.removeItem("authUser");
              window.dispatchEvent(new Event("auth-updated"));
              navigate("/", { replace: true });
            }}
            className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-2xl bg-white px-6 text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
