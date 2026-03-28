import {
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Timer,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AppShell from "../components/AppShell";

interface Question {
  q: string;
  options: string[];
  answer: number;
}

const QUESTION_BANK: Record<string, Question[]> = {
  Aptitude: [
    {
      q: "If 20% of a number is 50, what is the number?",
      options: ["200", "250", "300", "150"],
      answer: 1,
    },
    {
      q: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
      options: ["80", "75", "90", "70"],
      answer: 0,
    },
    {
      q: "What is the next number in the series: 2, 6, 12, 20, ?",
      options: ["28", "30", "32", "36"],
      answer: 1,
    },
    {
      q: "A can do a work in 10 days, B in 15 days. How many days to finish together?",
      options: ["5", "6", "7", "8"],
      answer: 1,
    },
    {
      q: "If 5 workers can build a wall in 12 days, 3 workers take:",
      options: ["15 days", "18 days", "20 days", "22 days"],
      answer: 2,
    },
    { q: "What is 15% of 240?", options: ["36", "34", "40", "32"], answer: 0 },
    {
      q: "Find the odd one out: 2, 3, 5, 7, 9, 11",
      options: ["9", "2", "11", "3"],
      answer: 0,
    },
    {
      q: "A shopkeeper sells an item at 20% profit. If cost is ₹500, selling price is:",
      options: ["₹550", "₹580", "₹600", "₹620"],
      answer: 2,
    },
    {
      q: "If BOOK is coded as 2-15-15-11, how is DOOR coded?",
      options: ["4-14-14-17", "4-15-15-18", "3-15-15-18", "4-15-14-17"],
      answer: 1,
    },
    {
      q: "Simple interest on ₹2000 for 3 years at 5% per annum is:",
      options: ["₹200", "₹250", "₹300", "₹350"],
      answer: 2,
    },
  ],
  Programming: [
    {
      q: "What is the output of: print(type(5/2)) in Python 3?",
      options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "Error"],
      answer: 1,
    },
    {
      q: "Which of these is a mutable data type in Python?",
      options: ["tuple", "string", "list", "int"],
      answer: 2,
    },
    {
      q: "What does 'typeof null' return in JavaScript?",
      options: ["'null'", "'undefined'", "'object'", "'boolean'"],
      answer: 2,
    },
    {
      q: "Which Python keyword is used to define a function?",
      options: ["func", "define", "def", "function"],
      answer: 2,
    },
    {
      q: "What is the output of: [1,2,3].length in JavaScript?",
      options: ["3", "2", "undefined", "Error"],
      answer: 0,
    },
    {
      q: "Which loop is guaranteed to execute at least once?",
      options: ["for", "while", "do-while", "foreach"],
      answer: 2,
    },
    {
      q: "What is the correct way to declare a constant in JavaScript?",
      options: ["var", "let", "const", "fixed"],
      answer: 2,
    },
    {
      q: "In Python, what does len([1,2,3,4]) return?",
      options: ["3", "4", "5", "Error"],
      answer: 1,
    },
    {
      q: "Which of these is NOT a Python data type?",
      options: ["dict", "set", "array", "tuple"],
      answer: 2,
    },
    {
      q: "What does === mean in JavaScript?",
      options: [
        "Assignment",
        "Equal value only",
        "Equal value and type",
        "Not equal",
      ],
      answer: 2,
    },
  ],
  "Web Development": [
    {
      q: "Which HTML tag is used for the largest heading?",
      options: ["<h6>", "<head>", "<h1>", "<header>"],
      answer: 2,
    },
    {
      q: "What does CSS stand for?",
      options: [
        "Computer Style Sheet",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Sheets",
      ],
      answer: 2,
    },
    {
      q: "Which CSS property controls text size?",
      options: ["text-style", "font-size", "text-size", "font-style"],
      answer: 1,
    },
    {
      q: "What is the correct HTML for adding a background color?",
      options: [
        "<body bg='yellow'>",
        "<body style='background-color:yellow'>",
        "<background>yellow</background>",
        "<body color='yellow'>",
      ],
      answer: 1,
    },
    {
      q: "Which JavaScript method is used to find an HTML element by id?",
      options: [
        "getElementById()",
        "getElement()",
        "findElementById()",
        "queryById()",
      ],
      answer: 0,
    },
    {
      q: "What does 'flex' in CSS refer to?",
      options: [
        "Font flexibility",
        "Flexbox layout model",
        "Flexible images",
        "Float extension",
      ],
      answer: 1,
    },
    {
      q: "Which HTML5 tag is used to play video?",
      options: ["<media>", "<movie>", "<video>", "<play>"],
      answer: 2,
    },
    {
      q: "What is the default display value of a <div> element?",
      options: ["inline", "block", "flex", "inline-block"],
      answer: 1,
    },
    {
      q: "Which HTTP method is used to send data to a server?",
      options: ["GET", "POST", "FETCH", "SEND"],
      answer: 1,
    },
    {
      q: "What does JSON stand for?",
      options: [
        "JavaScript Object Note",
        "Java Standard Object Notation",
        "JavaScript Object Notation",
        "Java Script Open Notation",
      ],
      answer: 2,
    },
  ],
  DSA: [
    {
      q: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      answer: 1,
    },
    {
      q: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      answer: 1,
    },
    {
      q: "What is the worst-case time complexity of QuickSort?",
      options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
      answer: 2,
    },
    {
      q: "Which data structure is best for implementing a breadth-first search?",
      options: ["Stack", "Queue", "Heap", "Graph"],
      answer: 1,
    },
    {
      q: "What is the space complexity of merge sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      answer: 2,
    },
    {
      q: "In a singly linked list, what does each node contain?",
      options: [
        "Data only",
        "Data and pointer to next",
        "Data and two pointers",
        "Only pointers",
      ],
      answer: 1,
    },
    {
      q: "Which sorting algorithm has the best average-case performance?",
      options: [
        "Bubble Sort",
        "Selection Sort",
        "Merge Sort",
        "Insertion Sort",
      ],
      answer: 2,
    },
    {
      q: "What is the time complexity to access an element in an array by index?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      answer: 2,
    },
    {
      q: "A binary tree with n nodes has how many null pointers?",
      options: ["n", "n+1", "2n", "n-1"],
      answer: 1,
    },
    {
      q: "Which algorithm is used to find the shortest path in an unweighted graph?",
      options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"],
      answer: 1,
    },
  ],
};

const CATEGORIES = Object.keys(QUESTION_BANK);
const TIME_PER_Q = 30;

type Phase = "select" | "quiz" | "result";

export default function MockTests() {
  const [phase, setPhase] = useState<Phase>("select");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTest = (cat: string) => {
    const qs = [...QUESTION_BANK[cat]]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setCategory(cat);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setTimeLeft(TIME_PER_Q);
    setPhase("quiz");
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional design - stopTimer is stable
  useEffect(() => {
    if (phase !== "quiz") return;
    stopTimer();
    setTimeLeft(TIME_PER_Q);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNext(null);
          return TIME_PER_Q;
        }
        return t - 1;
      });
    }, 1000);
    return stopTimer;
  }, [phase, current]);

  const handleNext = (sel: number | null) => {
    stopTimer();
    const newAnswers = [...answers];
    newAnswers[current] = sel;
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= questions.length) {
      setPhase("result");
      // save best score
      const score = newAnswers.filter(
        (a, i) => a === questions[i].answer,
      ).length;
      const pct = Math.round((score / questions.length) * 100);
      const key = `mock_best_${category}`;
      const prev = Number(localStorage.getItem(key) ?? 0);
      if (pct > prev) localStorage.setItem(key, String(pct));
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const score = answers.filter(
    (a, i) => a !== null && a === questions[i]?.answer,
  ).length;
  const pct =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const feedback =
    pct >= 80
      ? { label: "Excellent! 🎉", color: "#39D98A" }
      : pct >= 60
        ? { label: "Good Work! 👍", color: "#F59E0B" }
        : { label: "Needs Practice 💪", color: "#EF4444" };

  const catIcons: Record<string, string> = {
    Aptitude: "🧠",
    Programming: "💻",
    "Web Development": "🌐",
    DSA: "📊",
  };

  return (
    <AppShell title="Mock Tests" subtitle="Practice and assess your skills">
      <div className="max-w-3xl mx-auto" data-ocid="mock_tests.page">
        {phase === "select" && (
          <div className="animate-fade-in-up">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                Mock Test Center
              </h1>
              <p className="text-white/40 text-sm">
                10 questions · 30 sec per question · Instant feedback
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((cat, i) => {
                const bestScore = Number(
                  localStorage.getItem(`mock_best_${cat}`) ?? 0,
                );
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => startTest(cat)}
                    className="glass-card-hover p-6 text-left group"
                    data-ocid={`mock_tests.category.${i + 1}`}
                  >
                    <div className="text-4xl mb-3">{catIcons[cat]}</div>
                    <h3 className="text-white font-bold text-lg mb-1">{cat}</h3>
                    <p className="text-white/40 text-sm mb-4">
                      10 MCQ questions · 30s timer
                    </p>
                    {bestScore > 0 && (
                      <div className="text-xs text-purple-400 font-medium">
                        Best: {bestScore}%
                      </div>
                    )}
                    <div className="mt-4 btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
                      <ClipboardCheck size={15} /> Start Test
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "quiz" && questions.length > 0 && (
          <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg">{category}</h2>
                <p className="text-white/40 text-sm">
                  Question {current + 1} of {questions.length}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg ${
                  timeLeft <= 10
                    ? "bg-red-500/20 text-red-400 animate-pulse"
                    : "bg-white/10 text-white"
                }`}
              >
                <Timer size={18} />
                {timeLeft}s
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-track mb-6">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question */}
            <div
              className="glass-card p-6 mb-4"
              data-ocid="mock_tests.question.panel"
            >
              <p className="text-white font-semibold text-base leading-relaxed">
                {questions[current].q}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {questions[current].options.map((opt, idx) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                  key={idx}
                  type="button"
                  onClick={() => setSelected(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selected === idx
                      ? "bg-purple-600/30 border-purple-500 text-white"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/25"
                  }`}
                  data-ocid={`mock_tests.option.${idx + 1}`}
                >
                  <span className="font-medium mr-2 text-white/50">
                    {["A", "B", "C", "D"][idx]}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => handleNext(selected)}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                data-ocid="mock_tests.next.button"
              >
                {current + 1 >= questions.length
                  ? "Submit Test"
                  : "Next Question"}
              </button>
              <button
                type="button"
                onClick={() => handleNext(null)}
                className="btn-secondary text-sm px-4"
                data-ocid="mock_tests.skip.button"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="animate-fade-in-up text-center">
            <div
              className="glass-card p-8 mb-6"
              data-ocid="mock_tests.result.panel"
            >
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-extrabold"
                style={{
                  background: `${feedback.color}20`,
                  border: `3px solid ${feedback.color}`,
                  color: feedback.color,
                }}
              >
                {pct}%
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {feedback.label}
              </h2>
              <p className="text-white/50 mb-2">
                You got <span className="text-white font-bold">{score}</span>{" "}
                out of{" "}
                <span className="text-white font-bold">{questions.length}</span>{" "}
                correct
              </p>
              <p className="text-white/40 text-sm">Category: {category}</p>
            </div>

            {/* Answer Review */}
            <div
              className="glass-card p-6 mb-6 text-left"
              data-ocid="mock_tests.review.panel"
            >
              <h3 className="text-white font-semibold mb-4">Answer Review</h3>
              <div className="space-y-3">
                {questions.map((q, i) => {
                  const correct = answers[i] === q.answer;
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                    <div key={i} className="flex items-start gap-3">
                      {correct ? (
                        <CheckCircle2
                          size={16}
                          className="text-green-400 flex-shrink-0 mt-0.5"
                        />
                      ) : (
                        <XCircle
                          size={16}
                          className="text-red-400 flex-shrink-0 mt-0.5"
                        />
                      )}
                      <div>
                        <p className="text-white/80 text-sm">{q.q}</p>
                        {!correct && (
                          <p className="text-green-400 text-xs mt-0.5">
                            Correct: {q.options[q.answer]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => startTest(category)}
                className="btn-primary flex items-center gap-2"
                data-ocid="mock_tests.retry.button"
              >
                <RotateCcw size={16} /> Retry Test
              </button>
              <button
                type="button"
                onClick={() => setPhase("select")}
                className="btn-secondary"
                data-ocid="mock_tests.back.button"
              >
                Choose Category
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
