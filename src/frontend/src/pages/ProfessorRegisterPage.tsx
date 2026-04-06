import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Brain, Building2, Lock, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  isProfessorRegistered,
  registerProfessor,
  setCurrentRole,
  setProfessorAuth,
} from "../utils/roleAuth";

const DEPARTMENTS = [
  "Computer Science / IT",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Management / MBA",
  "Medical / Healthcare",
  "Commerce / Finance",
  "Arts / Design",
];

export default function ProfessorRegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    setError("");
    if (
      !name.trim() ||
      !phone.trim() ||
      !password ||
      !department ||
      !college.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }
    if (phone.trim().length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    if (isProfessorRegistered(phone.trim())) {
      setError("This phone number is already registered. Please sign in.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const profData = {
        name: name.trim(),
        phone: phone.trim(),
        department,
        college: college.trim(),
      };
      registerProfessor(phone.trim(), profData);
      localStorage.setItem(`prof_pass_${phone.trim()}`, password);
      setProfessorAuth(phone.trim(), profData);
      setCurrentRole("professor");
      toast.success(`Welcome, Prof. ${name.trim()}! 🎓`);
      navigate({ to: "/professor-dashboard" });
      setLoading(false);
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        backgroundColor: "#060B2A",
        backgroundImage:
          "radial-gradient(ellipse at 30% 50%, rgba(53,208,199,0.14) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,92,255,0.1) 0%, transparent 50%)",
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
          onClick={() => navigate({ to: "/professor-login" })}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
          data-ocid="professor-register.back.button"
        >
          <ArrowLeft size={15} />
          Back to Sign In
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #35D0C7, #14B8A6)" }}
          >
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              SMARTRESUME AI
            </span>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
              Professor Registration
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(53,208,199,0.25)",
            backdropFilter: "blur(12px)",
          }}
          data-ocid="professor-register.modal"
        >
          <h2 className="text-xl font-bold text-white mb-1">
            Create Professor Account
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Join as a professor and mentor students
          </p>

          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
              data-ocid="professor-register.error_state"
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
                  placeholder="Dr. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-ocid="professor-register.name.input"
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
                  data-ocid="professor-register.phone.input"
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
                  data-ocid="professor-register.password.input"
                />
              </div>
            </div>
            <div>
              <p className="label-dark">Department</p>
              <select
                className="input-dark"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                data-ocid="professor-register.department.select"
              >
                <option value="" disabled>
                  Select Department
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} style={{ background: "#0d1340" }}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="label-dark">College / Institution Name</p>
              <div className="relative">
                <Building2
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  className="input-dark pl-9"
                  placeholder="MIT College of Engineering"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  data-ocid="professor-register.college.input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #35D0C7, #14B8A6)",
                boxShadow: "0 4px 20px rgba(53,208,199,0.3)",
              }}
              data-ocid="professor-register.submit.button"
            >
              {loading ? "Creating account..." : "Create Professor Account"}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate({ to: "/professor-login" })}
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: "#35D0C7" }}
                data-ocid="professor-register.login.link"
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
