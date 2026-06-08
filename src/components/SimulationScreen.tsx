import React, { useState } from "react";
import { Send, Check, ShieldCheck, Heart, Trash2, Languages, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SimulationMessage } from "../types";

interface SimulationScreenProps {
  isServiceActive: boolean;
  onPostTranslate: (text: string) => Promise<string>;
}

export default function SimulationScreen({ isServiceActive, onPostTranslate }: SimulationScreenProps) {
  const [messages, setMessages] = useState<SimulationMessage[]>([
    { id: "1", sender: "other", text: "Salam ya hoby! 3amel eh?" },
    { id: "2", sender: "user", text: "El hamdullah, kolo تمام. Kont f el gami3a el nharda." },
    { id: "3", sender: "other", text: "Eshta, netabel bokra enshallah? b7es nla5s el wadifa." },
    { id: "4", sender: "other", text: "Hello friend, I hope you are having a wonderful day exploring this interface." }
  ]);
  const [inputText, setInputText] = useState("");
  const [activeTranslateMsgId, setActiveTranslateMsgId] = useState<string | null>(null);
  const [translationMap, setTranslationMap] = useState<Record<string, string>>({});
  const [translatingMsgId, setTranslatingMsgId] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: SimulationMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");
  };

  const handleTranslateMessage = async (msg: SimulationMessage) => {
    if (!isServiceActive) {
      alert("Start Overlay Service in 'Home' tab first to unlock this floating bubble trigger!");
      return;
    }

    if (translationMap[msg.id]) {
      // Toggle
      setActiveTranslateMsgId(prev => (prev === msg.id ? null : msg.id));
      return;
    }

    setTranslatingMsgId(msg.id);
    try {
      const translated = await onPostTranslate(msg.text);
      setTranslationMap(prev => ({ ...prev, [msg.id]: translated }));
      setActiveTranslateMsgId(msg.id);
    } catch {
      // Direct Local fallback
      setTranslationMap(prev => ({ ...prev, [msg.id]: "مرحباً يا صديقي، عساك بخير" }));
      setActiveTranslateMsgId(msg.id);
    } finally {
      setTranslatingMsgId(null);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setTranslationMap({});
    setActiveTranslateMsgId(null);
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-[#f1f5f9] text-[#0d1c2e] font-sans relative">
      {/* Simulation Room Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center font-bold text-white text-xs">
            OM
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight">Omar Mahmoud</h3>
            <span className="text-[9px] text-[#2563eb] font-semibold flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full animate-ping" /> Online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            className="p-1 px-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
            title="Clear Chat Room"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide disclaimer band */}
      <div className="bg-[#eff4ff] text-[#004ac6] border-b border-blue-100 px-4 py-1.5 text-[10px] font-semibold flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Languages className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>Click any speech bubble to test simulated overlay OCR translation!</span>
        </div>
        {isServiceActive ? (
          <span className="text-[8px] bg-[#2563eb] text-white px-1.5 py-0.5 rounded font-extrabold uppercase">
            ACTIVE bubble ON
          </span>
        ) : (
          <span className="text-[8px] bg-[#ba1a1a] text-white px-1.5 py-0.5 rounded font-extrabold uppercase">
            Bubble OFF
          </span>
        )}
      </div>

      {/* Chat Messages Frame */}
      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar flex flex-col">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isTranslatingThis = translatingMsgId === msg.id;
          const hasTranslation = !!translationMap[msg.id];
          const isTranslationOpen = activeTranslateMsgId === msg.id;

          return (
            <div key={msg.id} className="flex flex-col">
              {/* Message Bubble Container */}
              <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  onClick={() => handleTranslateMessage(msg)}
                  className={`max-w-[80%] rounded-2xl p-3 shadow-xs cursor-pointer select-none relative group transition-all duration-200 active:scale-98 ${
                    isUser
                      ? "bg-[#2563eb] text-white rounded-br-xs hover:bg-[#004ac6]"
                      : "bg-white text-[#0d1c2e] rounded-bl-xs hover:bg-slate-50 border border-slate-100"
                  }`}
                >
                  {/* Speech Text */}
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  
                  {/* Status checklist tick */}
                  <div className="flex justify-end mt-1 text-[8px] opacity-60">
                    <span className="mr-1">1:24 PM</span>
                    {isUser && <Check className="w-3 h-3 text-white inline ml-0.5" />}
                  </div>

                  {/* Tiny simulated bubble hovering triggers overlay cue */}
                  <div className="absolute right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2563eb] text-white p-1 rounded-full shadow z-10 w-4 h-4 flex items-center justify-center">
                    <span className="text-[8px] font-extrabold font-sans">文</span>
                  </div>
                </div>
              </div>

              {/* Translation Overlay Card below this message */}
              <AnimatePresence>
                {isTranslationOpen && hasTranslation && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: -5 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -5 }}
                    className={`flex w-full mt-1 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className="bg-white border-l-4 border-[#2563eb] rounded-xl q-shadow p-3 max-w-[85%] border border-slate-200/80">
                      <div className="flex items-center justify-between border-b pb-1 mb-2">
                        <span className="text-[9px] font-bold text-[#2563eb] uppercase tracking-wider flex items-center gap-1">
                          <Languages className="w-3 h-3" /> Lisan Popover Translation
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTranslateMsgId(null);
                            }}
                            className="text-[9px] text-slate-400 font-bold hover:text-slate-600"
                          >
                            DISMISS
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 text-right" dir="rtl">
                        <span className="text-[9px] text-[#2563eb] font-bold uppercase block tracking-wider text-left" dir="ltr">
                          Arabic Text (Egyptian dialect)
                        </span>
                        <p className="font-translation-output text-slate-800 leading-normal font-medium">
                          {translationMap[msg.id]}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loader indicator while requesting API */}
              {isTranslatingThis && (
                <div className={`flex w-full mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-full animate-pulse font-semibold">
                    Lisan is analyzing text...
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message Typing Panel */}
      <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-slate-200 flex gap-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type Franco/English (e.g. ezayek? saba7 el kheur)"
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full py-2 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb]"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-full bg-[#2563eb] hover:bg-[#004ac6] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
}
