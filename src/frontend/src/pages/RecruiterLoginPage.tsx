import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Brain, Briefcase, Lock, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getRecruiters,
  isRecruiterRegistered,
  setCurrentRole,
  setRecruiterAuth,
} from "../utils/roleAuth";

export default function RecruiterLoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    const trimPhone = phone.trim();
    if (!trimPhone || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (!isRecruiterRegistered(trimPhone)) {
        setError("Recruiter account not found. Please sign up first.");
        setLoading(false);
        return;
      }
      const storedPass = localStorage.getItem(`rec_pass_${trimPhone}`);
      if (storedPass !== password) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }
      const recs = getRecruiters();
      const recData = recs[trimPhone];
      if (!recData.approved) {
        setError("Your account is pending admin approval. Please wait.");
        setLoading(false);
        return;
      }
      setRecruiterAuth(trimPhone, recData);
      setCurrentRole("recruiter");
      toast.success(`Welcome back, ${recData.name}! 💼`);
      navigate({ to: "/recruiter-dashboard" });
      setLoading(false);
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundColor: "#060B2A",
        backgroundImage:
          "radial-gradient(ellipse at 30% 50%, rgba(57,217,138,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,92,255,0.1) 0%, transparent 50%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
          data-ocid="recruiter-login.back.button"
        >
          <ArrowLeft size={15} />
          Back to Role Selection
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #39D98A, #10B981)" }}
          >
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              SMARTRESUME AI
            </span>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
              Recruiter Portal
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(57,217,138,0.25)",
            backdropFilter: "blur(12px)",
          }}
          data-ocid="recruiter-login.modal"
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(57,217,138,0.2)",
                border: "1px solid rgba(57,217,138,0.4)",
              }}
            >
              <Briefcase size={20} style={{ color: "#39D98A" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Recruiter Sign In
              </h2>
              <p className="text-white/40 text-xs">
                Access your talent dashboard
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
              data-ocid="recruiter-login.error_state"
            >
              {error}
            </div>
          )}

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
                  data-ocid="recruiter-login.phone.input"
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
                  data-ocid="recruiter-login.password.input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #39D98A, #10B981)",
                boxShadow: "0 4px 20px rgba(57,217,138,0.3)",
              }}
              data-ocid="recruiter-login.submit.button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-white/40 text-sm">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate({ to: "/recruiter-register" })}
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: "#39D98A" }}
                data-ocid="recruiter-login.register.link"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
