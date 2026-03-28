import { Link, useNavigate } from "@tanstack/react-router";
import { Brain, Phone, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { isPhoneRegistered, registerUser, setStoredAuth } from "../utils/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }
    if (phone.trim().length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    if (isPhoneRegistered(phone.trim())) {
      toast.error("This phone number is already registered. Please sign in.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      registerUser(phone.trim(), name.trim());
      setStoredAuth({
        phone: phone.trim(),
        name: name.trim(),
        token: `tok_${Date.now()}`,
      });
      toast.success(`Account created! Welcome, ${name.trim()}! 🎉`);
      navigate({ to: "/dashboard" });
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
            Career Builder
          </p>
        </div>
      </div>

      <div
        className="glass-card w-full max-w-md p-8"
        data-ocid="register.modal"
      >
        <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-white/50 text-sm mb-6">
          Join SMARTRESUME AI and kickstart your career journey
        </p>

        <div className="space-y-4">
          <div>
            <p className="label-dark">Full Name</p>
            <div className="relative">
              <User
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                className="input-dark pl-9"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="register.name.input"
              />
            </div>
          </div>

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
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                data-ocid="register.phone.input"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
            data-ocid="register.submit.button"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-white/8 text-center">
          <p className="text-white/40 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors"
              data-ocid="register.login.link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-white/20 text-xs text-center">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
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
