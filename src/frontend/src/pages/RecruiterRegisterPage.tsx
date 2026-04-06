import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Brain,
  Briefcase,
  Building2,
  Lock,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { isRecruiterRegistered, registerRecruiter } from "../utils/roleAuth";

export default function RecruiterRegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = () => {
    setError("");
    if (
      !name.trim() ||
      !phone.trim() ||
      !password ||
      !company.trim() ||
      !designation.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }
    if (phone.trim().length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    if (isRecruiterRegistered(phone.trim())) {
      setError("This phone number is already registered. Please sign in.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      registerRecruiter(phone.trim(), {
        name: name.trim(),
        phone: phone.trim(),
        company: company.trim(),
        designation: designation.trim(),
        approved: false,
      });
      localStorage.setItem(`rec_pass_${phone.trim()}`, password);
      setSuccess(true);
      toast.success("Registration submitted! Awaiting admin approval.");
      setLoading(false);
    }, 300);
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          backgroundColor: "#060B2A",
          backgroundImage:
            "radial-gradient(ellipse at 30% 50%, rgba(57,217,138,0.12) 0%, transparent 60%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(57,217,138,0.2)",
              border: "2px solid rgba(57,217,138,0.4)",
            }}
          >
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Registration Submitted!
          </h2>
          <p className="text-white/50 text-sm mb-2">
            Your recruiter account is pending admin approval.
          </p>
          <p className="text-white/40 text-xs mb-8">
            You&apos;ll be able to login once an admin approves your account.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/recruiter-login" })}
            className="btn-primary"
            data-ocid="recruiter-register.login.button"
          >
            Go to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
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
          onClick={() => navigate({ to: "/recruiter-login" })}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
          data-ocid="recruiter-register.back.button"
        >
          <ArrowLeft size={15} />
          Back to Sign In
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
              Recruiter Registration
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
          data-ocid="recruiter-register.modal"
        >
          <h2 className="text-xl font-bold text-white mb-1">
            Create Recruiter Account
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Register to access the talent pool
          </p>

          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
              data-ocid="recruiter-register.error_state"
            >
              {error}
            </div>
          )}

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
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-ocid="recruiter-register.name.input"
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
                  data-ocid="recruiter-register.phone.input"
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-ocid="recruiter-register.password.input"
                />
              </div>
            </div>
            <div>
              <p className="label-dark">Company Name</p>
              <div className="relative">
                <Building2
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  className="input-dark pl-9"
                  placeholder="TechCorp India Pvt. Ltd."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  data-ocid="recruiter-register.company.input"
                />
              </div>
            </div>
            <div>
              <p className="label-dark">Designation</p>
              <div className="relative">
                <Briefcase
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  className="input-dark pl-9"
                  placeholder="HR Manager"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  data-ocid="recruiter-register.designation.input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #39D98A, #10B981)",
                boxShadow: "0 4px 20px rgba(57,217,138,0.3)",
              }}
              data-ocid="recruiter-register.submit.button"
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate({ to: "/recruiter-login" })}
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: "#39D98A" }}
                data-ocid="recruiter-register.login.link"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
