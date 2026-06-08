import React, { useState, useEffect } from "react";
import { Sparkles, X, Volume2, Copy, Share2, CornerDownRight, History, ArrowRight, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HistoryItem, TranslationPreferences } from "../types";

interface DirectTranslateScreenProps {
  onAddHistoryItem: (item: HistoryItem) => void;
  historyList: HistoryItem[];
  translationPreferences: TranslationPreferences;
  onPostTranslate: (text: string, from: string, to: string) => Promise<{ translatedText: string; method: string }>;
}

export default function DirectTranslateScreen({
  onAddHistoryItem,
  historyList,
  translationPreferences,
  onPostTranslate,
}: DirectTranslateScreenProps) {
  const [inputText, setInputText] = useState("");
  const [translatedResult, setTranslatedResult] = useState<string | null>(null);
  const [translateMethod, setTranslateMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLanguageSwapped, setIsLanguageSwapped] = useState(false); // false: Franco -> Arabic, true: Arabic -> Franco

  // Speak the translated Arabic script aloud
  const handleSpeakResult = () => {
    if (!translatedResult) return;
    const utterance = new SpeechSynthesisUtterance(translatedResult);
    
    // Set language / voice parameters based on preferences
    utterance.lang = "ar-EG"; // Arabic (Egypt)
    
    // Choose gender voice if available
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      if (translationPreferences.voiceGender === "female") {
        return name.includes("ar") && (name.includes("female") || name.includes("google") || name.includes("zira") || name.includes("samantha"));
      } else {
        return name.includes("ar") && (name.includes("male") || name.includes("david") || name.includes("mark"));
      }
    });

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyResult = () => {
    if (!translatedResult) return;
    navigator.clipboard.writeText(translatedResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareResult = () => {
    if (!translatedResult) return;
    if (navigator.share) {
      navigator.share({
        title: "Lisan Translation",
        text: `${inputText} -> ${translatedResult}`
      }).catch(console.error);
    } else {
      alert("Sharing shared to clipboard!");
      handleCopyResult();
    }
  };

  const handleTranslateSubmit = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    const sourceLang = isLanguageSwapped ? "arabic" : "franco";
    const targetLang = isLanguageSwapped ? "franco" : "arabic";

    try {
      const response = await onPostTranslate(inputText, sourceLang, targetLang);
      setTranslatedResult(response.translatedText);
      setTranslateMethod(response.method);

      // Append translation to global state history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        franco: isLanguageSwapped ? response.translatedText : inputText,
        arabic: isLanguageSwapped ? inputText : response.translatedText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isFavorite: false,
      };

      onAddHistoryItem(newHistoryItem);

      // Trigger auto-speak if preference is enabled
      if (translationPreferences.autoSpeak) {
        setTimeout(() => {
          const speakUtterance = new SpeechSynthesisUtterance(response.translatedText);
          speakUtterance.lang = "ar-EG";
          window.speechSynthesis.speak(speakUtterance);
        }, 300);
      }
    } catch (err) {
      console.error(err);
      setTranslatedResult("عذراً، حدث خطأ في الترجمة");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setTranslatedResult(null);
    setTranslateMethod(null);
  };

  const handleHistoryPreviewClick = (item: HistoryItem) => {
    setInputText(isLanguageSwapped ? item.arabic : item.franco);
    setTranslatedResult(isLanguageSwapped ? item.franco : item.arabic);
    setTranslateMethod("Loaded legacy item from database");
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-y-auto pb-10 bg-[#f8f9ff] text-[#0d1c2e] font-sans custom-scrollbar px-margin-mobile">
      {/* Dynamic Languages Pill Switcher */}
      <div className="flex justify-center mt-4 mb-5">
        <motion.button
          onClick={() => setIsLanguageSwapped(!isLanguageSwapped)}
          whileTap={{ scale: 0.95 }}
          className="bg-white border border-[#c3c6d7] rounded-full px-5 py-2 flex items-center gap-3 shadow-none hover:border-[#2563eb] transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold text-[#004ac6] uppercase tracking-widest">
            {isLanguageSwapped ? "Arabic" : "Franco-Chat String"}
          </span>
          <div className="bg-[#eff4ff] p-1.5 rounded-full text-[#2563eb]">
            <svg
              className="w-3.5 h-3.5 fill-none stroke-current"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21 16-4 4-4-4" />
              <path d="M17 20V4" />
              <path d="m3 8 4-4 4 4" />
              <path d="M7 4v16" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-[#004ac6] uppercase tracking-widest">
            {isLanguageSwapped ? "Franco-Chat String" : "Arabic Output"}
          </span>
        </motion.button>
      </div>

      {/* Entry Box Cards */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] relative transition-all duration-300 focus-within:ring-1 focus-within:ring-[#2563eb]/20 focus-within:border-[#2563eb]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {isLanguageSwapped ? "Source: Arabic Script" : "Source: Franco chat-style Text"}
          </span>
          {inputText && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={500}
          className="w-full h-24 bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none text-sm text-[#0d1c2e] placeholder-slate-400 p-0"
          placeholder={
            isLanguageSwapped
              ? "اكتب النص العربي هنا (مثال: عامل ايه؟)..."
              : "Enter Franco chat phrases (e.g. 3amel eh, ezayak ya sahbi?)..."
          }
        />

        <div className="flex justify-end pt-1 border-t border-slate-50">
          <span className="text-[9px] font-bold text-slate-400">{inputText.length} / 500 chars</span>
        </div>
      </div>

      {/* Action Translate Sparkle Button */}
      <div className="flex justify-center -my-3.5 z-10">
        <motion.button
          onClick={handleTranslateSubmit}
          disabled={isLoading || !inputText.trim()}
          whileTap={{ scale: 0.95 }}
          className={`px-10 py-3 rounded-full text-white shadow-lg flex items-center gap-2 text-xs font-bold transition-all transition-transform ${
            isLoading || !inputText.trim()
              ? "bg-[#6b6e70] opacity-50 cursor-not-allowed"
              : "bg-[#004ac6] hover:bg-[#2563eb] hover:shadow-xl hover:shadow-blue-500/10"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Translating...
            </>
          ) : (
            <>
              <span>TRANSCODE NOW</span>
              <Sparkles className="w-4 h-4 animate-pulse fill-white" />
            </>
          )}
        </motion.button>
      </div>

      {/* Output Results display card */}
      <div className="h-6" /> {/* spacer for absolute visual symmetry */}
      <AnimatePresence>
        {translatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] border-l-4 border-l-[#004ac6] relative shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold text-[#004ac6] uppercase tracking-widest">
                  {isLanguageSwapped ? "Result: Franco Output" : "Result: Arabic Output"}
                </span>

                <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                  <button
                    onClick={handleCopyResult}
                    className="p-1.5 rounded hover:bg-white text-slate-400 hover:text-[#004ac6] transition-colors"
                    title="Copy toClipboard"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleShareResult}
                    className="p-1.5 rounded hover:bg-white text-slate-400 hover:text-[#004ac6] transition-all"
                    title="Share Result"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Translated String */}
              <div className="py-2">
                <p
                  className={`text-[#0d1c2e] font-medium leading-relaxed ${
                    isLanguageSwapped
                      ? "text-xs font-mono text-left"
                      : "font-translation-output text-lg text-right tracking-wide leading-loose"
                  }`}
                  dir={isLanguageSwapped ? "ltr" : "rtl"}
                >
                  {translatedResult}
                </p>
              </div>

              {/* Speak action footer if result is Arabic */}
              {!isLanguageSwapped && (
                <div className="mt-2 pt-2 border-t border-slate-50 flex justify-start">
                  <button
                    onClick={handleSpeakResult}
                    className="flex items-center gap-1.5 text-xs text-[#004ac6] hover:bg-[#eff4ff] px-3 py-1 rounded-full transition-all group font-bold"
                  >
                    <Volume2 className="w-4 h-4 text-[#2563eb] group-active:scale-90 transition-transform" />
                    <span>AUDIO TTS SPEAK</span>
                  </button>
                </div>
              )}

              {/* Source/Engine attribution tag */}
              {translateMethod && (
                <div className="absolute right-3 bottom-1.5 text-[8px] text-slate-300 font-medium select-none uppercase tracking-widest">
                  {translateMethod}
                </div>
              )}
            </div>

            {/* Suggestions chip row */}
            <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#001e2b]">
              <div 
                onClick={() => setInputText(isLanguageSwapped ? "عامله ايه ونبي؟" : "kolo tamam ya basha")}
                className="bg-[#c0e8ff] hover:bg-[#7bd1fa] px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Mock: {isLanguageSwapped ? "Arabic Sample" : "Classic chat"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History previews logs at floor */}
      <section className="mt-6 border-t border-[#e2e8f0]/80 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-slate-400" />
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Translations Database</h4>
        </div>

        <div className="space-y-2">
          {historyList.length === 0 ? (
            <div className="text-center py-4 text-[10px] text-slate-400 font-semibold select-none">
              Offline translation records are currently empty.
            </div>
          ) : (
            historyList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => handleHistoryPreviewClick(item)}
                className="bg-white border border-[#e2e8f0] rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:border-[#2563eb] hover:bg-slate-50/50 transition-all active:scale-[0.99]"
              >
                <div className="flex flex-col text-slate-700 font-medium overflow-hidden pr-3">
                  <span className="text-[11px] font-mono truncate">{item.franco}</span>
                  <span className="text-xs text-slate-500 font-translation-output truncate mt-0.5" dir="rtl">
                    {item.arabic}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563eb] transition-colors flex-shrink-0" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
