import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Plus, Music2, AlertCircle, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SocialPost } from "../types";

// Dynamic atmospheric images as seen in the mockup references
const SAMPLE_POSTS: SocialPost[] = [
  {
    id: "post_1",
    author: "global_explorer",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfdX0sB8_NzEoWiHr_2uwxIjKOZRYqPpfSwD0TK7U64xtlkIQNq76qgCktLVrGIynvxp5yDi8Ee1Gw6BZrL9037aAz6f0R-bsXLyn0hSnboFqzK-GoysQkN0Rrw_YEEvwAK9N5jN9J_2X-wgO2qlZ_7YnEPU1XZn1OtqsS86Ex9MlZhxTHi7lsw2EPpcvjTEniNfz2GY7Kh6s9ZsmEPoYr_y1lk3MCr4hCnw5efY-npf50VQdqIgFWzpl5QscTjAVNG-yJ01OHmrXB",
    videoCoverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUJH1pDs0NKvREi5ulOxqBpz0IUirER4aUm2HB6QRSUzv6byLU5xkF37cIvjYpn2xVeh0zrCqoRN4v92kJFzh1so5JYWPHZspOIHwBF1U7gp71qZFE_pPAFOxGSgtWY9UcuxrxHJle0yrLoGyaLCuuqUM2o0pwyE86Ue2IEu0qmSQ8eEWl55GXLsqZ2BWtp8lq4LbCgk4hr2TCJw1SXaa60aOj53wCYUkpYaYgcDl_n9wvoPB--JzfBULiNNZpFwF5i98VMbZf0TTv",
    caption: "Exploring the hidden gems of the city. This translation tool is a lifesaver! #travel #tokyo #translate",
    audioName: "Original Audio - Tokyo Nights",
    likes: "124K",
    comments: "1.2K",
    bookmarks: "45K",
    shares: "12K",
    originalText: "Exploring the hidden gems of the city. This translation tool is a lifesaver!",
    translatedArabic: "استكشاف الجواهر الخفية في المدينة. أداة الترجمة هذه منقذة للحياة حقاً!"
  },
  {
    id: "post_2",
    author: "linguist_pro",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDevyJfQfddj6T7C8luyUG_Ik8zwf0Lu4z56HN980aUTqPRzJcGmlZrh9zKnWw52_65xqHotL5NVY2_C1tAVudJDFHRegW3bKU7JcYOStSBlvbwtwQdNOe4_yrR8l_11QCyrj_7ga4yqdGc82lW4dHf3V-3AVP31GyWdPwotFRuLWXtXVQCsJ-veraY_kko3g9oj9PLkc8vdut1-jvq6dHIsbUv0TSsZVD5impBGOXE2aQVAaWvnrFX2Mllx45NB8L2V2iQTkML3zNM",
    videoCoverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCe-kO3FPDF6Rzd11WLkFI5nTARHoM_iXlJs_cSGMrgStUnHcRS_lEabP7g3MxZBeUJ557lhrCl1oBfzNUcLSeBmW2yQ10uBzsMUfFqM-kqpsrImjiBFXr3bWq75ucXyY_k64L0s4v0lNe2gk3VkSrUI7NXNBhEOi-1iG1rvaq2a0YRvFRU8CCrvJJlyi0zUd6Sf9N2b3LM5XlC-wKRzXIrmvwqMHZxvJV98JdBeTC0R3slcVBwDo58QXN1AOJ1hx-SL1NwTivZpEEt",
    caption: "3ala fikra, learning Franco-Arabic has never been this easy! Real-time screen translation is a game changer. 📲",
    audioName: "Lo-Fi Beats for Studying",
    likes: "89K",
    comments: "854",
    bookmarks: "18K",
    shares: "6K",
    originalText: "3ala fikra, learning Franco-Arabic has never been this easy! Real-time screen translation is a game changer.",
    translatedArabic: "على فكرة، لم يكن تعلم الفرانكو-عربي بهذه السهولة من قبل! ترجمة الشاشة في الوقت الفعلي غيرت قواعد اللعبة."
  }
];

interface SocialFeedScreenProps {
  isServiceActive: boolean;
  bubbleCoords: { x: number; y: number };
  onUpdateBubbleCoords: (coords: { x: number; y: number }) => void;
  onPostTranslate: (text: string) => Promise<string>;
}

export default function SocialFeedScreen({
  isServiceActive,
  bubbleCoords,
  onUpdateBubbleCoords,
  onPostTranslate,
}: SocialFeedScreenProps) {
  const [activePostIdx, setActivePostIdx] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTranslation, setActiveTranslation] = useState<string | null>(null);
  const [showTranslateToast, setShowTranslateToast] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Vertical scroll sensing
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    if (height > 0) {
      const idx = Math.min(
        SAMPLE_POSTS.length - 1,
        Math.max(0, Math.round(scrollTop / height))
      );
      if (idx !== activePostIdx) {
        setActivePostIdx(idx);
        setActiveTranslation(null); // Clear active translations
      }
    }
  };

  const handleLike = (postId: string) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const currentPost = SAMPLE_POSTS[activePostIdx];

  // Trigger floating translate simulation on current post
  const triggerOverlayTranslation = async () => {
    if (!isServiceActive) {
      setShowTranslateToast(true);
      setTimeout(() => setShowTranslateToast(false), 2500);
      return;
    }

    setIsTranslating(true);
    try {
      const result = await onPostTranslate(currentPost.originalText);
      setActiveTranslation(result);
    } catch {
      setActiveTranslation(currentPost.translatedArabic);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="relative flex-1 h-full w-full bg-black text-white select-none">
      {/* Scrollable reels */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {SAMPLE_POSTS.map((post, idx) => (
          <div
            key={post.id}
            className="w-full h-full snap-start relative flex flex-col justify-end bg-zinc-900"
          >
            {/* Background Cover Image */}
            <img
              src={post.videoCoverUrl}
              alt={post.caption}
              className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
            />

            {/* Gradient Overlay bottom shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30 pointer-events-none" />

            {/* Post details */}
            <div className="absolute left-4 bottom-20 right-16 z-20 space-y-3 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight">@{post.author}</span>
                <span className="text-[10px] bg-[#2563eb] text-white px-1.5 py-0.5 rounded-full font-semibold">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-100 line-clamp-2 leading-relaxed max-w-[280px]">
                {post.caption}
              </p>
              
              {/* Music badge */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 w-fit border border-white/5">
                <Music2 className="w-3.5 h-3.5 animate-spin-slow text-blue-400" />
                <span className="text-[10px] font-semibold text-slate-200">{post.audioName}</span>
              </div>
            </div>

            {/* Sidebar actions */}
            <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center gap-5 pointer-events-auto">
              {/* Creator profile */}
              <div className="relative mb-2">
                <img
                  src={post.avatarUrl}
                  alt={post.author}
                  className="w-10 h-10 rounded-full border-2 border-[#2563eb] object-cover shadow-md"
                />
                <button className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white rounded-full p-0.5 shadow-sm active:scale-90">
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Likes */}
              <button
                onClick={() => handleLike(post.id)}
                className="flex flex-col items-center text-slate-200 group active:scale-95 transition-all"
              >
                <Heart
                  className={`w-7 h-7 mb-0.5 transition-all group-hover:scale-110 ${
                    likedPosts[post.id] ? "fill-red-500 text-red-500" : "text-white"
                  }`}
                />
                <span className="text-[10px] font-semibold tracking-wide">{post.likes}</span>
              </button>

              {/* Comments */}
              <div className="flex flex-col items-center text-slate-200">
                <MessageCircle className="w-7 h-7 mb-0.5 hover:text-blue-400" />
                <span className="text-[10px] font-semibold tracking-wide">{post.comments}</span>
              </div>

              {/* Bookmark */}
              <div className="flex flex-col items-center text-slate-200">
                <Bookmark className="w-7 h-7 mb-0.5 hover:text-yellow-400" />
                <span className="text-[10px] font-semibold tracking-wide">{post.bookmarks}</span>
              </div>

              {/* Share */}
              <div className="flex flex-col items-center text-slate-200">
                <Share2 className="w-7 h-7 mb-0.5 hover:text-teal-400" />
                <span className="text-[10px] font-semibold tracking-wide">{post.shares}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Interactive Translate Widget Trigger (when overlay service is active) */}
      <AnimatePresence>
        {isServiceActive ? (
          <div className="absolute inset-0 pointer-events-none z-30">
            {/* The Draggable / Interactive Translate Bubble Layer */}
            <motion.button
              drag
              dragConstraints={containerRef}
              style={{ x: bubbleCoords.x, y: bubbleCoords.y }}
              onDragEnd={(e, info) => {
                onUpdateBubbleCoords({ x: info.point.x, y: info.point.y });
              }}
              whileTap={{ scale: 1.15 }}
              onClick={triggerOverlayTranslation}
              className="absolute top-[40%] right-6 w-14 h-14 bg-[#2563eb] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer pointer-events-auto floating-bubble z-40 active:scale-95 transition-transform"
            >
              <motion.div
                animate={{ rotate: isTranslating ? 360 : 0 }}
                transition={isTranslating ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              >
                <svg
                  className="w-7 h-7 text-white fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 8 6 6" />
                  <path d="m4 14 6-6 2-3" />
                  <path d="M2 5h12" />
                  <path d="M7 2h1" />
                  <path d="m22 22-5-10-5 10" />
                  <path d="M14 18h6" />
                </svg>
              </motion.div>
              <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-25" />
            </motion.button>

            {/* Translation Output Dialog Overlay inside the screen */}
            <AnimatePresence>
              {activeTranslation && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  className="absolute bottom-24 left-4 right-4 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 pointer-events-auto z-40"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span className="text-[10px] font-bold text-[#7bd1fa] tracking-widest uppercase">
                      Lisan Instant Capture
                    </span>
                    <button
                      onClick={() => setActiveTranslation(null)}
                      className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded"
                    >
                      CLOSE
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        Original Text
                      </span>
                      <p className="text-xs text-slate-100">{currentPost.originalText}</p>
                    </div>
                    <div className="h-0.5 bg-slate-800" />
                    <div>
                      <span className="text-[10px] font-semibold text-[#7bd1fa] uppercase tracking-wide">
                        Arabic Translation (MSA)
                      </span>
                      <p className="text-base text-right font-medium text-white leading-normal pt-1" dir="rtl">
                        {activeTranslation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Alert hint when service is off */
          <AnimatePresence>
            {showTranslateToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 20 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-10 left-4 right-4 z-50 bg-[#ba1a1a] text-white p-3 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-semibold">
                  Start Overlay Service in Home Tab to enable Screen Translation.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </AnimatePresence>

      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 text-[10px] text-slate-300 font-semibold flex items-center gap-1.5">
        <Fingerprint className="w-3.5 h-3.5 text-[#2563eb] animate-pulse" />
        Swipe up for next post. Tap Lisan button to translate.
      </div>
    </div>
  );
}
