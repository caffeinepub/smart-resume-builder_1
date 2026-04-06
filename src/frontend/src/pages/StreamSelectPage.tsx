import { useNavigate } from "@tanstack/react-router";
import * as LucideIcons from "lucide-react";
import { Brain } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { getUserStream, saveUserStream } from "../utils/auth";
import { STREAMS, type StreamId } from "../utils/streamData";

function DynamicIcon({
  name,
  size = 24,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const IconComp =
    (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<{
          size?: number;
          className?: string;
          style?: React.CSSProperties;
        }>
      >
    )[name] ?? LucideIcons.Star;
  return <IconComp size={size} className={className} style={style} />;
}

const STREAM_LIST = Object.values(STREAMS);

export default function StreamSelectPage() {
  const navigate = useNavigate();
  const existingStream = getUserStream();
  const [selected, setSelected] = useState<StreamId | null>(
    existingStream && STREAMS[existingStream as StreamId]
      ? (existingStream as StreamId)
      : null,
  );
  const [saving, setSaving] = useState(false);

  const handleSelect = (id: StreamId) => {
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    setSaving(true);
    saveUserStream(selected);
    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 200);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-10"
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

      {/* Heading */}
      <div className="text-center mb-8 max-w-xl">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Choose Your Academic Stream
        </h1>
        <p className="text-white/50 text-sm">
          We'll personalize your roles, certifications, roadmap, and resources
          based on your field
        </p>
      </div>

      {/* Stream cards grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mb-8"
        data-ocid="stream_select.list"
      >
        {STREAM_LIST.map((stream, i) => {
          const isSelected = selected === stream.id;
          return (
            <motion.button
              key={stream.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(stream.id as StreamId)}
              data-ocid={`stream_select.item.${i + 1}`}
              className="relative text-left p-5 rounded-2xl border transition-all duration-200 focus:outline-none"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${stream.color}22, ${stream.color}11)`
                  : "rgba(255,255,255,0.03)",
                borderColor: isSelected
                  ? stream.color
                  : "rgba(255,255,255,0.08)",
                boxShadow: isSelected
                  ? `0 0 24px ${stream.color}40, 0 4px 24px rgba(0,0,0,0.3)`
                  : "none",
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: stream.color }}
                >
                  <LucideIcons.Check size={11} className="text-white" />
                </div>
              )}

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: isSelected
                    ? `${stream.color}25`
                    : "rgba(255,255,255,0.06)",
                }}
              >
                <DynamicIcon
                  name={stream.icon}
                  size={20}
                  style={{
                    color: isSelected ? stream.color : "rgba(255,255,255,0.5)",
                  }}
                />
              </div>

              <h3
                className="font-bold text-sm mb-1 leading-tight"
                style={{ color: isSelected ? stream.color : "white" }}
              >
                {stream.label}
              </h3>
              <p className="text-white/40 text-[11px] mb-2 leading-relaxed">
                {stream.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {stream.exampleRoles.slice(0, 2).map((role) => (
                  <span
                    key={role}
                    className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      color: isSelected
                        ? stream.color
                        : "rgba(255,255,255,0.35)",
                      background: isSelected
                        ? `${stream.color}18`
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${
                        isSelected
                          ? `${stream.color}40`
                          : "rgba(255,255,255,0.08)"
                      }`,
                    }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected || saving}
          className="btn-primary px-10 py-3 text-base font-semibold"
          style={{
            opacity: selected ? 1 : 0.4,
            cursor: selected ? "pointer" : "not-allowed",
          }}
          data-ocid="stream_select.continue.button"
        >
          {saving
            ? "Saving..."
            : selected
              ? `Continue as ${STREAMS[selected].label} Student →`
              : "Select a stream to continue"}
        </button>
        {existingStream && STREAMS[existingStream as StreamId] && (
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="text-white/30 text-sm hover:text-white/60 transition-colors"
            data-ocid="stream_select.skip.button"
          >
            Keep current stream and go to dashboard
          </button>
        )}
      </motion.div>

      <p className="mt-10 text-white/20 text-xs text-center">
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
