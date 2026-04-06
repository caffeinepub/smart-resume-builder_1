import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Brain, Lock, Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username.trim() === "admin123" && password === "admin123") {
        localStorage.setItem("currentRole", "admin");
        toast.success("Welcome, Administrator! 🛡️");
        navigate({ to: "/admin-dashboard" });
      } else {
        setError("Invalid Admin Credentials");
        toast.error("Invalid Admin Credentials");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundColor: "#060B2A",
        backgroundImage:
          "radial-gradient(ellipse at 30% 50%, rgba(245,158,11,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,92,255,0.1) 0%, transparent 50%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
          data-ocid="admin-login.back.button"
        >
          <ArrowLeft size={15} />
          Back to Role Selection
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
          >
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              SMARTRESUME AI
            </span>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
              Admin Panel
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(245,158,11,0.25)",
            backdropFilter: "blur(12px)",
          }}
          data-ocid="admin-login.modal"
        >
          {/* Shield icon header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(245,158,11,0.2)",
                border: "1px solid rgba(245,158,11,0.4)",
              }}
            >
              <Shield size={20} style={{ color: "#F59E0B" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Sign In</h2>
              <p className="text-white/40 text-xs">
                Restricted access — authorized personnel only
              </p>
            </div>
          </div>

          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
              data-ocid="admin-login.error_state"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <p className="label-dark">Username</p>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  className="input-dark pl-9"
                  placeholder="admin123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  data-ocid="admin-login.username.input"
                />
              </div>
            </div>
            <div>
              <p className="label-dark">Password</p>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="password"
                  className="input-dark pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  data-ocid="admin-login.password.input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
              }}
              data-ocid="admin-login.submit.button"
            >
              {loading ? "Signing in..." : "Sign In as Admin"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
