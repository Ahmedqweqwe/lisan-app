import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory stats counter for some nice dynamic telemetry in the emulator
let translationCount = 14852; // Mock total historical server translations

// Lazy initializer for Google Gen AI following system constraints
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// A dictionary-based smart fallback translator for immediate offline usage
const LOCAL_FRANCO_DICTIONARY: Record<string, string> = {
  "3amel eh": "عامل ايه؟",
  "3amel eh?": "عامل ايه؟",
  "ezayak ya sahbi?": "ازيك يا صاحبي؟",
  "ezayak ya sahbi? eh el akhbar?": "ازيك يا صاحبي؟ ايه الأخبار؟",
  "ezayak ya sahbi": "ازيك يا صاحبي؟",
  "kolo tamam": "كلو تمام",
  "shokran ya hoby": "شكراً يا حبي",
  "ana kont f el gami3a el nharda.": "أنا كنت في الجامعة النهاردة.",
  "ana kont f el gami3a": "أنا كنت في الجامعة",
  "eshta, netabel bokra enshallah.": "قشطة، نتقابل بكرة إن شاء الله.",
  "eshta": "قشطة",
  "netabel bokra": "نتقابل بكرة",
  "mar7aba": "مرحباً",
  "saba7 el kheur": "صباح الخير",
  "sabah el khair": "صباح الخير",
  "masa2 el kheur": "مساء الخير",
  "ezayak": "ازيك؟",
  "ezayek": "ازيكِ؟",
  "el hamdullah": "الحمد لله",
  "mashi": "ماشي",
  "habibi": "حبيبي",
  "ya hoby": "يا حبي",
  "shokran": "شكراً",
  "alf shokr": "ألف شكر",
  "re7la sa3ida": "رحلة سعيدة",
  "tamam": "تمام",
  "3alaty": "عائلتي",
  "be7ebak": "بحبك",
  "bokra": "بكرة",
  "el nharda": "النهاردة",
  "ba3d bokra": "بعد بكرة",
  "fain": "فين؟",
  "fein": "فين؟",
  "imta": "امتى؟",
  "leh": "ليه؟",
  "3ashan": "عشان",
  "minimiss": "تصغير",
  "hello friend": "أهلاً يا صديقي",
  "exploring the hidden gems of the city. this translation tool is a lifesaver!": "استكشاف الجواهر الخفية في المدينة. أداة الترجمة هذه منقذة للحياة!",
  "learning franco-arabic has never been this easy. real-time screen translation is a game changer.": "لم يكن تعلم الفرانكو-عربي بهذه السهولة من قبل. ترجمة الشاشة في الوقت الفعلي غيرت قواعد اللعبة."
};

const LOCAL_ARABIC_TO_FRANCO: Record<string, string> = {
  "عامل ايه": "3amel eh?",
  "عامل ايه؟": "3amel eh?",
  "ازيك يا صاحبي": "ezayak ya sahbi",
  "ازيك يا صاحبي؟ ايه الأخبار؟": "ezayak ya sahbi? eh el akhbar?",
  "كلو تمام": "kolo tamam",
  "شكراً يا حبي": "shokran ya hoby",
  "أنا كنت في الجامعة النهاردة.": "ana kont f el gami3a el nharda.",
  "قشطة، نتقابل بكرة إن شاء الله.": "eshta, netabel bokra enshallah.",
  "أهلاً يا صديقي": "hello friend"
};

// Simple heuristic fallback function
function localTranslate(text: string, from: string, to: string): string {
  const normalized = text.toLowerCase().trim().replace(/[?.!,]/g, "");
  
  if (from === "franco" || from === "english") {
    // Check direct dictionary
    if (LOCAL_FRANCO_DICTIONARY[normalized]) {
      return LOCAL_FRANCO_DICTIONARY[normalized];
    }
    for (const [key, value] of Object.entries(LOCAL_FRANCO_DICTIONARY)) {
      if (normalized.includes(key)) {
        return value;
      }
    }
  } else {
    // Check Arabic dictionary
    if (LOCAL_ARABIC_TO_FRANCO[normalized]) {
      return LOCAL_ARABIC_TO_FRANCO[normalized];
    }
    for (const [key, value] of Object.entries(LOCAL_ARABIC_TO_FRANCO)) {
      if (normalized.includes(key)) {
        return value;
      }
    }
  }

  // If no entry, perform phonetic mapping heuristic
  if (from === "franco") {
    let result = text.toLowerCase()
      .replace(/3/g, "ع")
      .replace(/7/g, "ح")
      .replace(/5/g, "خ")
      .replace(/2/g, "ء")
      .replace(/9/g, "ط")
      .replace(/8/g, "غ")
      .replace(/sh/g, "ش")
      .replace(/kh/g, "خ")
      .replace(/th/g, "ث")
      .replace(/gh/g, "غ")
      .replace(/a/g, "ا")
      .replace(/b/g, "ب")
      .replace(/t/g, "ت")
      .replace(/g/g, "ج")
      .replace(/d/g, "د")
      .replace(/r/g, "ر")
      .replace(/z/g, "ز")
      .replace(/s/g, "س")
      .replace(/f/g, "ف")
      .replace(/q/g, "ق")
      .replace(/k/g, "ك")
      .replace(/l/g, "ل")
      .replace(/m/g, "م")
      .replace(/n/g, "ن")
      .replace(/h/g, "ه")
      .replace(/w/g, "و")
      .replace(/y/g, "ي");
    return result + " (ترجمة تقريبية)";
  }

  return `[Translated ${text.substring(0, 15)}]`;
}

// API Routes
app.get("/api/stats", (req, res) => {
  res.json({
    totalTranslations: translationCount,
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
  });
});

app.post("/api/translate", async (req, res) => {
  const { text, from = "franco", to = "arabic" } = req.body;
  
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is empty" });
  }

  translationCount++;

  const ai = getGeminiClient();
  if (!ai) {
    // Falling back gracefully
    const localResult = localTranslate(text, from, to);
    return res.json({ 
      translatedText: localResult, 
      method: "Local Rule-based Falling Back (Configure GEMINI_API_KEY for full dialect support)" 
    });
  }

  try {
    const prompt = `You are a professional bilingual translation engine called "Lisan".
Translate the following text.
From: ${from} (could be 'franco' - which is Arabic written in English alphabet and numbers, 'arabic' - Standard/Egyptian, or 'english')
To: ${to} (e.g. 'arabic', 'franco', or 'english')

Text to translate:
"${text}"

Rules:
1. Translate accurately, keeping natural dialects (e.g. Egyptian/Arab chat dialects) intact where appropriate.
2. If translating 'franco' to 'arabic', convert Franco-Arabic numerals (like 3 for ع, 7 for ح, 5 for خ, etc.) to the respective Arabic letters.
3. Return ONLY the translated string. Do not include any extra introductory/explanatory sentences, quotes, notes, or greetings. Keep it formatted perfectly for directly displaying in an app result.
4. If the text has emoji, preserve them at the end.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    const translatedText = response.text?.trim() || "";
    return res.json({ 
      translatedText, 
      method: "Gemini AI (3.5-Flash)" 
    });
  } catch (error: any) {
    console.error("Gemini Translation Error:", error);
    // Graceful error fallback
    const localResult = localTranslate(text, from, to);
    return res.json({ 
      translatedText: localResult, 
      method: `Local Heuristic Fallback (Gemini Error: ${error.message || "Unknown error"})` 
    });
  }
});

// Configure Vite or Static Assets middleware
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lisan Server boot complete. Listening at http://localhost:${PORT}`);
  });
}

setupServer();
