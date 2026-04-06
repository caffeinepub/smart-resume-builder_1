import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Brain, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getRegisteredUsers,
  getUserStream,
  isPhoneRegistered,
  setStoredAuth,
} from "../utils/auth";
import { setCurrentRole } from "../utils/roleAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!isPhoneRegistered(trimmed)) {
      toast.error("Phone number not found. Please sign up first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const users = getRegisteredUsers();
      const name = users[trimmed] ?? "User";
      setStoredAuth({ phone: trimmed, name, token: `tok_${Date.now()}` });
      setCurrentRole("student");
      toast.success(`Welcome back, ${name}! \uD83D\uDE80`);
      const stream = getUserStream();
      navigate({ to: stream ? "/dashboard" : "/stream-select" });
      setLoading(false);
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundColor: "#060B2A",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(124,92,255,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(53,208,199,0.12) 0%, transparent 50%)",
      }}
    >
      {/* Back to role selection */}
      <div className="w-full max-w-md mb-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors"
          data-ocid="login.back.link"
        >
          <ArrowLeft size={15} />
          Back to Role Selection
        </Link>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7C5CFF, #4B8BFF)" }}
        >
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <span className="text-white font-extrabold text-lg tracking-tight">
            SMARTRESUME AI
          </span>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
            Student Portal
          </p>
        </div>
      </div>

      <div className="glass-card w-full max-w-md p-8" data-ocid="login.modal">
        <h2 className="text-2xl font-bold text-white mb-1">Student Sign In</h2>
        <p className="text-white/50 text-sm mb-6">
          Enter your registered mobile number to sign in
        </p>

        <div className="space-y-4">
          <div>
            <p className="label-dark">Mobile Number</p>
            <div className="relative">
              <Phone
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="tel"
                className="input-dark pl-9"
                placeholder="+91-9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                data-ocid="login.phone.input"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
            data-ocid="login.submit.button"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-white/8 text-center">
          <p className="text-white/40 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 transition-colors"
              data-ocid="login.register.link"
            >
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-white/20 text-xs text-center">
        \u00a9 {new Date().getFullYear()}. Built with \u2764\uFE0F using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400/60 hover:text-purple-400 transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
