import { MessageSquare, Shuffle } from "lucide-react";
import { useState } from "react";
import AppShell from "../components/AppShell";

const QUESTION_BANK: Record<string, string[]> = {
  "HR Questions": [
    "Tell me about yourself.",
    "Why do you want to join our company?",
    "Where do you see yourself in 5 years?",
    "What are your greatest strengths?",
    "What are your weaknesses and how do you address them?",
    "Describe a challenging project you worked on and how you handled it.",
    "Why are you leaving your current job / Why are you looking for a new opportunity?",
    "How do you handle pressure and tight deadlines?",
    "Tell me about a time you worked effectively in a team.",
    "What motivates you to perform your best at work?",
  ],
  "Technical Questions": [
    "Explain the four pillars of Object-Oriented Programming (OOP).",
    "What is a REST API and how does it work?",
    "What is the difference between SQL and NoSQL databases?",
    "Explain the SOLID principles in software development.",
    "What is Docker and why is it used?",
    "Explain microservices architecture and its advantages.",
    "What is CI/CD and why is it important?",
    "What is the difference between authentication and authorization?",
    "Explain the concept of Big O notation.",
    "What is version control and how does Git work?",
  ],
  "Coding Questions": [
    "Write a function to reverse a linked list.",
    "Check if a given string is a palindrome.",
    "Find the duplicate number in an array of n integers.",
    "Implement binary search on a sorted array.",
    "Print the Fibonacci series up to n terms.",
    "Solve the Two Sum problem: find indices of two numbers that add to a target.",
    "Write code to check if two strings are anagrams.",
    "Implement a stack using two queues.",
    "Find the maximum subarray sum (Kadane's Algorithm).",
    "Write a function to flatten a nested array.",
  ],
  "System Design": [
    "How would you design a URL shortener like bit.ly?",
    "Design a real-time chat system like WhatsApp.",
    "How does DNS work? Explain the resolution process.",
    "Explain load balancing and different load balancing strategies.",
    "What is the CAP theorem? Give examples.",
    "How would you design a scalable notification system?",
    "Explain database sharding and when you would use it.",
    "How would you design a rate limiter for an API?",
    "What is caching? Explain Redis vs Memcached.",
    "How would you design an e-commerce product search system?",
  ],
};

const TABS = Object.keys(QUESTION_BANK);

const TAB_ICONS: Record<string, string> = {
  "HR Questions": "👤",
  "Technical Questions": "⚙️",
  "Coding Questions": "💻",
  "System Design": "🏗️",
};

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [randomQuestion, setRandomQuestion] = useState<string | null>(null);

  const questions = QUESTION_BANK[activeTab];

  const generateRandom = () => {
    const pool = QUESTION_BANK[activeTab];
    const q = pool[Math.floor(Math.random() * pool.length)];
    setRandomQuestion(q);
    const el = document.getElementById("random-question-card");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <AppShell title="Interview Prep" subtitle="Prepare for your dream job">
      <div className="max-w-4xl mx-auto" data-ocid="interview_prep.page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            Interview Preparation Hub
          </h1>
          <p className="text-white/40 text-sm">
            Master HR, Technical, Coding & System Design questions
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex flex-wrap gap-2 mb-6"
          data-ocid="interview_prep.filter.tab"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setRandomQuestion(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
              data-ocid={`interview_prep.${tab.toLowerCase().replace(/ /g, "_")}.tab`}
            >
              <span>{TAB_ICONS[tab]}</span> {tab}
            </button>
          ))}
        </div>

        {/* Random Question Generator */}
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={generateRandom}
            className="btn-primary flex items-center gap-2"
            data-ocid="interview_prep.random.button"
          >
            <Shuffle size={16} /> 🎲 Generate Random Question
          </button>
          <span className="text-white/30 text-sm">
            {questions.length} questions in this section
          </span>
        </div>

        {/* Random Question Highlight */}
        {randomQuestion && (
          <div
            id="random-question-card"
            className="mb-6 p-5 rounded-2xl border-2 animate-fade-in-up"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,92,255,0.2), rgba(53,208,199,0.1))",
              borderColor: "rgba(124,92,255,0.5)",
            }}
            data-ocid="interview_prep.random.card"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-purple-400" />
              <span className="text-purple-300 text-xs font-semibold uppercase tracking-wider">
                Random Question
              </span>
            </div>
            <p className="text-white font-semibold text-lg leading-relaxed">
              {randomQuestion}
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-3" data-ocid="interview_prep.list">
          {questions.map((q, i) => (
            <div
              key={q}
              className="glass-card p-4 flex gap-4 items-start animate-fade-in-up glass-card-hover"
              style={{ animationDelay: `${i * 0.04}s` }}
              data-ocid={`interview_prep.item.${i + 1}`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                style={{ background: "rgba(124,92,255,0.2)", color: "#A78BFA" }}
              >
                {i + 1}
              </div>
              <p className="text-white/85 text-sm leading-relaxed">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
