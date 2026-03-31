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
import { getUserStream } from "../utils/auth";
import { addNotification } from "../utils/extras";
import { loadATSResult, saveATSResult } from "../utils/storage";
import type { ATSResult } from "../utils/storage";
import { getStreamById } from "../utils/streamData";

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
    fullText += `${pageText}\n`;
  }
  return fullText;
}

export default function ATSAnalyzer() {
  const [result, setResult] = useState<ATSResult | null>(() => loadATSResult());
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);
  const streamKeywords = streamDef.atsKeywords;

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
      setTimeout(() => {
        const r = scoreResume(text);
        // Enrich with stream keywords check
        const textLower = text.toLowerCase();
        const foundStreamKeywords = streamKeywords.filter((k) =>
          textLower.includes(k.toLowerCase()),
        );
        const missingStreamKeywords = streamKeywords.filter(
          (k) => !textLower.includes(k.toLowerCase()),
        );
        // Merge stream keywords into existing missing skills
        const enrichedMissingSkills = Array.from(
          new Set([...r.missingSkills, ...missingStreamKeywords.slice(0, 3)]),
        ).slice(0, 8);
        const enrichedResult: ATSResult = {
          ...r,
          missingSkills: enrichedMissingSkills,
          suggestions: [
            ...r.suggestions,
            foundStreamKeywords.length < 3
              ? `Add more ${streamDef.label} keywords: ${missingStreamKeywords.slice(0, 3).join(", ")}`
              : `Good use of ${streamDef.label} keywords! Found: ${foundStreamKeywords.slice(0, 3).join(", ")}`,
          ].slice(0, 6),
        };
        setResult(enrichedResult);
        saveATSResult(enrichedResult);
        addNotification("ATS Analysis Completed");
        setLoading(false);
        toast.success(
          `ATS Score: ${enrichedResult.score}/100 — ${getScoreLabel(enrichedResult.score)}`,
        );
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to parse PDF. Make sure it's a valid text-based PDF.",
      );
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <AppShell title="ATS Analyzer" subtitle="Check your resume's ATS score">
      <div className="max-w-4xl mx-auto" data-ocid="ats_analyzer.page">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">
              ATS Resume Analyzer
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Upload your resume PDF to get an ATS compatibility score
            </p>
          </div>
          <span
            className="text-sm font-medium px-3 py-1.5 rounded-full border flex items-center gap-1.5"
            style={{
              color: streamDef.color,
              background: `${streamDef.color}15`,
              borderColor: `${streamDef.color}35`,
            }}
            data-ocid="ats_analyzer.stream.badge"
          >
            <Zap size={12} />
            Analyzing for {streamDef.label} roles
          </span>
        </div>

        {/* Upload area — using a label wrapping a hidden input for best accessibility */}
        <label
          htmlFor="ats-file-input"
          className={`glass-card p-8 mb-6 flex flex-col items-center justify-center text-center border-2 border-dashed transition-all cursor-pointer block ${
            dragOver
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/10 hover:border-purple-500/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          data-ocid="ats_analyzer.dropzone"
        >
          <input
            ref={fileInputRef}
            id="ats-file-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleInputChange}
            data-ocid="ats_analyzer.upload_button"
          />
          <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-4">
            {loading ? (
              <RefreshCw size={28} className="text-purple-400 animate-spin" />
            ) : (
              <Upload size={28} className="text-purple-400" />
            )}
          </div>
          {loading ? (
            <>
              <p className="text-white font-semibold mb-1">
                Analyzing Resume...
              </p>
              <p className="text-white/40 text-sm">
                Checking ATS compatibility for {streamDef.label} roles
              </p>
            </>
          ) : (
            <>
              <p className="text-white font-semibold mb-1">
                {fileName ? fileName : "Drop your resume PDF here"}
              </p>
              <p className="text-white/40 text-sm mb-3">
                {fileName
                  ? "Click to upload a different file"
                  : "or click to browse files"}
              </p>
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                PDF only — max 10MB
              </span>
            </>
          )}
        </label>

        {/* Stream keywords preview */}
        {!result && !loading && (
          <div
            className="glass-card p-5 mb-6"
            data-ocid="ats_analyzer.keywords.panel"
          >
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Target size={14} style={{ color: streamDef.color }} />
              Keywords we check for {streamDef.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {streamKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2 py-1 rounded-lg border"
                  style={{
                    color: streamDef.color,
                    background: `${streamDef.color}10`,
                    borderColor: `${streamDef.color}30`,
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div
            className="space-y-6 animate-fade-in-up"
            data-ocid="ats_analyzer.results.panel"
          >
            {/* Score + Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-card p-6 flex flex-col items-center">
                <h3 className="section-heading mb-4">ATS Score</h3>
                <ScoreRing
                  score={result.score}
                  color={getScoreColor(result.score)}
                />
                <div className="mt-4 text-center">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: getScoreColor(result.score) }}
                  >
                    {getScoreLabel(result.score)}
                  </span>
                  <p className="text-white/40 text-sm mt-1">
                    Analyzed on{" "}
                    {new Date(
                      result.analyzedAt ?? Date.now(),
                    ).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 btn-secondary text-xs flex items-center gap-2"
                  data-ocid="ats_analyzer.re_analyze.button"
                >
                  <RefreshCw size={13} /> Re-analyze
                </button>
              </div>

              <div className="glass-card p-6">
                <h3 className="section-heading mb-4">Resume Sections</h3>
                <div className="space-y-2">
                  {[
                    "Summary/Objective",
                    "Education",
                    "Work Experience",
                    "Skills",
                    "Projects",
                    "Certifications",
                  ].map((section) => {
                    const missing = result.missingSections.includes(section);
                    return (
                      <div key={section} className="flex items-center gap-3">
                        {missing ? (
                          <AlertCircle
                            size={14}
                            className="text-red-400 flex-shrink-0"
                          />
                        ) : (
                          <CheckCircle2
                            size={14}
                            className="text-green-400 flex-shrink-0"
                          />
                        )}
                        <span
                          className={`text-sm ${
                            missing ? "text-white/40" : "text-white"
                          }`}
                        >
                          {section}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Missing Skills */}
            {result.missingSkills.length > 0 && (
              <div
                className="glass-card p-5"
                data-ocid="ats_analyzer.missing_skills.panel"
              >
                <h3 className="section-heading mb-4 flex items-center gap-2">
                  <FileText size={14} className="text-red-400" />
                  Missing Keywords ({result.missingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, i) => (
                    <span
                      key={skill}
                      className="skill-chip-missing"
                      data-ocid={`ats_analyzer.missing_skill.item.${i + 1}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div
                className="glass-card p-5"
                data-ocid="ats_analyzer.suggestions.panel"
              >
                <h3 className="section-heading mb-4 flex items-center gap-2">
                  <Lightbulb size={14} className="text-yellow-400" />
                  Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((sug, i) => (
                    <li
                      // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                      key={i}
                      className="flex items-start gap-3 text-sm text-white/70"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                        style={{
                          background: `${streamDef.color}20`,
                          color: streamDef.color,
                        }}
                      >
                        {i + 1}
                      </span>
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div
            className="glass-card p-8 text-center"
            data-ocid="ats_analyzer.empty_state"
          >
            <Target size={36} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/50 font-medium">No Resume Analyzed Yet</p>
            <p className="text-white/30 text-sm mt-2">
              Upload your PDF resume above to see your ATS compatibility score
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
