import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TOOLS = [
  {
    id: 1,
    emoji: "📈",
    title: "Viral Reel Ideas",
    subtitle: "5 scroll-stopping concepts with high share potential",
    hasInput: false,
    buildPrompt: (clinic) =>
      `Act as a social media growth strategist specializing in dental aesthetics. Generate 5 scroll-stopping Instagram Reel ideas with high share potential, specifically for ${clinic.name} — a boutique dental clinic in Paleo Faliro, Athens focused on ${clinic.focus}. For each idea include: a hook line, the visual concept, and one sentence on why it will go viral. Be specific. No fluff.`,
  },
  {
    id: 2,
    emoji: "💢",
    title: "Pain → Hook Converter",
    subtitle: "Turn patient frustrations into bold, punchy hooks",
    hasInput: false,
    buildPrompt: (clinic) =>
      `List the 10 biggest frustrations patients have about ${clinic.focus}. Then turn each one into a bold, punchy Instagram hook of 10 words max. Be direct. Be provocative. Format as: Frustration → Hook. Target patients in Greece considering ${clinic.name}.`,
  },
  {
    id: 3,
    emoji: "🎬",
    title: "Reels Script",
    subtitle: "30-second script structured to hold attention",
    hasInput: true,
    inputLabel: "Topic (e.g. 'teeth whitening results' or 'implants vs veneers')",
    buildPrompt: (clinic, input) =>
      `Write a 30-second Instagram Reel script for ${clinic.name} (${clinic.focus}) about: "${input || "our most popular treatment"}". Structure: 1) Pattern-interrupt hook (3 sec), 2) Short relatable story (20 sec), 3) Clear CTA to comment or save (7 sec). Use simple sentences. Cut all filler. Include on-screen text suggestions in [brackets].`,
  },
  {
    id: 4,
    emoji: "⭐",
    title: "Social Proof Phrases",
    subtitle: "On-screen text that builds instant trust",
    hasInput: true,
    inputLabel: "Patient result (e.g. 'smile makeover in 3 visits')",
    buildPrompt: (clinic, input) =>
      `Take this patient result: "${input || "complete smile transformation in 3 appointments"}". Create 5 short on-screen text phrases for an Instagram Reel for ${clinic.name} that spark curiosity and credibility. Max 10 words each. Make viewers stop and trust the clinic immediately.`,
  },
  {
    id: 5,
    emoji: "💾",
    title: "Save-Worthy Tips",
    subtitle: "Content people can't scroll past without saving",
    hasInput: false,
    buildPrompt: (clinic) =>
      `List 5 practical, little-known tips about ${clinic.focus} that patients wish they knew before starting treatment. Each tip must be under 12 words and instantly actionable. They must be genuinely surprising or counterintuitive — impossible not to save. Relevant to Greek patients considering ${clinic.name} in Paleo Faliro.`,
  },
  {
    id: 6,
    emoji: "♻️",
    title: "Content Repurposer",
    subtitle: "One text → Reel + carousel + static post",
    hasInput: true,
    inputLabel: "Paste text or idea to repurpose",
    buildPrompt: (clinic, input) =>
      `Repurpose this content for ${clinic.name} (${clinic.focus}): "${input || "We use the latest technology for outstanding results in Paleo Faliro."}". Transform it into: 1) A 7-second Reel script, 2) A 5-slide carousel with each slide's title and body text, 3) A static post with a bold caption. Adapt tone and format for each format.`,
  },
  {
    id: 7,
    emoji: "📣",
    title: "CTAs That Convert",
    subtitle: "10 curiosity-driven calls-to-action",
    hasInput: false,
    buildPrompt: (clinic) =>
      `Create 10 short, curiosity-driven CTAs for Instagram posts about ${clinic.focus} at ${clinic.name}. No generic phrases like "link in bio" or "book now." Each CTA must make followers actually comment or save the post right now. Max 12 words each.`,
  },
];

const CLINICS = [
  {
    id: "ismile",
    name: "i-smile.gr",
    label: "i-smile",
    focus: "cosmetic dentistry: LED teeth whitening, porcelain veneers, and clear aligners",
    accent: "#E879F9",
    accentDim: "rgba(232,121,249,0.15)",
    tag: "Cosmetic",
  },
  {
    id: "dentplant",
    name: "dentplant.gr",
    label: "dentplant",
    focus: "dental implants and full-arch restorations",
    accent: "#38BDF8",
    accentDim: "rgba(56,189,248,0.15)",
    tag: "Implants",
  },
];

const BASE = {
  bg: "#0A0A0F",
  surface: "#111118",
  card: "#14141E",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.14)",
  text: "#F0F0F8",
  muted: "rgba(240,240,248,0.45)",
  faint: "rgba(240,240,248,0.08)",
};

export default function App() {
  const [selectedClinic, setSelectedClinic] = useState("ismile");
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [copied, setCopied] = useState({});
  const [expanded, setExpanded] = useState({});
  
  // New State for Mock Mode & API Key
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [isMockMode, setIsMockMode] = useState(!import.meta.env.VITE_GEMINI_API_KEY);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    if (!apiKey || isMockMode) return;
    fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.models) {
          const names = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", ""));
          setAvailableModels(names);
          // If the current selected model isn't in the list, auto-select the first available
          if (names.length > 0 && !names.includes(selectedModel)) {
             setSelectedModel(names[0]);
          }
        }
      })
      .catch(console.error);
  }, [apiKey, isMockMode]);

  const clinic = CLINICS.find((c) => c.id === selectedClinic);

  async function generate(tool) {
    const prompt = tool.buildPrompt(clinic, inputs[tool.id]);
    setLoading((p) => ({ ...p, [tool.id]: true }));
    setResults((p) => ({ ...p, [tool.id]: "" }));
    setExpanded((p) => ({ ...p, [tool.id]: true }));

    if (isMockMode) {
      // Simulate API delay
      setTimeout(() => {
        const mockText = `[MOCK MODE RESPONSE]
Here is a creative concept for ${clinic.name}:
1. "The Secret to ${clinic.focus.split(':')[0]} in Athens"
2. Why this works: Taps into local curiosity and clinical trust.
3. CTA: Save this for your next consultation!`;
        setResults((p) => ({ ...p, [tool.id]: mockText }));
        setLoading((p) => ({ ...p, [tool.id]: false }));
      }, 1500);
      return;
    }

    try {
      if (!apiKey) throw new Error("Please enter a Gemini API Key.");
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: selectedModel });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setResults((p) => ({ ...p, [tool.id]: text }));
    } catch (err) {
      console.error("Gemini Error:", err);
      let errMsg = err.message || "Something went wrong.";
      if (errMsg.includes("API_KEY_INVALID")) errMsg = "Invalid API Key. Please check it at aistudio.google.com.";
      if (errMsg.includes("not found")) errMsg = `Model "${selectedModel}" not found. Try selecting "Gemini Pro (v1.0)" or check your regional availability.`;
      
      setResults((p) => ({ ...p, [tool.id]: "Error: " + errMsg }));
    } finally {
      setLoading((p) => ({ ...p, [tool.id]: false }));
    }
  }


  function copy(id) {
    navigator.clipboard.writeText(results[id] || "");
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 2000);
  }

  return (
    <div style={{ background: BASE.bg, minHeight: "100vh", color: BASE.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Settings Bar ── */}
      <div style={{ 
        background: "#1A1A24", 
        padding: "10px 28px", 
        display: "flex", 
        alignItems: "center", 
        gap: 20,
        fontSize: 12,
        borderBottom: `1px solid ${BASE.border}`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input 
            type="checkbox" 
            id="mockMode" 
            checked={isMockMode} 
            onChange={(e) => setIsMockMode(e.target.checked)} 
          />
          <label htmlFor="mockMode" style={{ fontWeight: 600, color: isMockMode ? "#4ADE80" : BASE.muted }}>Mock Mode</label>
        </div>
        
        {!isMockMode && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: BASE.muted }}>Model:</span>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{
                  background: BASE.surface,
                  border: `1px solid ${BASE.border}`,
                  borderRadius: 4,
                  color: BASE.text,
                  padding: "4px 8px",
                  fontSize: 12,
                  maxWidth: "150px"
                }}
              >
                {availableModels.length > 0 ? (
                  availableModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))
                ) : (
                  <>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gemini-pro">Gemini Pro (v1.0)</option>
                  </>
                )}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <span style={{ color: BASE.muted }}>Gemini API Key:</span>
              <input 
                type="password" 
                placeholder="AIzaSy..." 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  background: BASE.surface,
                  border: `1px solid ${BASE.border}`,
                  borderRadius: 4,
                  color: BASE.text,
                  padding: "4px 8px",
                  width: "200px"
                }}
              />
            </div>
          </>
        )}
        <div style={{ marginLeft: "auto", opacity: 0.6 }}>Local Studio v1.0</div>
      </div>

      {/* ── Header ── */}
      <div style={{ padding: "40px 28px 28px", borderBottom: `1px solid ${BASE.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>📸</span>
          <span style={{ fontSize: 11, letterSpacing: "0.18em", color: BASE.muted, textTransform: "uppercase", fontWeight: 500 }}>
            Instagram Growth Studio
          </span>
        </div>
        <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>
          Turn Ideas into Followers
        </h1>
        <p style={{ margin: 0, color: BASE.muted, fontSize: 14 }}>
          7 AI-powered content tools — built for Dr. Moshopoulos's clinics.
        </p>
      </div>

      {/* ── Clinic Switcher ── */}
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${BASE.border}`, display: "flex", gap: 10 }}>
        {CLINICS.map((c) => {
          const active = selectedClinic === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedClinic(c.id)}
              style={{
                background: active ? c.accentDim : "transparent",
                border: `1.5px solid ${active ? c.accent : BASE.border}`,
                borderRadius: 10,
                color: active ? c.accent : BASE.muted,
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.18s ease",
              }}
            >
              <span style={{
                background: active ? c.accent : BASE.border,
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 6px",
                color: active ? BASE.bg : BASE.muted,
                letterSpacing: "0.05em",
              }}>{c.tag}</span>
              {c.name}
            </button>
          );
        })}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: clinic.accent }} />
          <span style={{ fontSize: 12, color: BASE.muted }}>{clinic.focus.split(":")[0]}</span>
        </div>
      </div>

      {/* ── Tool Cards ── */}
      <div style={{ padding: "24px 28px 48px", display: "flex", flexDirection: "column", gap: 14 }}>
        {TOOLS.map((tool) => {
          const isLoading = loading[tool.id];
          const result = results[tool.id];
          const isExpanded = expanded[tool.id];

          return (
            <div
              key={tool.id}
              style={{
                background: BASE.card,
                border: `1px solid ${isExpanded ? BASE.borderHover : BASE.border}`,
                borderRadius: 14,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              {/* Card Header */}
              <div style={{ padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: BASE.faint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  {tool.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{tool.title}</div>
                  <div style={{ fontSize: 13, color: BASE.muted }}>{tool.subtitle}</div>

                  {tool.hasInput && (
                    <input
                      type="text"
                      placeholder={tool.inputLabel}
                      value={inputs[tool.id] || ""}
                      onChange={(e) => setInputs((p) => ({ ...p, [tool.id]: e.target.value }))}
                      style={{
                        marginTop: 12,
                        width: "100%",
                        background: BASE.surface,
                        border: `1px solid ${BASE.border}`,
                        borderRadius: 8,
                        color: BASE.text,
                        fontFamily: "inherit",
                        fontSize: 13,
                        padding: "9px 12px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = clinic.accent)}
                      onBlur={(e) => (e.target.style.borderColor = BASE.border)}
                    />
                  )}
                </div>

                <button
                  onClick={() => generate(tool)}
                  disabled={isLoading}
                  style={{
                    flexShrink: 0,
                    background: isLoading ? BASE.faint : clinic.accentDim,
                    border: `1.5px solid ${isLoading ? BASE.border : clinic.accent}`,
                    borderRadius: 10,
                    color: isLoading ? BASE.muted : clinic.accent,
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "9px 16px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    alignSelf: "flex-start",
                  }}
                >
                  {isLoading ? "Generating…" : "Generate →"}
                </button>
              </div>

              {/* Result Area */}
              {isExpanded && (
                <div style={{ borderTop: `1px solid ${BASE.border}`, padding: "16px 20px 20px" }}>
                  {isLoading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Spinner color={clinic.accent} />
                      <span style={{ fontSize: 13, color: BASE.muted }}>Crafting content for {clinic.name}…</span>
                    </div>
                  ) : result ? (
                    <>
                      <pre style={{
                        margin: "0 0 14px",
                        whiteSpace: "pre-wrap",
                        fontFamily: "inherit",
                        fontSize: 13.5,
                        lineHeight: 1.75,
                        color: BASE.text,
                      }}>
                        {result}
                      </pre>
                      <button
                        onClick={() => copy(tool.id)}
                        style={{
                          background: copied[tool.id] ? "rgba(74,222,128,0.12)" : BASE.faint,
                          border: `1px solid ${copied[tool.id] ? "rgba(74,222,128,0.4)" : BASE.border}`,
                          borderRadius: 8,
                          color: copied[tool.id] ? "#4ADE80" : BASE.muted,
                          fontFamily: "inherit",
                          fontSize: 12,
                          fontWeight: 500,
                          padding: "7px 14px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {copied[tool.id] ? "✓ Copied!" : "Copy to clipboard"}
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Spinner({ color }) {
  return (
    <div style={{
      width: 16,
      height: 16,
      border: `2px solid rgba(255,255,255,0.1)`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
