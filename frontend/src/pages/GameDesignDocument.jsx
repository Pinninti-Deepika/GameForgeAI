import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { generateGamePDF } from "../services/pdfService";

let requestPromise = null;

export default function GameDesignDocument() {
  const navigate = useNavigate();
  const location = useLocation();

  const gamePlan = location.state?.gamePlan || JSON.parse(sessionStorage.getItem("gamePlan"));
  const story = location.state?.story || JSON.parse(sessionStorage.getItem("story"));
  const characters = location.state?.characters || JSON.parse(sessionStorage.getItem("characters"));
  const levels = location.state?.levels || JSON.parse(sessionStorage.getItem("levels"));
  const gameplay = location.state?.gameplay || JSON.parse(sessionStorage.getItem("gameplay"));
  const visualStyle = location.state?.visualStyle || JSON.parse(sessionStorage.getItem("visualStyle"));

  const [gdd, setGdd] = useState(() => {
    const saved = sessionStorage.getItem("gdd");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(!gdd);
  const started = useRef(false);
  const [step, setStep] = useState(0);

  const loadingSteps = [
    "Collecting Planner",
    "Collecting Story",
    "Collecting Characters",
    "Collecting Levels",
    "Collecting Gameplay",
    "Collecting Visual Style",
    "Building Final Document",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((old) => (old < loadingSteps.length - 1 ? old + 1 : old));
    }, 900);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gdd) {
      setLoading(false);
      return;
    }
    if (started.current) return;
    started.current = true;

    async function generate() {
      try {
        setLoading(true);
        if (!requestPromise) {
          requestPromise = fetch("http://127.0.0.1:8000/generate-gdd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              game_plan: gamePlan,
              story,
              characters,
              levels,
              gameplay,
              visual_style: visualStyle,
            }),
          })
            .then((r) => r.json())
            .finally(() => {
              requestPromise = null;
            });
        }
        const data = await requestPromise;
        if (data.success) {
          setGdd(data.gdd);
          sessionStorage.setItem("gdd", JSON.stringify(data.gdd));
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    generate();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden font-sans antialiased text-white">
        {/* Modern ambient glowing backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-md w-full px-6">
          <div className="relative flex items-center justify-center mx-auto mb-8 w-28 h-28">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-purple-500 border-t-transparent"
            />
            <span className="text-3xl">🤖</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            GameForge Architect
          </h1>
          
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium tracking-wide text-purple-400">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            {loadingSteps[step]}...
          </div>

          {/* Clean modern dynamic status checker */}
          <div className="mt-8 border border-neutral-800/60 bg-neutral-900/40 backdrop-blur-md rounded-2xl p-5 text-left space-y-3">
            {loadingSteps.slice(0, 6).map((agent, index) => {
              const isDone = step > index;
              const isCurrent = step === index;
              return (
                <div key={agent} className="flex items-center justify-between text-sm transition-all duration-300">
                  <span className={`${isDone ? "text-neutral-400" : isCurrent ? "text-white font-medium" : "text-neutral-600"}`}>
                    {agent.replace("Collecting ", "")} Agent
                  </span>
                  {isDone ? (
                    <span className="text-emerald-400 font-medium text-xs bg-emerald-500/10 px-2 py-0.5 rounded-md">Ready</span>
                  ) : isCurrent ? (
                    <span className="text-purple-400 font-medium text-xs bg-purple-500/10 px-2 py-0.5 rounded-md animate-pulse">Running</span>
                  ) : (
                    <span className="text-neutral-700 text-xs">Waiting</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const doc = gdd.document;

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(gdd, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title}.json`;
    a.click();
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-white flex items-center justify-center px-4 py-12 overflow-hidden font-sans antialiased">
      {/* Visual Ambient Blur Backgrounds */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-4xl shadow-xl shadow-purple-500/10 mx-auto mb-5 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              🕹️
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
              Game Design Document
            </h1>
            <p className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span>✓</span> Compilation Successful
            </p>
          </div>

          {/* Bento Meta Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-6 shadow-inner">
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
              Project Title
            </span>
            <h2 className="text-2xl font-bold mt-1 text-white tracking-tight">
              {doc.title}
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-neutral-800/60">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Genre</span>
                <p className="font-semibold text-neutral-200 mt-0.5">{doc.genre}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Platform</span>
                <p className="font-semibold text-neutral-200 mt-0.5">{doc.platform}</p>
              </div>
            </div>
          </div>

          {/* Agents Pipeline Diagnostics */}
          <div className="mt-6 rounded-2xl border border-neutral-800/50 bg-neutral-950/30 p-6">
            <h3 className="font-bold text-sm tracking-wide text-neutral-400 mb-4">
              Agent Pipeline Status
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-neutral-400">
              {["Planner", "Story", "Character", "Level", "Gameplay", "Visual Style", "GDD Compile"].map((name) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clean Action Matrix */}
          <div className="mt-8 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => generateGamePDF(gdd)}
                className="py-3.5 px-4 rounded-xl bg-neutral-100 hover:bg-white text-black font-semibold text-sm transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>📄</span> Export PDF
              </button>

              <button
                onClick={downloadJSON}
                className="py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700/50 text-neutral-200 font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>💾</span> Backup JSON
              </button>
            </div>

            <button
              onClick={() => {
                sessionStorage.clear();
                navigate("/");
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all duration-200 active:scale-[0.99]"
            >
              ✨ Design Another Game
            </button>
          </div>

          {/* Footer Branding */}
          <p className="text-center text-neutral-600 text-xs mt-8 tracking-wide">
            Powered by <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-semibold">GameForge Core Engine</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}