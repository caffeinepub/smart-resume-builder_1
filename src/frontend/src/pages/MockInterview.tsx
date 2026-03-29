import { CheckCircle2, Clock, Mic, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { addNotification, updateStreak } from "../utils/extras";

const QUESTIONS: Array<{ q: string; tips: string }> = [
  {
    q: "Tell me about yourself and your background.",
    tips: "Structure: Present → Past → Future. Keep it under 2 minutes. Focus on professional highlights.",
  },
  {
    q: "What is the difference between a stack and a queue? Explain with an example.",
    tips: "Stack: LIFO (undo operations, function call stack). Queue: FIFO (task scheduling, print queue). Mention time complexity for operations.",
  },
  {
    q: "Describe a project you built and what technical challenges you faced.",
    tips: "Use STAR method. Mention specific technologies, the problem, your solution, and measurable results.",
  },
  {
    q: "Explain the concept of RESTful APIs. What HTTP methods do you commonly use?",
    tips: "Cover: GET, POST, PUT/PATCH, DELETE. Mention statelessness, resource URIs, status codes (200, 201, 400, 404, 500).",
  },
  {
    q: "What is your greatest professional weakness and how are you improving it?",
    tips: "Be honest but strategic. Name a real weakness, show self-awareness, and describe concrete steps you're taking to improve.",
  },
  {
    q: "How would you find if a string contains only unique characters?",
    tips: "Options: HashSet O(n) space, sort+compare O(n log n), bitwise O(1). Discuss trade-offs.",
  },
  {
    q: "Why do you want to work in this company/role?",
    tips: "Research the company. Align their mission with your goals. Mention specific products, culture, or growth opportunities.",
  },
  {
    q: "What is the difference between SQL JOIN types? Give examples.",
    tips: "INNER JOIN: matching rows both tables. LEFT JOIN: all from left + matching right. RIGHT JOIN: opposite. FULL OUTER JOIN: all rows both sides.",
  },
  {
    q: "Explain how you would handle a disagreement with a teammate.",
    tips: "Show communication skills. Describe listening first, finding common ground, escalating if needed, and focusing on project goals.",
  },
  {
    q: "Write pseudocode to reverse a linked list.",
    tips: "Use three pointers: prev=null, curr=head, next. Iterate: save next, point curr.next to prev, move prev=curr, curr=next. Return prev.",
  },
];

const TOTAL = QUESTIONS.length;
const TIME_PER_Q = 60;

export default function MockInterview() {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [done, setDone] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (!submitted) setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (started && !submitted && !done) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, currentIdx, submitted]);

  const handleStart = () => {
    setStarted(true);
    setCurrentIdx(0);
    setAnswer("");
    setSubmitted(false);
    setTimeLeft(TIME_PER_Q);
    setAnsweredCount(0);
    setDone(false);
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
    if (answer.trim()) setAnsweredCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= TOTAL) {
      setDone(true);
      updateStreak();
      addNotification("🎤 Mock Interview completed! Great practice!");
      toast.success("Mock Interview complete! 🎉");
      return;
    }
    setCurrentIdx((i) => i + 1);
    setAnswer("");
    setSubmitted(false);
    setTimeLeft(TIME_PER_Q);
  };

  const handleRestart = () => {
    setStarted(false);
    setDone(false);
    setCurrentIdx(0);
    setAnswer("");
    setSubmitted(false);
    setTimeLeft(TIME_PER_Q);
    setAnsweredCount(0);
  };

  const question = QUESTIONS[currentIdx];
  const timeColor =
    timeLeft <= 15 ? "#EF4444" : timeLeft <= 30 ? "#F59E0B" : "#39D98A";

  return (
    <AppShell
      title="Mock Interview"
      subtitle="Simulate real interview conditions"
    >
      <div className="max-w-3xl mx-auto" data-ocid="mock_interview.page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            Mock Interview Mode
          </h1>
          <p className="text-white/40 text-sm">
            Simulated interview with timer — answer like a real interview
          </p>
        </div>

        {!started && !done && (
          <div
            className="glass-card p-10 text-center"
            data-ocid="mock_interview.start.panel"
          >
            <div className="w-20 h-20 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mx-auto mb-5">
              <Mic size={36} className="text-purple-400" />
            </div>
            <h2 className="text-white font-bold text-xl mb-3">
              Ready for Mock Interview?
            </h2>
            <p className="text-white/50 text-sm mb-2">
              • {TOTAL} mixed questions (HR + Technical)
            </p>
            <p className="text-white/50 text-sm mb-2">
              • 60 seconds per question
            </p>
            <p className="text-white/50 text-sm mb-6">
              • Model answers revealed after each submission
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="btn-primary px-8 py-3 text-base flex items-center gap-2 mx-auto"
              data-ocid="mock_interview.start.button"
            >
              <Mic size={18} /> Start Mock Interview
            </button>
          </div>
        )}

        {started && !done && (
          <div className="space-y-4">
            {/* Progress + Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm">Question</span>
                <span className="text-white font-bold text-lg">
                  {currentIdx + 1}
                </span>
                <span className="text-white/30 text-sm">/ {TOTAL}</span>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm"
                style={{
                  color: timeColor,
                  borderColor: `${timeColor}40`,
                  background: `${timeColor}10`,
                }}
                data-ocid="mock_interview.timer"
              >
                <Clock size={14} />
                {timeLeft}s
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${(currentIdx / TOTAL) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div
              className="glass-card p-6"
              style={{ borderColor: "rgba(124,92,255,0.3)" }}
              data-ocid="mock_interview.question.card"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
                  style={{
                    background: "rgba(124,92,255,0.2)",
                    color: "#A78BFA",
                  }}
                >
                  Q{currentIdx + 1}
                </div>
                <span className="text-purple-300 text-xs font-semibold uppercase tracking-wider">
                  Interview Question
                </span>
              </div>
              <p className="text-white font-semibold text-lg leading-relaxed">
                {question.q}
              </p>
            </div>

            {/* Answer Area */}
            {!submitted ? (
              <div>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors resize-none"
                  data-ocid="mock_interview.answer.textarea"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary mt-3 flex items-center gap-2"
                  data-ocid="mock_interview.submit_button"
                >
                  <CheckCircle2 size={16} /> Submit Answer
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {answer.trim() && (
                  <div className="glass-card p-4">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                      Your Answer
                    </p>
                    <p className="text-white/75 text-sm leading-relaxed">
                      {answer}
                    </p>
                  </div>
                )}
                <div
                  className="p-5 rounded-2xl border"
                  style={{
                    background: "rgba(57,217,138,0.08)",
                    borderColor: "rgba(57,217,138,0.25)",
                  }}
                  data-ocid="mock_interview.feedback.card"
                >
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    💡 Model Answer / Tips
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {question.tips}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-2"
                  data-ocid="mock_interview.next.button"
                >
                  {currentIdx + 1 >= TOTAL
                    ? "Finish Interview"
                    : "Next Question →"}
                </button>
              </div>
            )}
          </div>
        )}

        {done && (
          <div
            className="glass-card p-10 text-center"
            data-ocid="mock_interview.summary.card"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={36} className="text-green-400" />
            </div>
            <h2 className="text-white font-bold text-2xl mb-2">
              Interview Complete! 🎉
            </h2>
            <p className="text-white/50 text-sm mb-4">
              You answered{" "}
              <span className="text-white font-bold">{answeredCount}</span> out
              of <span className="text-white font-bold">{TOTAL}</span> questions
            </p>
            <div
              className="p-4 rounded-2xl mb-6 text-sm text-white/70"
              style={{
                background: "rgba(124,92,255,0.1)",
                border: "1px solid rgba(124,92,255,0.2)",
              }}
            >
              {answeredCount >= 8
                ? "🌟 Excellent! You're well-prepared. Review model answers and keep practicing!"
                : answeredCount >= 5
                  ? "👍 Good effort! Focus on the questions you skipped and build confidence."
                  : "💪 Keep practicing! Consistency is key to interview success."}
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="btn-primary flex items-center gap-2 mx-auto"
              data-ocid="mock_interview.restart.button"
            >
              <RotateCcw size={16} /> Practice Again
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
