import React, { useState } from "react";
import { Trash2, Star, Volume2, Copy, Check, Info, ChevronRight, HeartHandshake, User, Shield, HelpCircle, ToggleLeft, ToggleRight, CheckSquare2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HistoryItem, TranslationPreferences } from "../types";

interface HistorySettingsScreenProps {
  historyList: HistoryItem[];
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
  translationPreferences: TranslationPreferences;
  onUpdatePreferences: (prefs: Partial<TranslationPreferences>) => void;
}

export default function HistorySettingsScreen({
  historyList,
  onClearHistory,
  onToggleFavorite,
  translationPreferences,
  onUpdatePreferences,
}: HistorySettingsScreenProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"history" | "settings">("history");
  const [showDefaultScriptModal, setShowDefaultScriptModal] = useState(false);

  const handleCopy = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-EG";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-y-auto pb-10 bg-[#f8f9ff] text-[#0d1c2e] font-sans custom-scrollbar">
      {/* Sub-nav Pill Header for smooth screen toggling */}
      <div className="px-5 pt-3 pb-3 flex justify-center bg-white border-b border-slate-100 mb-4 shadow-2xs">
        <div className="flex bg-slate-100 p-1 rounded-full w-full max-w-xs relative">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-[#2563eb] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#2563eb] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "history" ? (
          <motion.div
            key="history-panel"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="px-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest">
                Translations Log ({historyList.length})
              </h3>
              {historyList.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-xs text-[#ba1a1a] hover:bg-[#ba1a1a]/5 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Archive
                </button>
              )}
            </div>

            <div className="space-y-4">
              {historyList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center shadow-2xs">
                  <span className="text-3xl">📭</span>
                  <p className="text-xs font-semibold text-slate-400 mt-2">
                    Translate something inside the Franco editor to populate your live database!
                  </p>
                </div>
              ) : (
                historyList.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="bg-white border border-[#e2e8f0] p-4 rounded-2xl transition-all hover:border-[#2563eb]/20 relative shadow-2xs"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Franco Input column */}
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 select-none">
                          Franco Alphabet
                        </span>
                        <p className="text-xs font-mono font-medium text-slate-800 leading-relaxed">
                          {item.franco}
                        </p>
                      </div>

                      {/* Split Divider */}
                      <div className="hidden md:block w-px bg-slate-100" />

                      {/* Arabic Output column */}
                      <div className="flex-1 border-l-2 border-l-[#2563eb] pl-3 md:border-none md:pl-0">
                        <span className="text-[9px] font-bold text-[#004ac6] uppercase tracking-widest block mb-0.5 select-none">
                          Arabic Text
                        </span>
                        <p className="font-translation-output text-slate-900 leading-normal font-medium text-right" dir="rtl">
                          {item.arabic}
                        </p>
                      </div>
                    </div>

                    {/* Actions box section */}
                    <div className="mt-3.5 pt-3 border-t border-slate-50 flex justify-end gap-3.5">
                      <button
                        onClick={() => speakText(item.arabic)}
                        className="text-slate-400 hover:text-[#004ac6] flex items-center gap-1 transition-colors"
                        title="Speak output"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleCopy(item.arabic, item.id)}
                        className="text-slate-400 hover:text-[#004ac6] flex items-center gap-1 transition-all"
                        title="Copy to Clipboard"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className={`hover:text-amber-500 flex items-center gap-1 transition-all ${
                          item.isFavorite ? "text-amber-500" : "text-slate-300"
                        }`}
                        title="Star Favorite"
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? "fill-amber-500" : ""}`} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="settings-panel"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="px-5 space-y-4"
          >
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">
              Preference Toggles
            </h3>

            {/* List Group Container */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
              
              {/* Trigger Toggle item */}
              <div 
                onClick={() => onUpdatePreferences({ autoSpeak: !translationPreferences.autoSpeak })}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#004ac6] flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0d1c2e]">Auto-speak translation</p>
                    <p className="text-[10px] text-slate-400 font-medium">Hear output immediately after translating</p>
                  </div>
                </div>
                <div>
                  {translationPreferences.autoSpeak ? (
                    <ToggleRight className="w-8 h-8 text-[#2563eb]" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </div>
              </div>

              {/* Gender Preference Section */}
              <div className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0d1c2e]">Voice gender parameter</p>
                    <p className="text-[10px] text-slate-400 font-medium">Choose synthesized vocal profile signature</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 ml-12">
                  <button
                    onClick={() => onUpdatePreferences({ voiceGender: "female" })}
                    className={`flex-1 py-2 px-4 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      translationPreferences.voiceGender === "female"
                        ? "border-[#2563eb] bg-[#eff4ff] text-[#004ac6]"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span>Female Voice 👩</span>
                  </button>
                  <button
                    onClick={() => onUpdatePreferences({ voiceGender: "male" })}
                    className={`flex-1 py-2 px-4 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      translationPreferences.voiceGender === "male"
                        ? "border-[#2563eb] bg-[#eff4ff] text-[#004ac6]"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span>Male Voice 👨</span>
                  </button>
                </div>
              </div>

              {/* Standard Language selector script */}
              <div
                onClick={() => setShowDefaultScriptModal(true)}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer border-t border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0d1c2e]">Default Arabic Script Dialect</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      {translationPreferences.arabicScript === "MSA"
                        ? "Modern Standard Arabic (MSA)"
                        : `${translationPreferences.arabicScript} local slang`}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>

            {/* Asymmetric Support App Card as seen in Screen 5 */}
            <div className="bg-gradient-to-tr from-[#004ac6] to-[#2563eb] rounded-2xl p-4 relative overflow-hidden group shadow-md mt-4">
              <div className="relative z-10 pr-20 text-white">
                <h4 className="text-sm font-bold tracking-wide">Improve Lisan Engine</h4>
                <p className="text-[10px] text-slate-100/90 leading-normal mt-1 max-w-[200px]">
                  Submit new phonetic pairs or chat slangs to our public corpus dictionary.
                </p>
                <button
                  onClick={() => alert("Thank you for contributing to modern bilingual bridges! This is compiled in our next model training run.")}
                  className="mt-3.5 bg-white text-[#004ac6] text-[10px] font-bold px-4 py-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Contribute Now
                </button>
              </div>
              <div className="absolute -right-4 -bottom-6 opacity-10 group-hover:scale-105 transition-transform duration-500 text-white">
                <HeartHandshake className="w-32 h-32" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Script dialect picker */}
      <AnimatePresence>
        {showDefaultScriptModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden p-5 shadow-2xl relative"
            >
              <h3 className="text-sm font-bold text-[#0d1c2e] uppercase tracking-wider mb-4 text-center">
                Default Arabic Dialect
              </h3>
              <div className="space-y-2">
                {[
                  { value: "MSA", label: "Modern Standard Arabic (Fusha)" },
                  { value: "Egyptian", label: "Egyptian Dialect (Masry Slang)" },
                  { value: "Levantine", label: "Levantine Dialect (Shamy Chat)" }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      onUpdatePreferences({ arabicScript: item.value as any });
                      setShowDefaultScriptModal(false);
                    }}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                      translationPreferences.arabicScript === item.value
                        ? "border-[#2563eb] bg-[#eff4ff] text-[#004ac6] font-bold"
                        : "border-slate-100 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDefaultScriptModal(false)}
                className="w-full mt-4 py-2 text-xs text-slate-500 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-center"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
