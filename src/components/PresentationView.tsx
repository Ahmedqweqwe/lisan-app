import React, { useState, useEffect } from "react";
import { Sparkles, Terminal, Languages, ShieldCheck, Heart, Cpu, Smartphone, Play, Globe, Check, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface PresentationViewProps {
  isServiceActive: boolean;
  onToggleService: () => void;
  targetLangPair: { from: string; to: string };
  children: React.ReactNode;
}

export default function PresentationView({
  isServiceActive,
  onToggleService,
  targetLangPair,
  children,
}: PresentationViewProps) {
  const [stats, setStats] = useState({ totalTranslations: 14852, hasApiKey: false });
  const [pulse, setPulse] = useState(false);

  // Fetch real count from express server
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.warn("Failed to fetch express stats:", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerVibration = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
    setPulse(true);
    setTimeout(() => setPulse(false), 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] text-[#0d1c2e] font-sans antialiased selection:bg-[#2563eb] selection:text-white pb-12">
      {/* Premium Tech Header */}
      <header className="border-b border-[#e2e8f0]/80 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004ac6] to-[#2563eb] flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/10">
              <span className="text-lg">ل</span>
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-[#0d1c2e] font-display">
                LISAN TRANSLATE <span className="text-[9px] bg-[#eff4ff] text-[#2563eb] px-2 py-0.5 rounded-full font-bold uppercase ml-1 animate-pulse">EMULATOR v3.0</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bilingual Screen Transcoder Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-500">
              <span className={`w-2 h-2 rounded-full ${stats.hasApiKey ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
              <span>{stats.hasApiKey ? "GEMINI SECRETS ACTIVE" : "LOCAL DEMO FALLBACK"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <main className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bilingual Marketing & Features */}
        <div className="lg:col-span-7 space-y-8 lg:sticky lg:top-24">
          
          {/* Welcome Display Headers */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1 bg-[#eff4ff] text-[#004ac6] px-3.5 py-1.5 rounded-full text-xs font-bold leading-none tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 fill-[#2563eb]" />
              <span>Interactive Android Emulator Inside / محاكي تجريبي متصل</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1c2e] font-display tracking-tight leading-none pt-2">
              Lisan Screen Translation <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#004ac6] to-[#2563eb]">Linguistic Bridge</span>
            </h2>
            <h3 className="text-xl md:text-2xl font-bold font-translation-output text-[#2563eb] text-right pt-1" dir="rtl">
              مترجم لسان الذكي — حلول ترجمة الفرانكو-عربي الفورية وشاشات الألعاب
            </h3>
            
            <p className="text-sm font-medium text-slate-500 leading-relaxed pt-2">
              Lisan solves the dual-script challenge. This high-fidelity dashboard emulates a live drawing overlay Android service. Powered by Gemini, Lisan lets users transcode internet slang chat keys (Franco-Arabic chat numbers like <strong className="text-[#004ac6]">3, 7, 5, 9</strong>) and standard dialogues instantly.
            </p>
          </div>

          {/* Dynamic Telemetry Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e2e8f0]/80 rounded-2xl p-4 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Core Engine AI</span>
              <span className="text-xl font-extrabold text-[#0d1c2e] block mt-1 tracking-tight">Gemini 3.5</span>
              <span className="text-[9px] font-semibold text-emerald-600 block mt-1">✓ Flash modality active</span>
            </div>
            <div className="bg-white border border-[#e2e8f0]/80 rounded-2xl p-4 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulated Server Hits</span>
              <span className="text-xl font-extrabold text-[#004ac6] block mt-1 tracking-tight">
                {stats.totalTranslations.toLocaleString()}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 block mt-1">⚡ real-time update</span>
            </div>
            <div className="bg-white border border-[#e2e8f0]/80 rounded-2xl p-4 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Vibration Driver</span>
              <button
                onClick={triggerVibration}
                className={`text-[10px] px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg mt-2 transition-all cursor-pointer ${
                  pulse ? "scale-95 animate-ping" : ""
                }`}
              >
                TEST HAPTIC 📲
              </button>
            </div>
          </div>

          {/* How to Interact Bilingual Instruction Grid */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#2563eb]" /> QUICK LAB SPECIFICATIONS / دليل تجربة المحاكي التفاعلي
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-[#004ac6] uppercase tracking-wider block">1. Start Backdrop Overlay (Home)</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Inside the simulated phone mockup, tap the big <strong className="text-[#0d1c2e]">Power START</strong> toggle. This activates the background listener widget represented by the blue round button.
                </p>
                <span className="text-[11px] font-bold text-[#004ac6] block pt-1 border-t border-slate-50 text-right font-translation-output" dir="rtl">
                  اضغط زر التشغيل الدائري الأحمر (ابدأ الخدمة) داخل واجهة الهاتف لتفعيل الأيقونة العائمة فوق التطبيقات الأخرى.
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-[#004ac6] uppercase tracking-wider block">2. Scroll Reels or Messages</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Swipe up to scroll through standard reels on the <strong className="text-[#0d1c2e]">Reels 📽️</strong> screen, or send custom talk bubbles on the <strong className="text-[#0d1c2e]">Chat 💬</strong> tab. Tap any bubble with the overlay active to translate.
                </p>
                <span className="text-[11px] font-bold text-[#004ac6] block pt-1 border-t border-slate-50 text-right font-translation-output" dir="rtl">
                  تصفح الفيديوهات وقنوات الدردشة الحية، اسحب أو اضغط على أي فقرة محادثة بمجرد لمس أيقونة لسان العائمة لتجربة الترجمة التفاعلية التلقائية.
                </span>
              </div>
            </div>
          </div>

          {/* Secrets guide notification */}
          {!stats.hasApiKey && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold leading-none mb-1">Local Sandbox Mode Enabled</h5>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  To experience advanced multilingual Gemini translations beyond our preloaded dictionaries, you can add your real Google key in the **Settings &gt; Secrets** panel in the AI Studio sidebar at any time.
                </p>
              </div>
            </div>
          )}

          {/* Quick Sandbox Action bar */}
          <div className="bg-[#eff4ff] border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-[#0d1c2e] leading-tight">Run Translator Engine</h5>
                <p className="text-[10px] text-slate-500 font-semibold">Perform instant Franco translation</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                const targetEl = document.querySelector("nav");
                if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-full text-xs font-bold shadow-lg shadow-blue-500/10 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>LAUNCH SIMULATOR PLAYTIME</span>
            </button>
          </div>
        </div>

        {/* Right Column: High-Fidelity 120Hz Phone Emulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 w-full flex flex-col items-center space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-extrabold text-[#2563eb] tracking-widest uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 select-none">
                Interactive Curved Android AMOLED Mock
              </span>
            </div>
            
            {/* The Actual Enclosed Emulator Display */}
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
