import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, Battery, Signal, ArrowLeft, RotateCcw, Volume2, ShieldCheck, HelpCircle } from "lucide-react";
import { EmulatorScreen, HistoryItem, TranslationPreferences } from "../types";

// Import screens
import HomeScreen from "./HomeScreen";
import SocialFeedScreen from "./SocialFeedScreen";
import SimulationScreen from "./SimulationScreen";
import DirectTranslateScreen from "./DirectTranslateScreen";
import HistorySettingsScreen from "./HistorySettingsScreen";

interface AndroidEmulatorProps {
  isServiceActive: boolean;
  onToggleService: () => void;
  targetLangPair: { from: string; to: string };
  onChangeLanguages: (from: string, to: string) => void;
  historyList: HistoryItem[];
  onAddHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
  translationPreferences: TranslationPreferences;
  onUpdatePreferences: (prefs: Partial<TranslationPreferences>) => void;
  onPostTranslate: (text: string, from?: string, to?: string) => Promise<{ translatedText: string; method: string }>;
}

export default function AndroidEmulator({
  isServiceActive,
  onToggleService,
  targetLangPair,
  onChangeLanguages,
  historyList,
  onAddHistoryItem,
  onClearHistory,
  onToggleFavorite,
  translationPreferences,
  onUpdatePreferences,
  onPostTranslate,
}: AndroidEmulatorProps) {
  const [currentScreen, setCurrentScreen] = useState<EmulatorScreen>("home");
  const [phoneTime, setPhoneTime] = useState("");
  const [bubbleCoords, setBubbleCoords] = useState({ x: 0, y: 0 });
  const [notification, setNotification] = useState<string | null>(null);

  // Maintain actual phone time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setPhoneTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Display top notifications occasionally to match genuine Android utility feel
  useEffect(() => {
    if (isServiceActive) {
      setNotification("Lisan background service started in overlay mode!");
      const t = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(t);
    } else {
      setNotification("Translation service stopped");
      const t = setTimeout(() => setNotification(null), 2500);
      return () => clearTimeout(t);
    }
  }, [isServiceActive]);

  const handlePostTranslateOnlyText = async (text: string): Promise<string> => {
    const res = await onPostTranslate(text, targetLangPair.from, targetLangPair.to);
    return res.translatedText;
  };

  const renderScreenContent = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            isServiceActive={isServiceActive}
            onToggleService={onToggleService}
            targetLangPair={targetLangPair}
            onChangeLanguages={onChangeLanguages}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
      case "feed":
        return (
          <SocialFeedScreen
            isServiceActive={isServiceActive}
            bubbleCoords={bubbleCoords}
            onUpdateBubbleCoords={(coords) => setBubbleCoords(coords)}
            onPostTranslate={handlePostTranslateOnlyText}
          />
        );
      case "simulation":
        return (
          <SimulationScreen
            isServiceActive={isServiceActive}
            onPostTranslate={handlePostTranslateOnlyText}
          />
        );
      case "direct_translate":
        return (
          <DirectTranslateScreen
            onAddHistoryItem={onAddHistoryItem}
            historyList={historyList}
            translationPreferences={translationPreferences}
            onPostTranslate={onPostTranslate}
          />
        );
      case "history":
      case "settings":
        return (
          <HistorySettingsScreen
            historyList={historyList}
            onClearHistory={onClearHistory}
            onToggleFavorite={onToggleFavorite}
            translationPreferences={translationPreferences}
            onUpdatePreferences={onUpdatePreferences}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 h-full w-full">
      {/* Curved Smartphone Outer Frame Bezel */}
      <div className="relative mx-auto w-[335px] h-[670px] bg-slate-900 rounded-[44px] p-2.5 shadow-2xl border-4 border-slate-700/80 ring-12 ring-slate-950 flex flex-col overflow-hidden">
        
        {/* Rear Lock/Vol Button Simulated Cutouts on screen margin borders */}
        <div className="absolute right-0 top-36 w-0.5 h-12 bg-slate-700 rounded-l" />
        <div className="absolute right-0 top-52 w-0.5 h-8 bg-slate-700 rounded-l" />

        {/* Inner AMOLED Phone screen glass panel */}
        <div className="relative flex-1 w-full h-full bg-[#f8f9ff] text-[#0d1c2e] rounded-[36px] flex flex-col overflow-hidden shadow-inner select-none">
          
          {/* TOP NOTCH CAMERA HOLE (Dynamic dynamic Island cutout) */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-800 absolute left-3.5" />
            <span className="text-[7.5px] text-zinc-500 font-bold ml-6 pr-1 select-none font-sans tracking-widest leading-none">
              LISAN
            </span>
          </div>

          {/* SIMULATED ANDROID STATUS BAR TIMINGS */}
          <div className="h-7 w-full bg-slate-50 border-b border-slate-100 flex items-center justify-between px-5 text-[10px] text-slate-800 font-bold font-sans z-40 select-none">
            <div className="flex items-center gap-1">
              <span>{phoneTime || "13:25"}</span>
            </div>
            
            {/* Cell WiFi connection and remaining battery status icons */}
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-slate-700" />
              <Wifi className="w-3.5 h-3.5 text-slate-700" />
              <div className="flex items-center gap-0.5">
                <span className="text-[9px]">84%</span>
                <Battery className="w-4 h-4 text-slate-750" />
              </div>
            </div>
          </div>

          {/* Android Toast notification band popup */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                className="absolute top-8 left-4 right-4 bg-slate-900 text-white text-[10px] font-semibold py-2 px-3 rounded-full text-center shadow-lg border border-slate-800 z-50 flex items-center justify-center gap-1.5"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                <span>{notification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RENDER ACTIVE SCREEN AT CENTER CANVAS */}
          <div className="flex-1 w-full overflow-hidden relative flex flex-col pt-1">
            {renderScreenContent()}
          </div>

          {/* DECORATIVE SYSTEM OVERLAY SERVICE STATUS ACCENT (Bottom margin visual clue) */}
          <AnimatePresence>
            {isServiceActive && currentScreen !== "feed" && currentScreen !== "simulation" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-600 border border-white flex items-center justify-center shadow-md animate-bounce cursor-pointer z-40"
                onClick={() => setCurrentScreen("feed")}
                title="Lisan overlay active. Tap to try feed simulation!"
              />
            )}
          </AnimatePresence>

          {/* SIMULATED BOTTOM NAVIGATION INTERACTION RAIL */}
          <nav className="h-14 bg-white border-t border-slate-100 flex items-center justify-around px-2 pb-1.5 z-40 select-none">
            {/* HOME SCREEN BUTTON */}
            <button
              onClick={() => setCurrentScreen("home")}
              className={`flex flex-col items-center justify-center flex-1 transition-all py-1 ${
                currentScreen === "home" ? "text-[#2563eb] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <svg className="w-5 h-5 mb-0.5 fill-current" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-[8.5px] tracking-wide uppercase">Home</span>
            </button>

            {/* SOCIAL FEED BUTTON */}
            <button
              onClick={() => setCurrentScreen("feed")}
              className={`flex flex-col items-center justify-center flex-1 transition-all py-1 ${
                currentScreen === "feed" ? "text-[#2563eb] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <svg className="w-5 h-5 mb-0.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                <rect x="2" y="2" width="20" height="20" rx="3" />
                <path d="M10 8h4v8h-4z" />
              </svg>
              <span className="text-[8.5px] tracking-wide uppercase">Reels 📽️</span>
            </button>

            {/* CHAT SIMULATOR BUTTON */}
            <button
              onClick={() => setCurrentScreen("simulation")}
              className={`flex flex-col items-center justify-center flex-1 transition-all py-1 ${
                currentScreen === "simulation" ? "text-[#2563eb] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <svg className="w-5 h-5 mb-0.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-[8.5px] tracking-wide uppercase">Chat Sim 💬</span>
            </button>

            {/* DIRECT FRANCO COMPILER */}
            <button
              onClick={() => setCurrentScreen("direct_translate")}
              className={`flex flex-col items-center justify-center flex-1 transition-all py-1 ${
                currentScreen === "direct_translate" ? "text-[#2563eb] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <svg className="w-5 h-5 mb-0.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="m18 8-6 6-6-6" />
                <path d="M12 2v12" />
              </svg>
              <span className="text-[8.5px] tracking-wide uppercase">Editor 📝</span>
            </button>

            {/* HISTORIES & CONFIG OVERVIEW */}
            <button
              onClick={() => setCurrentScreen("history")}
              className={`flex flex-col items-center justify-center flex-1 transition-all py-1 ${
                currentScreen === "history" || currentScreen === "settings" ? "text-[#2563eb] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <svg className="w-5 h-5 mb-0.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              <span className="text-[8.5px] tracking-wide uppercase">Config ⚙️</span>
            </button>
          </nav>

          {/* PHYSICAL GESTURE PILL BUTTON */}
          <div className="h-3 w-full bg-white flex items-center justify-center pb-2 select-none">
            <div className="w-24 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
