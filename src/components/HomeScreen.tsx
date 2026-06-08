import React, { useState } from "react";
import { Power, Layers, Languages, HelpCircle, ChevronRight, HelpCircle as InfoIcon, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationPreferences } from "../types";

interface HomeScreenProps {
  isServiceActive: boolean;
  onToggleService: () => void;
  targetLangPair: { from: string; to: string };
  onChangeLanguages: (from: string, to: string) => void;
  onNavigate: (screen: "feed" | "simulation" | "direct_translate" | "history" | "settings") => void;
}

export default function HomeScreen({
  isServiceActive,
  onToggleService,
  targetLangPair,
  onChangeLanguages,
  onNavigate,
}: HomeScreenProps) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const handleGrantPermission = () => {
    setShowPermissionModal(true);
  };

  const confirmPermission = () => {
    setPermissionGranted(true);
    setShowPermissionModal(false);
  };

  const handleSelectLanguage = (from: string, to: string) => {
    onChangeLanguages(from, to);
    setShowLangModal(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-y-auto pb-10 bg-[#f8f9ff] text-[#0d1c2e] font-sans custom-scrollbar">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center pt-8 px-5 pb-6">
        <div className="relative mb-6">
          {/* Animated Glow Rings when active */}
          <AnimatePresence>
            {isServiceActive && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.3, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 bg-[#2563eb] rounded-full blur-xl"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.15, scale: 1.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", delay: 0.5 }}
                  className="absolute inset-0 bg-[#004ac6] rounded-full blur-2xl"
                />
              </>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleService}
            className={`relative z-10 w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
              isServiceActive
                ? "bg-[#2563eb] border-[#004ac6] text-white"
                : "bg-white border-[#c3c6d7] text-[#004ac6] hover:border-[#2563eb]"
            }`}
          >
            <Power className={`w-12 h-12 mb-2 ${isServiceActive ? "animate-pulse" : ""}`} />
            <span className="text-xs font-bold tracking-widest">
              {isServiceActive ? "STOP SERVICE" : "START SERVICE"}
            </span>
          </motion.button>
        </div>

        <h2 className="text-xl font-bold font-display text-[#0d1c2e] leading-tight select-none">
          {isServiceActive ? "Overlay Service running" : "Start Overlay Service"}
        </h2>
        <p className="text-xs text-[#434655] max-w-[280px] mt-1 leading-relaxed">
          Enable the floating Lisan bubble overlay to translate messaging layouts instantly.
        </p>
      </section>

      {/* Status Bento Grid */}
      <div className="grid grid-cols-1 gap-4 px-5 mb-6">
        {/* Permission Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-start gap-3 shadow-none">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              permissionGranted ? "bg-emerald-100 text-emerald-600" : "bg-[#ffdad6] text-[#93000a]"
            }`}
          >
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0d1c2e]">Screen Overlay</h3>
              {permissionGranted && (
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-[#434655] mt-0.5">
              {permissionGranted ? "Overlay permission granted successfully" : "System permission required to render bubble"}
            </p>
            {!permissionGranted ? (
              <button
                onClick={handleGrantPermission}
                className="mt-3 text-xs text-[#2563eb] font-bold flex items-center gap-1 hover:underline hover:opacity-80 transition-all"
              >
                GRANT PERMISSION <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="mt-3 text-xs text-[#434655] flex items-center gap-1 font-medium">
                Vibration Haptics Enabled
              </span>
            )}
          </div>
        </div>

        {/* Language Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-start gap-3 shadow-none">
          <div className="w-10 h-10 rounded-full bg-[#c0e8ff] text-[#005b78] flex items-center justify-center flex-shrink-0">
            <Languages className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-semibold text-[#0d1c2e]">Target Translation Translation</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#eff4ff] text-[#004ac6] rounded-full uppercase tracking-wider">
                {targetLangPair.from}
              </span>
              <RefreshCw className="w-3 h-3 text-slate-400 animate-spin-slow" />
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#eff4ff] text-[#004ac6] rounded-full uppercase tracking-wider">
                {targetLangPair.to}
              </span>
            </div>
            <button
              onClick={() => setShowLangModal(true)}
              className="mt-3 text-xs text-[#2563eb] font-bold hover:underline hover:opacity-80 transition-all"
            >
              CHANGE LANGUAGES
            </button>
          </div>
        </div>
      </div>

      {/* Guide/How to use */}
      <section className="mx-5 bg-[#e6eeff] border border-[#c3c6d7] rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 text-[#004ac6]">
          <HelpCircle className="w-5 h-5" />
          <h3 className="text-sm font-bold">Fast Playback Tutorial</h3>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">
              1
            </div>
            <div>
              <p className="text-xs font-medium text-[#0d1c2e]">
                <strong className="text-[#004ac6]">Tap START above</strong>: Spin up the Lisan translation daemon active listener inside the simulated OS.
              </p>
            </div>
          </div>
          <div className="h-px bg-[#c3c6d7] w-full" />
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-xs font-medium text-[#0d1c2e]">
                <strong className="text-[#004ac6]">Explore Feeds</strong>: Tap the <strong onClick={() => onNavigate("feed")} className="underline cursor-pointer">Social Feed 📽️</strong> tab at the bottom to watch reels, or open the <strong onClick={() => onNavigate("simulation")} className="underline cursor-pointer">Chat Sim 💬</strong> screen.
              </p>
            </div>
          </div>
          <div className="h-px bg-[#c3c6d7] w-full" />
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-xs font-medium text-[#0d1c2e]">
                <strong className="text-[#004ac6]">Interact with the Bubble</strong>: Drag or click the blue floating translate button over comments or user speech bubbles to transcode Franco-Arabic instantly!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrated Interactive Device Banner */}
      <div className="mx-5 mt-6 border border-[#e2e8f0] rounded-xl overflow-hidden bg-white group flex flex-col hover:border-[#2563eb] transition-all">
        <div className="p-4 border-b border-[#e2e8f0]">
          <h4 className="text-xs font-bold text-[#0d1c2e]">Simulated Mobile Environment Features</h4>
          <p className="text-[10px] text-slate-500">Curious how it feels? Explore standard modes inside the device frame.</p>
        </div>
        <div className="relative aspect-video bg-gradient-to-tr from-slate-900 to-[#101e30] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="p-4 text-center pointer-events-none">
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-white text-3xl font-extrabold font-display"
            >
              LISAN OVERLAY v3.0
            </motion.div>
            <div className="text-[10px] text-[#2563eb] font-semibold tracking-widest mt-2 uppercase">
              Multilingual Franco-Arabic Screen Engine
            </div>
          </div>
        </div>
      </div>

      {/* Permission Simulator Dialog */}
      <AnimatePresence>
        {showPermissionModal && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden p-5 shadow-2xl relative"
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-[#ffdad6] rounded-full flex items-center justify-center mx-auto mb-4 text-[#93000a]">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0d1c2e]">Grant Overlay Drawing?</h3>
                <p className="text-xs text-[#434655] mt-2 mb-6 leading-relaxed">
                  Lisan requires "Draw Over Other Apps" permission inside this simulated Android system to display the floating translate utility bubble.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPermissionModal(false)}
                    className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs text-slate-600 font-semibold active:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPermission}
                    className="flex-1 py-2.5 rounded-full bg-[#004ac6] text-white text-xs font-bold shadow-lg shadow-[#004ac6]/10 active:bg-blue-800 transition-all"
                  >
                    Allow Overlay
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Language Selector Modal */}
      <AnimatePresence>
        {showLangModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden p-5 shadow-2xl relative"
            >
              <h3 className="text-sm font-bold text-[#0d1c2e] uppercase tracking-wider mb-4 border-b pb-2 text-center">
                Select Native Translation Pair
              </h3>
              <div className="space-y-2">
                {[
                  { from: "Franco", to: "Arabic" },
                  { from: "English", to: "Arabic" },
                  { from: "Arabic", to: "Franco" },
                  { from: "Arabic", to: "French" },
                  { from: "Arabic", to: "English" }
                ].map((pair, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLanguage(pair.from.toLowerCase(), pair.to.toLowerCase())}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                      targetLangPair.from === pair.from.toLowerCase() && targetLangPair.to === pair.to.toLowerCase()
                        ? "border-[#2563eb] bg-[#eff4ff] text-[#004ac6] font-bold"
                        : "border-slate-100 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="text-xs">
                      {pair.from} <span className="opacity-40 font-normal">→</span> {pair.to}
                    </span>
                    {targetLangPair.from === pair.from.toLowerCase() && targetLangPair.to === pair.to.toLowerCase() && (
                      <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowLangModal(false)}
                className="w-full mt-4 py-2 text-xs text-[#434655] font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
