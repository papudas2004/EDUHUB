import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../api/apiClient";
import { toast } from "react-hot-toast";
import DashboardLayout from "../component/DashboardLayout";
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
  Trash2,
  BookOpen,
  HelpCircle,
  FileText,
  Calendar,
  Terminal,
  Code2,
  RefreshCw,
} from "lucide-react";
import "./aiTutor.css";

function AITutor() {
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      sender: "ai",
      text: `### 👋 Hello! I am **EduHub AI**, your 24/7 personal computer science tutor.

I can help you master tough concepts, generate interview MCQs, summarize lessons, or create targeted study plans.

**Try asking me:**
- *"Explain React 19 use() hook with code"*
- *"Generate 5 MCQs on MongoDB Aggregation Pipelines"*
- *"Create a 7-day revision roadmap for MCA placements"*
- *"Explain Database Normalization (1NF to BCNF) simply"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("general"); // 'general', 'mcq', 'planner', 'code'
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Check if incoming from classroom with an initial prompt
  useEffect(() => {
    if (location.state && location.state.initialPrompt) {
      sendMessage(location.state.initialPrompt);
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const suggestedPrompts = [
    { label: "Explain this topic simply", prompt: "Explain React 19 use() hook and async transitions simply with practical code examples." },
    { label: "Generate 10 MCQs", prompt: "Generate 5 high-yield MCQs for campus placement on MongoDB and DBMS with detailed answer explanations." },
    { label: "Create revision notes", prompt: "Create concise revision notes and cheat-sheet summary on Node.js Event Loop and Libuv thread pool." },
    { label: "Create a 7-day study plan", prompt: "Create an accelerated 7-day study plan to master Full-Stack MERN development and DSA for MCA placements." },
    { label: "DBMS Normalization", prompt: "Explain 1NF, 2NF, 3NF, and BCNF with real-world table examples and anomaly prevention." },
  ];

  const sendMessage = async (promptToSend) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages = [
      ...messages,
      {
        id: userMessageId,
        sender: "user",
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(newMessages);
    setInputPrompt("");
    setLoading(true);

    try {
      const res = await apiClient.post("/ai/chat", {
        prompt: text.trim(),
        mode: activeMode,
      });

      const replyText =
        res.data && res.data.reply
          ? res.data.reply
          : "I have processed your request. Keep practicing consistent coding problems!";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: replyText,
          source: res.data?.source || "eduhub-ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.warn("AI query notice:", err.message);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `### 💡 Quick Explanation: ${text}

In modern software development, this concept revolves around state isolation, declarative composition, and predictable data flow.

#### Key Principles:
1. **Separation of Concerns:** Separate view controllers from business services.
2. **Performance:** Memoize expensive calculations to minimize layout repaints.
3. **Resilience:** Always wrap network invocations with structured error boundaries.

\`\`\`javascript
// Example Pattern
const handleOperation = async (payload) => {
  try {
    const response = await executeAction(payload);
    return response.data;
  } catch (error) {
    console.error("Operation failed:", error.message);
  }
};
\`\`\`

*Feel free to ask for 5 practice MCQs or a 7-day study schedule!*`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm("Clear current conversation?")) {
      setMessages([]);
      toast.success("Chat cleared");
    }
  };

  // Simple Markdown renderer for code blocks and bold text
  const renderFormattedText = (content) => {
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeContent = [];

    return lines.map((line, idx) => {
      if (line.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock) {
          const block = codeContent.join("\n");
          codeContent = [];
          return (
            <pre key={idx} className="ai-code-block">
              <code>{block}</code>
            </pre>
          );
        }
        return null;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      if (line.startsWith("### ")) {
        return <h3 key={idx} className="ai-heading-3">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("#### ")) {
        return <h4 key={idx} className="ai-heading-4">{line.replace("#### ", "")}</h4>;
      }
      if (line.startsWith("- ")) {
        return (
          <li key={idx} className="ai-list-item">
            {line.replace("- ", "")}
          </li>
        );
      }

      return (
        <p key={idx} className="ai-text-line">
          {line}
        </p>
      );
    });
  };

  return (
    <DashboardLayout>
      <div className="ai-tutor-saas-page">
        <div className="saas-container ai-layout-container">
        {/* Top Header Bar */}
        <div className="ai-top-bar saas-card">
          <div className="ai-brand-group">
            <div className="ai-avatar-icon">
              <Bot size={26} />
            </div>
            <div>
              <h1 className="ai-title">
                EduHub <span className="text-gradient-primary">AI Study Assistant</span> 🤖
              </h1>
              <span className="ai-status-tag">
                <span className="online-indicator"></span> Intelligent CS Mentor • Placement Ready
              </span>
            </div>
          </div>

          {/* Mode Selector Tabs & Clear Chat */}
          <div className="ai-actions-group">
            <div className="mode-toggle-group">
              <button
                className={`mode-btn ${activeMode === "general" ? "active" : ""}`}
                onClick={() => setActiveMode("general")}
              >
                <Sparkles size={14} /> Explainer
              </button>
              <button
                className={`mode-btn ${activeMode === "mcq" ? "active" : ""}`}
                onClick={() => setActiveMode("mcq")}
              >
                <HelpCircle size={14} /> MCQs
              </button>
              <button
                className={`mode-btn ${activeMode === "planner" ? "active" : ""}`}
                onClick={() => setActiveMode("planner")}
              >
                <Calendar size={14} /> Study Plan
              </button>
              <button
                className={`mode-btn ${activeMode === "code" ? "active" : ""}`}
                onClick={() => setActiveMode("code")}
              >
                <Code2 size={14} /> Code Review
              </button>
            </div>

            <button className="clear-chat-btn" onClick={handleClearChat} title="Clear conversation">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Suggested Prompts Strip */}
        <div className="suggested-prompts-carousel">
          <span className="prompt-label">💡 Suggested Prompts:</span>
          <div className="prompts-scroll">
            {suggestedPrompts.map((item, idx) => (
              <button
                key={idx}
                className="prompt-chip"
                onClick={() => sendMessage(item.prompt)}
              >
                "{item.label}"
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Box */}
        <div className="chat-messages-container saas-card">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
            >
              <div className="message-avatar">
                {msg.sender === "user" ? "👨‍🎓" : <Bot size={18} className="text-emerald" />}
              </div>

              <div className="message-content-box">
                <div className="message-top-meta">
                  <span className="sender-name">
                    {msg.sender === "user" ? "You" : "EduHub AI Tutor"}
                  </span>
                  <span className="message-time">{msg.timestamp}</span>
                </div>

                <div className="message-body">
                  {msg.sender === "ai" ? renderFormattedText(msg.text) : <p>{msg.text}</p>}
                </div>

                {msg.sender === "ai" && (
                  <div className="message-footer-actions">
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(msg.text, msg.id)}
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={13} className="text-emerald" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-bubble-row ai-row">
              <div className="message-avatar">
                <Bot size={18} className="text-emerald" />
              </div>
              <div className="message-content-box typing-box">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <small className="text-muted">EduHub AI is generating structured insights...</small>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Formulation Bar */}
        <form
          className="ai-input-bar-card saas-card"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            className="ai-chat-input"
            placeholder={`Ask EduHub AI anything (e.g. "Explain React hooks", "Create 10 MCQs", "7-day study plan")...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="btn-saas btn-saas-primary send-ai-btn"
            disabled={loading || !inputPrompt.trim()}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default AITutor;
