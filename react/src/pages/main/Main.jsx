import { useState, useRef, useEffect } from "react";
import api from "../../api/Axios";
import { useNavigate } from "react-router-dom";

const SendIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const TypingDots = () => (
  <div style={s.typingDots}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{ ...s.dot, animationDelay: `${i * 0.2}s` }} />
    ))}
  </div>
);

function Main() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [sidebarOpen, setSidebar] = useState(true);
  const [hasStarted, setHasStarted] = useState(false); // ← controls landing vs chat
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chats");
      setChats(res.data.chats);
    } catch {
      /* silent */
    }
  };

  const loadChat = async (id) => {
    try {
      const res = await api.get(`/chats/${id}`);
      const loaded = res.data.chat.messages.map((m) => ({
        role: m.role,
        text: m.content,
      }));
      setMessages(loaded);
      setChatId(id);
      setHasStarted(true); // ← go to chat view
    } catch {
      /* silent */
    }
  };

  const newChat = () => {
    setMessages([]);
    setChatId(null);
    setInput("");
    setHasStarted(false); // ← back to landing
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chats/${id}`);
      setChats((p) => p.filter((c) => c.id !== id));
      if (chatId === id) newChat();
    } catch {
      /* silent */
    }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setHasStarted(true); // ← leave landing immediately on send
    setMessages((p) => [...p, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/chat", {
        message: msg,
        chatId: chatId ?? null,
      });
      setMessages((p) => [...p, { role: "ai", text: res.data.reply }]);
      if (res.data.chatId) setChatId(res.data.chatId);
      fetchChats();
    } catch (err) {
      console.error(err);
      setMessages((p) => [...p, { role: "ai", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  function logOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const isLanding = !hasStarted; // ← clean single boolean

  return (
    <div style={s.root}>
      <div style={s.glow1} />
      <div style={s.glow2} />
      <div style={s.glow3} />

      {/* ── SIDEBAR ── */}
      <div style={{ ...s.sidebar, ...(sidebarOpen ? {} : s.sidebarHidden) }}>
        <div style={s.sidebarTop}>
          <button onClick={newChat} style={s.newChatSide}>
            {" "}
            {/* ✅ correct style name */}+ New chat
          </button>
        </div>
        <div style={s.chatList}>
          {chats.length === 0 && <p style={s.emptyChats}>No chats yet</p>}
          {chats.map((c) => (
            <div
              key={c.id}
              className="chat-item"
              onClick={() => loadChat(c.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 10px",
                borderRadius: 8,
                cursor: "pointer",
                marginBottom: 2,
                background:
                  c.id === chatId ? "rgba(124,58,237,0.18)" : "transparent",
                border:
                  c.id === chatId
                    ? "0.5px solid rgba(124,58,237,0.3)"
                    : "0.5px solid transparent",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color:
                    c.id === chatId
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(255,255,255,0.45)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                }}
              >
                {c.title || "New Chat"}
              </span>
              <button
                className="del-btn"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  padding: "2px 4px",
                  borderRadius: 4,
                  opacity: 0,
                  flexShrink: 0,
                }}
                onClick={(e) => deleteChat(c.id, e)}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
        <button style={s.logoutSide} onClick={logOut}>
          ← Log out
        </button>
      </div>

      {/* ── MAIN PANEL ── */}
      {/* ── MAIN PANEL ── */}
      <div style={{ ...s.main, ...(sidebarOpen ? s.mainShifted : {}) }}>
        <div
          style={{
            ...s.topbar,
            left: sidebarOpen ? SIDEBAR_W : 0, // ← dynamic
          }}
        >
          <button style={s.toggleBtn} onClick={() => setSidebar((p) => !p)}>
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <div style={s.logoDot}>
            <span style={s.statusDot} />
            <span style={s.statusLabel}>DELTA AI</span>
          </div>
        </div>

        <div
          style={{
            ...s.center,
            justifyContent: isLanding ? "center" : "flex-start",
            paddingTop: isLanding ? 0 : 80,
          }}
        >
          {/* ── LANDING ── */}
          {isLanding && (
            <>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h1 style={s.heading}>
                  How can I{" "}
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>help</span>{" "}
                  today?
                </h1>
                <p style={s.sub}>Type a command or ask a question</p>
              </div>
              <div style={s.card}>
                <div style={{ padding: "20px 24px 8px" }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask a question…"
                    rows={3}
                    style={s.textarea}
                  />
                </div>
                <div style={s.toolbar}>
                  <div />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    style={{
                      ...s.sendBtn,
                      ...(input.trim() ? s.sendReady : s.sendEmpty),
                    }}
                  >
                    <SendIcon /> Send
                  </button>
                </div>
              </div>
              <div style={s.pills}>
                {[
                  { label: "Create Page", msg: "Create a new web page" },
                  { label: "Improve UI", msg: "Improve my existing UI design" },
                  { label: "Explain Code", msg: "Explain this code to me" },
                  { label: "Debug Help", msg: "Help me debug my code" },
                ].map((sg) => (
                  <button
                    key={sg.label}
                    onClick={() => sendMessage(sg.msg)}
                    style={s.pill}
                  >
                    {sg.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── CHAT VIEW ── */}
          {!isLanding && (
            <>
              <div style={s.chatScroll}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: m.role === "user" ? "row-reverse" : "row",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...s.av,
                        ...(m.role === "ai" ? s.avAi : s.avUser),
                      }}
                    >
                      {m.role === "ai" ? "AI" : "ME"}
                    </div>
                    <div
                      style={{
                        ...s.bubble,
                        ...(m.role === "ai" ? s.bubAi : s.bubUser),
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ ...s.av, ...s.avAi }}>AI</div>
                    <div style={{ ...s.bubble, ...s.bubAi }}>
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div style={{ ...s.card, marginTop: 16 }}>
                <div style={{ padding: "14px 24px 6px" }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask a follow-up…"
                    rows={2}
                    style={{ ...s.textarea, minHeight: 56 }}
                  />
                </div>
                <div style={s.toolbar}>
                  <div />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    style={{
                      ...s.sendBtn,
                      ...(input.trim() && !loading ? s.sendReady : s.sendEmpty),
                    }}
                  >
                    <SendIcon /> Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── STYLES ── */
const SIDEBAR_W = 260;
const s = {
  root: {
    background: "#09090b",
    minHeight: "100vh",
    display: "flex",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glow1: {
    position: "fixed",
    top: -120,
    left: -80,
    width: 500,
    height: 500,
    background:
      "radial-gradient(circle,rgba(109,40,217,0.18) 0%,transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  glow2: {
    position: "fixed",
    bottom: -120,
    right: -80,
    width: 460,
    height: 460,
    background:
      "radial-gradient(circle,rgba(79,70,229,0.14) 0%,transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  glow3: {
    position: "fixed",
    top: "40%",
    left: "62%",
    width: 300,
    height: 300,
    background:
      "radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_W,
    background: "rgba(255,255,255,0.02)",
    borderRight: "0.5px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    zIndex: 20,
    transition: "transform 0.25s ease",
  },
  sidebarHidden: { transform: `translateX(-${SIDEBAR_W}px)` },
  sidebarTop: {
    padding: "20px 16px 12px",
    borderBottom: "0.5px solid rgba(255,255,255,0.05)",
  },
  newChatSide: {
    width: "100%",
    padding: "9px 0",
    background: "rgba(124,58,237,0.15)",
    border: "0.5px solid rgba(124,58,237,0.3)",
    borderRadius: 10,
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  chatList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 8px",
    scrollbarWidth: "none",
  },
  emptyChats: {
    fontSize: 12,
    color: "rgba(255,255,255,0.2)",
    textAlign: "center",
    marginTop: 24,
  },
  logoutSide: {
    margin: "12px 16px",
    padding: "9px 0",
    background: "none",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    color: "rgba(255,255,255,0.25)",
    fontSize: 12,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    transition: "margin-left 0.25s ease",
    position: "relative",
    zIndex: 1,
  },
  mainShifted: { marginLeft: SIDEBAR_W },
  topbar: {
    position: "fixed",
    top: 0,
    left: SIDEBAR_W, // ← was 0, now starts after sidebar

    right: 0,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "18px 32px",
    zIndex: 10,
  },
  toggleBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "rgba(255,255,255,0.4)",
    width: 34,
    height: 34,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoDot: { display: "flex", alignItems: "center", gap: 8 },
  statusDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#7c3aed",
    boxShadow: "0 0 10px rgba(124,58,237,0.6)",
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "0.03em",
  },
  center: {
    width: "100%",
    maxWidth: 680,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    padding: "0 1.5rem",
    alignSelf: "center",
    minHeight: "100vh",
  },
  heading: {
    fontSize: 42,
    fontWeight: 400,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: -1,
    lineHeight: 1.15,
    marginBottom: 10,
  },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.28)", fontWeight: 400 },
  card: {
    background: "rgba(255,255,255,0.025)",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    overflow: "hidden",
  },
  textarea: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    fontFamily: "inherit",
    fontWeight: 400,
    resize: "none",
    lineHeight: 1.65,
    minHeight: 72,
    caretColor: "#7c3aed",
  },
  toolbar: {
    padding: "12px 16px",
    borderTop: "0.5px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sendBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 18px",
    borderRadius: 10,
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
  sendReady: { background: "rgba(255,255,255,0.92)", color: "#0d0d0f" },
  sendEmpty: {
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.22)",
    cursor: "not-allowed",
  },
  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 32,
  },
  pill: {
    padding: "9px 17px",
    background: "rgba(255,255,255,0.025)",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: 11,
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  chatScroll: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    overflowY: "auto",
    maxHeight: "calc(100vh - 220px)",
    width: "100%",
    scrollbarWidth: "none",
    paddingBottom: 8,
  },
  av: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
  },
  avAi: {
    background: "rgba(109,40,217,0.2)",
    color: "#a78bfa",
    border: "0.5px solid rgba(109,40,217,0.3)",
  },
  avUser: {
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.6)",
  },
  bubble: {
    padding: "11px 15px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.65,
    maxWidth: "82%",
    wordBreak: "break-word",
  },
  bubAi: {
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.82)",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderTopLeftRadius: 4,
  },
  bubUser: {
    background: "rgba(255,255,255,0.9)",
    color: "#111",
    borderTopRightRadius: 4,
  },
  typingDots: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 0",
  },
  dot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#a78bfa",
    animation: "dotPulse 1.2s infinite ease-in-out",
  },
};

if (typeof document !== "undefined" && !document.getElementById("zap-kf")) {
  const style = document.createElement("style");
  style.id = "zap-kf";
  style.innerHTML = `
     @keyframes dotPulse { 0%,80%,100%{opacity:0.3;transform:scale(0.85)} 40%{opacity:1;transform:scale(1.1)} }
  textarea::placeholder { color: rgba(255,255,255,0.18) !important; }
  textarea { caret-color: #7c3aed !important; }
  .chat-item {
    border-radius: 8px;
    padding: 9px 10px;
    margin-bottom: 2px;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .chat-item:hover { background: rgba(255,255,255,0.06) !important; }
  .chat-item:hover .del-btn { opacity: 1 !important; }
  * { box-sizing: border-box; }
  `;
  document.head.appendChild(style);
}

export default Main;
