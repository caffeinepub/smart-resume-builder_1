import { ChevronDown, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

const STORAGE_KEY = "aiChatHistory";
const MAX_MESSAGES = 50;

const QUICK_CHIPS = [
  "Resume tips",
  "How to improve ATS score?",
  "Best free certifications",
  "Interview preparation",
  "Career roadmap",
  "Skill tracker help",
  "Mock interview tips",
  "View my profile",
];

function getAIResponse(input: string): string {
  const q = input.toLowerCase();

  if (/\b(hi|hello|hey|helo|hii)\b/.test(q)) {
    return "Hello! I'm your AI Career Assistant 🤖 I can help with resume tips, ATS optimization, skill recommendations, certifications, interview prep, and career guidance. What would you like to know?";
  }
  if (
    /resume.*(tip|advice|help|kaise|improve|better|write|format|banana)/.test(
      q,
    ) ||
    /tip.*resume/.test(q)
  ) {
    return "📄 ATS-Friendly Resume Tips:\n• Use bullet points for clarity\n• Match keywords from the job description\n• Keep it 1–2 pages\n• Use standard headings: Education, Experience, Skills, Projects\n• Avoid images, tables, and fancy fonts\n• Use a clean single-column layout\n• Quantify achievements (e.g., 'Improved performance by 30%')";
  }
  if (/ats.*(score|improve|optimize|increase|kaise|kya)|score.*ats/.test(q)) {
    return "📊 How ATS Score Works:\n• ATS scans for keywords matching the job description\n• Use proper section headings (not creative names)\n• Avoid images, columns, and tables\n• Save resume as PDF or DOCX\n• Aim for 70+ score to pass ATS filters\n\nUse the ATS Analyzer page on this platform to check your score!";
  }
  if (/\b(skill|learn|technology|tech|kya seekhu|kya sikhun)/.test(q)) {
    if (/data.?sci|machine.?learn|ml|ai/.test(q)) {
      return "🤖 Top Skills for AI/ML & Data Science:\n• Python, NumPy, Pandas, Matplotlib\n• Scikit-learn, TensorFlow, PyTorch\n• SQL & NoSQL Databases\n• Statistics & Linear Algebra\n• Jupyter Notebook, Google Colab\n• Tableau / Power BI for visualization";
    }
    if (/cyber|security|hacking|ethical/.test(q)) {
      return "🔒 Top Cybersecurity Skills:\n• Networking fundamentals (TCP/IP, DNS)\n• Linux OS & command line\n• Ethical Hacking & Penetration Testing\n• OWASP Top 10 vulnerabilities\n• Kali Linux, Wireshark, Metasploit\n• Certifications: CEH, CompTIA Security+, CISSP";
    }
    return "💻 Top Web Development Skills:\n• HTML, CSS, JavaScript (must-have)\n• React.js / Next.js (Frontend)\n• Node.js / Express (Backend)\n• MongoDB / MySQL / PostgreSQL\n• Git & GitHub\n• REST APIs & JSON\n• Responsive Design & Tailwind CSS";
  }
  if (
    /interview.*(prep|practice|tips|kaise|ready|question)|interview/.test(q)
  ) {
    return "🎯 Interview Preparation Guide:\n• Practice DSA on LeetCode / HackerRank daily\n• Review system design basics (for SDE roles)\n• Prepare STAR method answers for behavioral Qs\n• Know your resume inside-out\n• Practice common HR questions\n• Mock interviews on Pramp or interviewing.io\n• Research the company before the interview";
  }
  if (/certif|course|free.*(learn|course)|google.*cert|aws.*cert/.test(q)) {
    return "🏆 Best Free Certifications:\n• Google Digital Garage – Digital Marketing\n• AWS Skill Builder – Cloud fundamentals\n• Microsoft Learn – Azure, Power BI, more\n• IBM SkillsBuild – AI, Data, Cybersecurity\n• freeCodeCamp – Web Dev, Data Analysis\n• Coursera (audit free) – Top university courses\n• NPTEL – IIT/IISc courses (free)\n• Cisco Networking Academy – Networking/Security\n\nAll are free and recognized by employers!";
  }
  if (/job|internship|placement|apply|naukri|linkedin|portal/.test(q)) {
    return "💼 Job Search Strategy:\n• Best Platforms: LinkedIn, Internshala, Naukri, Indeed, Wellfound (startups), AngelList\n• Apply to 5–10 jobs per day with customized resumes\n• Use referrals — they have 10x higher success rate\n• Set up job alerts for your target roles\n• Follow target companies on LinkedIn\n• Optimize your LinkedIn profile with keywords";
  }
  if (/project|portfolio|build|github|showcase/.test(q)) {
    return "🚀 Strong Portfolio Projects for CSE:\n• Full-stack Web App (React + Node.js + DB)\n• REST API with Authentication\n• ML/AI Model (image classification, chatbot)\n• Mobile App (React Native / Flutter)\n• Open Source contributions on GitHub\n\nHosting: Vercel, Netlify, Render (all free)\nAlways add a README and live demo link!";
  }
  if (/skill.?tracker|track.?skill/.test(q)) {
    return "\ud83d\udcca Skill Progress Tracker:\nGo to Skill Tracker in the sidebar to:\n\u2022 Add any skill you're learning\n\u2022 Set status: Learning (33%) / Practicing (66%) / Completed (100%)\n\u2022 See visual progress bars for each skill\n\u2022 Get notified when you complete a skill!";
  }
  if (/mock.?interview|practice.?interview/.test(q)) {
    return "\ud83c\udfa4 Mock Interview Mode:\nGo to Mock Interview (/mock-interview):\n\u2022 10 mixed HR + Technical questions\n\u2022 60-second timer per question\n\u2022 Type answer, then see model answer & tips\n\u2022 Summary with score at the end\n\nRegular practice = better confidence!";
  }
  if (/\bmy profile\b|\bprofile page\b|view.*profile/.test(q)) {
    return "\ud83d\udc64 Your Profile Page (/profile):\n\u2022 Set Full Name, Mobile, Career Goal\n\u2022 Add your LinkedIn URL\n\u2022 Write your About Me section\n\u2022 See stats: Skills, Projects, Certifications\n\nYour profile syncs with your Resume Builder automatically!";
  }
  if (/interview.?prep|preparation.?hub/.test(q)) {
    return "\ud83c\udfaf Interview Prep Hub (/interview-prep):\n4 Question Banks:\n\u2022 HR Questions - Tell me about yourself...\n\u2022 Technical - OOP, REST APIs, Docker...\n\u2022 Coding - Linked list, binary search...\n\u2022 System Design - URL shortener, CAP theorem...\n\nUse Generate Random Question for surprise practice!";
  }
  if (/roadmap|path|career|guide|step|kahan se shuru/.test(q)) {
    return "🗺️ Career Roadmap for CSE Students:\n\n1️⃣ Learn Fundamentals – Programming, DSA, CS basics\n2️⃣ Pick a Domain – Web Dev, AI/ML, Cybersecurity, etc.\n3️⃣ Build 3–5 Projects – Show real-world skills\n4️⃣ Earn Certifications – Google, AWS, Microsoft\n5️⃣ Create Resume – ATS-friendly, 1 page for freshers\n6️⃣ Practice Interviews – LeetCode, mock interviews\n7️⃣ Apply for Jobs – LinkedIn, Naukri, Internshala";
  }

  return "🤔 I can help you with:\n• 📄 Resume tips & formatting\n• 📊 ATS score improvement\n• 💻 Skill recommendations\n• 🏆 Free certifications\n• 🎯 Interview preparation\n• 💼 Job search strategy\n• 🚀 Portfolio projects\n• 🗺️ Career roadmap\n\nPlease ask a specific question and I'll guide you!";
}

function loadHistory(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(-MAX_MESSAGES) : [];
  } catch {
    return [];
  }
}

function saveHistory(msgs: Message[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(msgs.slice(-MAX_MESSAGES)),
    );
  } catch {
    // ignore
  }
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = (role: "user" | "assistant", text: string) => {
    const msg: Message = {
      id: `${Date.now()}-${role}`,
      role,
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => {
      const next = [...prev, msg];
      saveHistory(next);
      return next;
    });
    return msg;
  };

  const handleSend = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput("");
    addMessage("user", q);
    setTyping(true);
    setTimeout(
      () => {
        setTyping(false);
        addMessage("assistant", getAIResponse(q));
      },
      700 + Math.random() * 400,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-0"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: open
            ? "0 0 0 0px rgba(168,85,247,0)"
            : [
                "0 0 0 0px rgba(168,85,247,0.4)",
                "0 0 0 12px rgba(168,85,247,0)",
                "0 0 0 0px rgba(168,85,247,0)",
              ],
        }}
        transition={{
          repeat: open ? 0 : Number.POSITIVE_INFINITY,
          duration: 2.5,
        }}
        aria-label="AI Career Assistant"
        data-ocid="ai_assistant.open_modal_button"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: "380px",
              height: "520px",
              background: "linear-gradient(180deg, #1a1040 0%, #0f0a2e 100%)",
              border: "1px solid rgba(168,85,247,0.3)",
            }}
            data-ocid="ai_assistant.dialog"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                borderBottom: "1px solid rgba(168,85,247,0.3)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    AI Career Assistant
                  </p>
                  <p className="text-purple-200 text-xs">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  className="text-purple-200 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  data-ocid="ai_assistant.close_button"
                  aria-label="Close"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(168,85,247,0.3) transparent",
              }}
            >
              {messages.length === 0 && !typing && (
                <div className="flex flex-col items-center justify-center h-full gap-4 pb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(168,85,247,0.2)" }}
                  >
                    <Sparkles size={28} className="text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">
                      AI Career Assistant
                    </p>
                    <p className="text-purple-300 text-xs mt-1">
                      Ask me anything about your career!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95"
                        style={{
                          borderColor: "rgba(168,85,247,0.5)",
                          color: "#c084fc",
                          background: "rgba(168,85,247,0.1)",
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1"
                      style={{ background: "rgba(168,85,247,0.3)" }}
                    >
                      <Sparkles size={12} className="text-purple-300" />
                    </div>
                  )}
                  <div
                    className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line"
                    style={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                          : "rgba(255,255,255,0.07)",
                      color: "#f0e6ff",
                      border:
                        msg.role === "assistant"
                          ? "1px solid rgba(168,85,247,0.2)"
                          : "none",
                      borderTopRightRadius:
                        msg.role === "user" ? "4px" : undefined,
                      borderTopLeftRadius:
                        msg.role === "assistant" ? "4px" : undefined,
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1"
                    style={{ background: "rgba(168,85,247,0.3)" }}
                  >
                    <Sparkles size={12} className="text-purple-300" />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(168,85,247,0.2)",
                    }}
                  >
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-purple-400"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 0.8,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div
              className="px-3 py-3 shrink-0 flex items-center gap-2"
              style={{
                borderTop: "1px solid rgba(168,85,247,0.2)",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about resume, jobs, skills..."
                className="flex-1 bg-white/5 border border-purple-800/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-purple-400/60 outline-none focus:border-purple-500 transition-colors"
                data-ocid="ai_assistant.input"
              />
              <motion.button
                onClick={() => handleSend()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                }}
                data-ocid="ai_assistant.submit_button"
              >
                <Send size={14} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
