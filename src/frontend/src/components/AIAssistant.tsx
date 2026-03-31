import { ChevronDown, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getUserStream } from "../utils/auth";
import { getStreamById } from "../utils/streamData";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

const STORAGE_KEY = "aiChatHistory";
const MAX_MESSAGES = 50;

function getStreamQuickChips(stream: string): string[] {
  switch (stream) {
    case "mechanical":
      return [
        "How to prepare for core mechanical interviews?",
        "Best CAD tools for beginners?",
        "AutoCAD vs SolidWorks — which to learn first?",
        "Mechanical engineering certifications",
        "How to get into automobile sector?",
      ];
    case "electrical":
      return [
        "How to become an embedded engineer?",
        "PLC vs Arduino — what to learn?",
        "Best certifications for electrical engineers",
        "VLSI vs Power Systems — which career path?",
        "How to crack PSU exams?",
      ];
    case "mba":
      return [
        "How to crack MBA placement interviews?",
        "What skills do Product Managers need?",
        "Best resources for business analysis?",
        "Digital marketing career path",
        "How to become a product manager?",
      ];
    case "medical":
      return [
        "How to enter clinical research?",
        "What is GCP certification?",
        "Healthcare IT career path",
        "Best certifications for medical professionals",
        "Clinical Research vs Healthcare Administration",
      ];
    case "commerce":
      return [
        "CA vs CMA — which to choose?",
        "How to prepare for banking exams?",
        "Best financial modeling courses",
        "GST certification value in career",
        "Investment banking career path",
      ];
    case "civil":
      return [
        "AutoCAD Civil 3D vs Revit — which to learn?",
        "How to get government civil engineering jobs?",
        "STAAD Pro tutorial resources",
        "Civil engineering certifications",
        "How to become a structural engineer?",
      ];
    case "arts":
      return [
        "How to build a design portfolio?",
        "Figma vs Adobe XD for beginners?",
        "How to get freelance design clients?",
        "UX research methods for beginners",
        "Best free design learning resources",
      ];
    default: // cse
      return [
        "Resume tips",
        "How to improve ATS score?",
        "Best free certifications",
        "Interview preparation",
        "Career roadmap",
        "Skill tracker help",
        "Mock interview tips",
        "View my profile",
      ];
  }
}

function getStreamAIResponse(input: string, stream: string): string {
  const q = input.toLowerCase();
  const streamDef = getStreamById(stream);
  const streamLabel = streamDef.label;

  // General greetings
  if (/\b(hi|hello|hey|helo|hii)\b/.test(q)) {
    return `Hello! I'm your AI Career Assistant 🤖 I'm configured for ${streamLabel} careers. I can help with resume tips, ATS optimization, skill recommendations, certifications, interview prep, and career guidance. What would you like to know?`;
  }

  // Stream-specific responses
  if (stream === "mechanical") {
    if (/cad|autocad|solidworks|catia/.test(q)) {
      return `📐 Top CAD Tools for Mechanical Engineers:
• AutoCAD — 2D drafting (must-know)
• SolidWorks — 3D modeling (industry standard)
• CATIA — Aerospace/automotive design
• ANSYS — FEA simulation
• MATLAB/Simulink — system simulation

Start with AutoCAD + SolidWorks for most core sector jobs.`;
    }
    if (/interview|core|mechanical/.test(q)) {
      return `🎯 Core Mechanical Interview Topics:
• Engineering Drawing & GD&T
• Thermodynamics & Heat Transfer
• Fluid Mechanics basics
• Manufacturing Processes (casting, forging, welding)
• Machine Design principles
• Lean Manufacturing & Six Sigma
• CAD tool proficiency

Also prepare for aptitude tests for PSU/GATE exams.`;
    }
    if (/certif|course/.test(q)) {
      return `🏆 Certifications for Mechanical Engineers:
• SolidWorks CSWA/CSWP
• AutoCAD Certified Professional
• Six Sigma Green Belt (free on Coursera)
• MATLAB Onramp (free at MathWorks)
• Lean Manufacturing (free on Coursera)
• CATIA V5 Certification (Dassault)

These add real value to your resume!`;
    }
  }

  if (stream === "electrical") {
    if (/embedded|microcontroller|plc|arduino/.test(q)) {
      return `💻 Embedded vs PLC Career Paths:
• Embedded Engineering: C/C++, RTOS, Microcontrollers (ARM, AVR), PCB Design
• PLC/SCADA Engineering: Ladder logic, Siemens TIA Portal, industrial automation

For beginners: Start with Arduino → then Raspberry Pi → then industrial PLCs
For career: RTOS + ARM Cortex M is most in-demand.`;
    }
    if (/vlsi|fpga|verilog/.test(q)) {
      return `📱 VLSI Career Path:
• Learn: Digital Electronics, Verilog/VHDL
• Practice: Xilinx Vivado, ModelSim
• FPGA programming on actual boards
• Top companies: Intel, Qualcomm, MediaTek, NVIDIA
• Certifications: Xilinx certification, Coursera VLSI courses

Gate exam is the best entry path for PSU electrical jobs.`;
    }
  }

  if (stream === "mba") {
    if (/product.?manager|pm/.test(q)) {
      return `📦 How to Become a Product Manager:
1. Build domain knowledge in tech or business
2. Learn: Agile, Jira, Roadmapping, A/B testing
3. Practice: Mock PRDs, case studies, PM interviews
4. Certifications: Google PM, Coursera Product Management
5. Portfolio: Case studies of products you'd improve

Interview tip: Use CIRCLES framework for product design questions.`;
    }
    if (/digital.?market|seo|social.?media/.test(q)) {
      return `📊 Digital Marketing Career Path:
• Start: Google Digital Garage (free cert)
• Learn: SEO, SEM, Social Media Marketing
• Tools: Google Analytics, HubSpot, SEMrush, Hootsuite
• Practice: Build a blog or social page
• Certifications: Google Ads, HubSpot, Meta Blueprint (all free)

Freelancing is excellent entry point for freshers!`;
    }
    if (/business.?anal|ba|sql|tableau/.test(q)) {
      return `📊 Business Analyst Skills to Master:
• SQL — data querying (essential)
• Excel — data analysis and reporting
• Tableau/Power BI — visualization
• BPMN — process modeling
• Communication — stakeholder management
• Certifications: CBAP (IIBA), Coursera Business Analysis`;
    }
  }

  if (stream === "medical") {
    if (/clinical.?research|gcp|trial/.test(q)) {
      return `🦷 Clinical Research Career Path:
• Learn GCP (Good Clinical Practice) — free ICH guidelines
• Study Clinical Trial phases (I-IV)
• Learn CTMS software (Medidata Rave)
• Certifications: SCORECR, CCRP (SOCRA)
• Entry roles: CRA, Clinical Data Associate, Site Coordinator

Top companies: IQVIA, PPD, Syneos, Covance.`;
    }
    if (/medical.?cod|icd|cpt/.test(q)) {
      return `📝 Medical Coding Career:
• Learn: ICD-10-CM, CPT, HCPCS code sets
• Certification: CPC (AAPC) — most recognized
• Practice on: AAPC Mock Exams
• Tools: 3M Encoder, Optum360
• Work from home: Medical coding is highly remote-friendly!

Freshers can get certified in 3-6 months.`;
    }
  }

  if (stream === "commerce") {
    if (/ca|cma|accountant|chartered/.test(q)) {
      return `💼 CA vs CMA — Career Comparison:

CA (Chartered Accountant):
• More rigorous, 3-4 years
• Audit, taxation, financial reporting
• Best for Big 4, corporate finance

CMA (Cost Management Accountant):
• Focus on costing and management accounting
• Manufacturing and industry focused
• 3-year program

Both are excellent! CA has broader scope.`;
    }
    if (/banking|ibps|bank.?exam/.test(q)) {
      return `🏦 Banking Exam Preparation:
• IBPS PO/Clerk — most common exam
• SBI PO/Clerk — prestigious
• Topics: English, Reasoning, Quantitative Aptitude, GK/Banking Awareness
• Best resources: Adda247, Oliveboard, Testbook
• Daily practice: 2-3 mock tests

Financial products knowledge + communication skills are key.`;
    }
  }

  if (stream === "arts") {
    if (/figma|ux|ui|design/.test(q)) {
      return `🎨 UI/UX Design Career Path:
• Learn: Figma (free), Adobe XD, wireframing
• Study: UX research, user journey maps, design systems
• Portfolio: 3-5 strong case studies on Behance/Dribbble
• Certifications: Google UX Design (Coursera, free audit)

Figma is the industry standard — learn it first!
Showcase problem-solving, not just pretty screens.`;
    }
    if (/portfolio|behance|dribbble|freelanc/.test(q)) {
      return `💼 Building a Creative Portfolio:
• Use Behance or personal website
• Show 3-5 complete projects with process
• Include: research → wireframe → prototype → final
• Write case studies explaining your decisions
• Keep updating with new work

Freelancing: Upwork, Fiverr, and 99designs are good starting points.`;
    }
  }

  // Universal responses
  if (
    /resume.*(tip|advice|help|improve|better|write|format)/.test(q) ||
    /tip.*resume/.test(q)
  ) {
    return `📄 ATS-Friendly Resume Tips for ${streamLabel}:
• Highlight domain-specific technical skills prominently
• Use bullet points with action verbs
• Match keywords from job descriptions in your field
• Keep it 1-2 pages
• Use standard headings: Education, Experience, Skills, Projects
• Quantify achievements where possible
• Avoid images, tables, and fancy fonts for ATS compatibility`;
  }

  if (/ats.*(score|improve|optimize|increase)|score.*ats/.test(q)) {
    const keywords = getStreamById(stream).atsKeywords.slice(0, 6).join(", ");
    return `📊 ATS Score Optimization for ${streamLabel}:
• Key keywords for your field: ${keywords}
• Use proper section headings
• Avoid images, columns, and tables
• Save resume as PDF
• Aim for 70+ score to pass ATS filters

Use the ATS Analyzer page to check your score!`;
  }

  if (/certif|course|free.*(learn|course)/.test(q)) {
    return `🏆 Best Free Certifications for ${streamLabel}:
• Coursera (audit free) — domain-specific courses
• Google Digital Garage — business/digital skills
• Microsoft Learn — tech certifications
• NPTEL — IIT/IISc courses (all domains)
• LinkedIn Learning — professional skills
• Domain-specific platforms based on your stream

Check the Free Certifications page for curated links!`;
  }

  if (/job|internship|placement|apply|portal/.test(q)) {
    const portals = getStreamById(stream)
      .jobPortals.map((p) => p.name)
      .join(", ");
    return `💼 Job Search Strategy for ${streamLabel}:
• Best platforms for your stream: ${portals}
• Apply to 5-10 jobs per day with tailored resumes
• Use referrals — they have 10x higher success rate
• Set up job alerts for your target roles
• Check the Jobs & Internships page for direct links!`;
  }

  if (/interview.*(prep|practice|tips|ready|question)|interview/.test(q)) {
    return `🎯 Interview Preparation Guide for ${streamLabel}:
• Research domain-specific technical topics
• Prepare STAR method answers for behavioral questions
• Practice common HR questions
• Know your resume inside-out
• Research the company before the interview
• Use Mock Interview Mode on this platform for practice!

Check Interview Prep Hub for curated question banks.`;
  }

  if (/skill|learn|technology|tech/.test(q)) {
    const topSkills =
      getStreamById(stream).roles[0]?.requiredSkills.slice(0, 5).join(", ") ??
      "domain skills";
    return `📚 Top Skills to Master for ${streamLabel}:
• Core skills: ${topSkills}
• Check Role Eligibility page for detailed skill requirements
• Use Learning Resources page for free tutorials & certifications
• Track your progress in Skill Tracker

Start with foundational skills before advancing to specialized tools.`;
  }

  if (/roadmap|path|career|guide|step/.test(q)) {
    return `🗺️ Career Roadmap for ${streamLabel}:

1️⃣ Learn Fundamentals — core concepts of your domain
2️⃣ Master Key Tools — industry-standard software/tools
3️⃣ Build Projects — show real-world problem solving
4️⃣ Earn Certifications — domain-recognized certificates
5️⃣ Create Resume — ATS-friendly, highlight domain keywords
6️⃣ Practice Interviews — technical + behavioral rounds
7️⃣ Apply Strategically — use stream-specific portals

Check the Career Roadmap page for a visual step-by-step guide!`;
  }

  if (/skill.?tracker|track.?skill/.test(q)) {
    return `📊 Skill Progress Tracker:
Go to Skill Tracker in the sidebar to:
• Add skills you're learning
• Set status: Learning (33%) / Practicing (66%) / Completed (100%)
• See visual progress bars
• Track your ${streamLabel} skill development!`;
  }

  if (/mock.?interview|practice.?interview/.test(q)) {
    return `🎤 Mock Interview Mode:
Go to Mock Interview (/mock-interview):
• HR + Technical questions
• 60-second timer per question
• Type your answer, then see model answer
• Get feedback and score at the end

Regular practice = better confidence in real interviews!`;
  }

  return `🤔 I'm your AI Career Assistant for ${streamLabel}! I can help with:
• 📄 Resume tips & ATS optimization
• 📊 Skill recommendations for your domain
• 🏆 Free certifications & learning resources
• 🎯 Interview preparation
• 💼 Job search strategy
• 🗺️ Career roadmap guidance

Please ask a specific question and I'll guide you!`;
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

  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);
  const quickChips = getStreamQuickChips(userStream);

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
        addMessage("assistant", getStreamAIResponse(q, userStream));
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
                  <p className="text-purple-200 text-xs">
                    {streamDef.label} specialist
                  </p>
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
                      Specialized for {streamDef.label}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickChips.map((chip) => (
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
                placeholder={`Ask about ${streamDef.label} careers...`}
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
