import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Lightbulb,
  RefreshCw,
  Target,
  Upload,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { getScoreColor, getScoreLabel, scoreResume } from "../utils/atsEngine";
import { addNotification } from "../utils/extras";
import { loadATSResult, saveATSResult } from "../utils/storage";
import type { ATSResult } from "../utils/storage";

function ScoreRing({
  score,
  color,
  size = 160,
}: { score: number; color: string; size?: number }) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90 absolute inset-0"
        aria-hidden="true"
      >
        <title>Score ring</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.2s ease",
            filter: `drop-shadow(0 0 8px ${color}88)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white">{score}</span>
        <span className="text-white/40 text-sm">/100</span>
      </div>
    </div>
  );
}

async function extractTextFromPDF(file: File): Promise<string> {
  // Load PDF.js from CDN at runtime to avoid bundling issues
  const PDFJS_CDN =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  const WORKER_CDN =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  if (!(window as any).pdfjsLib) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = PDFJS_CDN;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const pdfjsLib = (window as any).pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += `${pageText}
`;
  }
  return fullText;
}

export default function ATSAnalyzer() {
  const [result, setResult] = useState<ATSResult | null>(() => loadATSResult());
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only (.pdf)");
      return;
    }
    setFileName(file.name);
    setLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      if (!text.trim()) {
        toast.error(
          "Could not extract text from this PDF. Try a text-based PDF.",
        );
        setLoading(false);
        return;
      }
      // Slight delay for UX
      setTimeout(() => {
        const r = scoreResume(text);
        setResult(r);
        saveATSResult(r);
        addNotification("ATS Analysis Completed");
        setLoading(false);
        toast.success(`ATS Score: ${r.score}/100 — ${getScoreLabel(r.score)}`);
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse PDF. Please try a different file.");
      setLoading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const scoreColor = result ? getScoreColor(result.score) : "#7C5CFF";

  return (
    <AppShell title="ATS Analyzer" subtitle="Score your resume">
      <div className="max-w-6xl mx-auto" data-ocid="ats_analyzer.page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">ATS Resume Analyzer</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Upload your resume PDF to get an instant ATS score and improvement
            tips
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div
              className="glass-card p-5"
              data-ocid="ats_analyzer.input.panel"
            >
              <h3 className="text-white font-semibold mb-4">
                Upload Resume (PDF Only)
              </h3>

              {/* Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-purple-400 bg-purple-500/10"
                    : "border-white/15 hover:border-white/30 hover:bg-white/5"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) =>
                  e.key === "Enter" && fileInputRef.current?.click()
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                aria-label="Upload PDF"
                data-ocid="ats_analyzer.dropzone"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileInput}
                  data-ocid="ats_analyzer.file_input"
                />
                {loading ? (
                  <>
                    <RefreshCw
                      size={40}
                      className="text-purple-400 animate-spin mb-3"
                    />
                    <p className="text-white font-medium">
                      Analyzing your resume...
                    </p>
                    <p className="text-white/40 text-sm mt-1">
                      Extracting text and scoring
                    </p>
                  </>
                ) : fileName ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-3">
                      <FileText size={28} className="text-green-400" />
                    </div>
                    <p className="text-white font-semibold">{fileName}</p>
                    <p className="text-white/40 text-sm mt-1">
                      Click to upload a different file
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-3">
                      <Upload size={28} className="text-purple-400" />
                    </div>
                    <p className="text-white font-semibold">
                      Drag & drop your PDF here
                    </p>
                    <p className="text-white/40 text-sm mt-1">
                      or click to browse files
                    </p>
                    <p className="text-white/25 text-xs mt-2">
                      .pdf files only · Max 10MB
                    </p>
                  </>
                )}
              </div>

              {!loading && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-2.5"
                  data-ocid="ats_analyzer.upload.button"
                >
                  <Upload size={15} /> Choose PDF File
                </button>
              )}
            </div>

            <div className="glass-card p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-400" /> How ATS
                Scoring Works
              </h3>
              <div className="space-y-2">
                {[
                  {
                    label: "Section Detection",
                    pts: "60 pts",
                    desc: "Summary, Education, Experience, Skills, Projects, Certifications",
                  },
                  {
                    label: "Keyword Density",
                    pts: "20 pts",
                    desc: "Tech keywords: JavaScript, React, Python, SQL, Git, API...",
                  },
                  {
                    label: "Content Length",
                    pts: "10 pts",
                    desc: "Minimum 350 words for comprehensive parsing",
                  },
                  {
                    label: "Formatting Cues",
                    pts: "10 pts",
                    desc: "Email, phone, GitHub/LinkedIn links",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-purple-400 font-bold text-xs bg-purple-500/10 px-2 py-0.5 rounded flex-shrink-0">
                      {item.pts}
                    </span>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {item.label}
                      </p>
                      <p className="text-white/40 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <div
                  className="glass-card p-6 flex flex-col items-center"
                  data-ocid="ats_analyzer.score.panel"
                >
                  <h3 className="text-white font-semibold mb-4 self-start">
                    Your ATS Score
                  </h3>
                  <ScoreRing
                    score={result.score}
                    color={scoreColor}
                    size={160}
                  />
                  <div className="mt-4 text-center">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: scoreColor }}
                    >
                      {getScoreLabel(result.score)}
                    </span>
                    <p className="text-white/40 text-sm mt-1">
                      Analyzed{" "}
                      {result.analyzedAt
                        ? new Date(result.analyzedAt).toLocaleString()
                        : "just now"}
                    </p>
                  </div>
                  <div className="w-full mt-4 grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Sections",
                        value: `${6 - result.missingSections.length}/6`,
                        color: "#39D98A",
                      },
                      {
                        label: "Keywords",
                        value: `${10 - result.missingSkills.length}/10`,
                        color: "#35D0C7",
                      },
                      {
                        label: "Missing",
                        value: `${result.missingSections.length}`,
                        color: "#EF4444",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-white/5 rounded-xl p-3 text-center"
                      >
                        <div
                          className="text-xl font-bold"
                          style={{ color: s.color }}
                        >
                          {s.value}
                        </div>
                        <div className="text-white/40 text-xs">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {result.missingSections.length > 0 && (
                  <div
                    className="glass-card p-5"
                    data-ocid="ats_analyzer.missing_sections.panel"
                  >
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-400" /> Missing
                      Sections
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSections.map((s, i) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                          key={i}
                          className="skill-chip-missing"
                          data-ocid={`ats_analyzer.missing_section.item.${i + 1}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.missingSkills.length > 0 && (
                  <div
                    className="glass-card p-5"
                    data-ocid="ats_analyzer.missing_keywords.panel"
                  >
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Zap size={16} className="text-yellow-400" /> Missing
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map((k, i) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                          key={i}
                          className="skill-chip"
                          data-ocid={`ats_analyzer.missing_keyword.item.${i + 1}`}
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="glass-card p-5"
                  data-ocid="ats_analyzer.suggestions.panel"
                >
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400" />{" "}
                    Improvement Suggestions
                  </h3>
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                        key={i}
                        className="flex items-start gap-2 py-2 border-b border-white/5 last:border-0"
                        data-ocid={`ats_analyzer.suggestion.item.${i + 1}`}
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-400 text-xs font-bold">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div
                className="glass-card p-10 flex flex-col items-center justify-center text-center"
                data-ocid="ats_analyzer.empty_state"
              >
                <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                  <Target size={36} className="text-purple-400" />
                </div>
                <p className="text-white font-semibold text-lg">
                  Upload Resume to Start Analysis
                </p>
                <p className="text-white/30 text-sm mt-2">
                  Upload your PDF resume above to get ATS score, missing
                  keywords, and actionable suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
