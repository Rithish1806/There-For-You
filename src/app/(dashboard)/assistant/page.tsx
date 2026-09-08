"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  User, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  Copy, 
  Check, 
  FastForward,
  Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  displayedContent?: string;
  isStreaming?: boolean;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    content: "Hi there! 👋 I'm your AI Academic & Career Assistant. How can I help you excel today? You can ask me about scholarships, career roadmaps, exam preparation, or study wellness.",
    displayedContent: "Hi there! 👋 I'm your AI Academic & Career Assistant. How can I help you excel today? You can ask me about scholarships, career roadmaps, exam preparation, or study wellness.",
    isStreaming: false,
    timestamp: new Date().toISOString(),
  },
];

const SUGGESTED_PROMPTS = [
  "🎯 Which scholarships match my academic profile?",
  "💼 How do I prepare a high-scoring ATS resume?",
  "📚 Best strategy to revise core subjects before exams",
  "🧘 Tips for managing academic stress and focus",
];

// Animatic Bot Avatar Component with expressive animated eyes and reactive glow
function AnimaticBotAvatar({ size = "md", state = "idle" }: { size?: "sm" | "md" | "lg"; state?: "idle" | "thinking" | "answering" }) {
  const isSm = size === "sm";
  const isLg = size === "lg";
  const dim = isSm ? "w-8 h-8" : isLg ? "w-14 h-14" : "w-10 h-10";

  return (
    <div className={`relative ${dim} flex-shrink-0 flex items-center justify-center select-none`}>
      {/* Outer ambient pulsing glow */}
      <div 
        className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
          state === "thinking" 
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-80 animate-spin" 
            : state === "answering"
            ? "bg-gradient-to-tr from-indigo-600 to-cyan-400 blur-md opacity-70 animate-pulse"
            : "bg-indigo-500/30 blur-sm animate-pulse-glow"
        }`}
        style={{ animationDuration: state === "thinking" ? "3s" : "2s" }}
      />

      {/* Main Bot Shell */}
      <div className={`relative w-full h-full rounded-2xl bg-gradient-to-b from-indigo-600 to-indigo-800 p-[1.5px] shadow-lg flex items-center justify-center overflow-hidden transition-transform duration-300 ${
        state === "answering" ? "scale-105" : ""
      }`}>
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center relative p-1">
          {/* Subtle antenna light */}
          <div className={`w-1.5 h-1.5 rounded-full mb-0.5 transition-all duration-300 ${
            state === "thinking"
              ? "bg-amber-400 animate-ping"
              : state === "answering"
              ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
              : "bg-emerald-400"
          }`} />

          {/* Animated Eyes Screen */}
          <div className="w-full flex items-center justify-center gap-1">
            {state === "thinking" ? (
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : state === "answering" ? (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_#38bdf8] animate-pulse" />
                <div className="w-2 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_#38bdf8] animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-2 rounded-full bg-indigo-300 shadow-[0_0_4px_#818cf8]" />
                <div className="w-1.5 h-2 rounded-full bg-indigo-300 shadow-[0_0_4px_#818cf8]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Crystal-clear Code Block Component with Copy action and language badge
function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect inline code vs multi-line code block
  const isInline = !match && !codeContent.includes('\n');

  if (isInline) {
    return (
      <code 
        className="not-prose bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-1.5 py-0.5 rounded-md font-mono text-[12px] font-semibold tracking-wide" 
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="not-prose my-3.5 rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-950 shadow-xl text-slate-100 font-mono">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">
            {language || 'code'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-[12px] text-slate-100 font-mono leading-relaxed bg-slate-950 m-0">
        <code className="text-slate-100 bg-transparent p-0 block font-mono">
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<any>(null);
  const fullTextRef = useRef<string>('');

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isStreaming, scrollToBottom]);

  // Clean up any running typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  // Animated typewriter/streaming function
  const animateResponse = (messageId: string, fullText: string) => {
    setIsStreaming(true);
    setStreamingMsgId(messageId);
    fullTextRef.current = fullText;

    let currentIndex = 0;
    // Speed: 3-4 characters per tick every 15ms for smooth cadence
    const chunkSize = 3;
    const intervalMs = 15;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= fullText.length) {
        currentIndex = fullText.length;
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        setIsStreaming(false);
        setStreamingMsgId(null);
      }

      const partial = fullText.slice(0, currentIndex);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                displayedContent: partial,
                isStreaming: currentIndex < fullText.length,
              }
            : msg
        )
      );
      scrollToBottom('smooth');
    }, intervalMs);
  };

  // Instant skip button to reveal full answer immediately
  const handleSkipAnimation = (messageId: string) => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsStreaming(false);
    setStreamingMsgId(null);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              displayedContent: fullTextRef.current || msg.content,
              isStreaming: false,
            }
          : msg
      )
    );
    scrollToBottom('smooth');
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : input).trim();
    if (!text || isLoading || isStreaming) return;

    setErrorMessage(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      displayedContent: text,
      isStreaming: false,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from AI assistant');
      }

      const replyText = data.reply || "I'm sorry, I couldn't generate a response. Please try again.";
      const assistantMessageId = `asst-${Date.now()}`;

      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: replyText,
        displayedContent: '',
        isStreaming: true,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      // Trigger progressive streaming animation
      animateResponse(assistantMessageId, replyText);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err?.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setIsStreaming(false);
    setStreamingMsgId(null);
    setMessages(INITIAL_MESSAGES);
    setErrorMessage(null);
    setInput('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Determine current AI state for the animatic mascot
  const currentBotState: "idle" | "thinking" | "answering" = isLoading 
    ? "thinking" 
    : isStreaming 
    ? "answering" 
    : "idle";

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden relative">
      
      {/* Animatic Top Bar / Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 relative">
        <div className="flex items-center gap-3.5">
          {/* Animatic Header Mascot */}
          <div className="animate-float-slow">
            <AnimaticBotAvatar size="md" state={currentBotState} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">There For You • AI Assistant</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-300 ${
                currentBotState === "thinking" 
                  ? "bg-amber-100 text-amber-800 border border-amber-200" 
                  : currentBotState === "answering"
                  ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  currentBotState === "thinking" 
                    ? "bg-amber-500 animate-ping" 
                    : currentBotState === "answering"
                    ? "bg-cyan-500 animate-pulse"
                    : "bg-emerald-500"
                }`} />
                {currentBotState === "thinking" ? "Analyzing prompt..." : currentBotState === "answering" ? "Typing response..." : "Online & Ready"}
              </span>
            </div>
            <p className="text-xs text-slate-500">Live AI mentoring powered by Groq Llama & Deep Learning</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200/60 transition-all cursor-pointer group"
            title="Reset Conversation"
            type="button"
          >
            <RefreshCw size={17} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isCurrentStreaming = msg.id === streamingMsgId && isStreaming;
          const displayBody = msg.displayedContent !== undefined ? msg.displayedContent : msg.content;

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-[88%] animate-slide-up ${
                isUser ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              {isUser ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-600 text-white flex items-center justify-center shadow-sm">
                  <User size={15} />
                </div>
              ) : (
                <AnimaticBotAvatar size="sm" state={isCurrentStreaming ? "answering" : "idle"} />
              )}

              {/* Message Bubble Container */}
              <div className={`space-y-1.5 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`relative px-5 py-4 rounded-2xl text-sm leading-relaxed transition-all duration-200 shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm whitespace-pre-wrap'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-sm prose prose-sm max-w-none prose-headings:text-indigo-950 prose-a:text-indigo-600 prose-table:border-collapse prose-th:border prose-th:p-2 prose-td:border prose-td:p-2 hover:border-indigo-100'
                  }`}
                >
                  {isUser ? (
                    displayBody
                  ) : (
                    <div>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: CodeBlock
                        }}
                      >
                        {displayBody}
                      </ReactMarkdown>

                      {/* Blinking Neon Typewriter Caret while streaming */}
                      {isCurrentStreaming && (
                        <span className="inline-block w-2 h-4 ml-1 bg-indigo-600 rounded-xs animate-typewriter-cursor align-middle shadow-[0_0_8px_#4f46e5]" />
                      )}
                    </div>
                  )}
                </div>

                {/* Bubble Footer Actions */}
                <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                  <span suppressHydrationWarning>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {/* Skip Animation button during active typing */}
                  {isCurrentStreaming && (
                    <button
                      onClick={() => handleSkipAnimation(msg.id)}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer text-[10px]"
                    >
                      <FastForward size={11} />
                      <span>Skip Animation</span>
                    </button>
                  )}

                  {/* Copy Response Button for completed assistant messages */}
                  {!isUser && !isCurrentStreaming && displayBody && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-1 ml-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span className="text-emerald-600 text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / Thinking Wave Indicator */}
        {isLoading && (
          <div className="flex gap-3.5 max-w-[85%] animate-slide-up">
            <AnimaticBotAvatar size="sm" state="thinking" />
            <div className="bg-white border border-slate-200 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-indigo-700 font-medium animate-pulse">
                AI is processing your query...
              </span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs animate-slide-up">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length <= 1 && !isLoading && !isStreaming && (
        <div className="px-6 py-3 flex flex-wrap gap-2 bg-slate-50/70 border-t border-slate-100 animate-slide-up">
          <span className="text-xs font-semibold text-slate-500 self-center mr-1 flex items-center gap-1">
            <Sparkles size={13} className="text-indigo-600" />
            Try asking:
          </span>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-xs font-medium border border-indigo-200/70 bg-white hover:bg-indigo-50 text-indigo-900 px-3.5 py-1.5 rounded-full transition-all hover-lift cursor-pointer shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2.5 bg-slate-50 rounded-2xl p-2.5 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all shadow-xs"
        >
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isStreaming}
            placeholder={
              isStreaming
                ? "AI is responding..."
                : isLoading
                ? "Thinking..."
                : "Ask about scholarships, exam prep, career advice, or resume tips..."
            }
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-3 max-h-32 text-sm text-slate-800 placeholder:text-slate-400 outline-none leading-relaxed"
            rows={1}
            style={{ minHeight: '42px' }}
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading || isStreaming}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              input.trim() && !isLoading && !isStreaming
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md hover:shadow-indigo-200 hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-[10px] font-mono">Shift + Enter</kbd> for new line</span>
          <span className="flex items-center gap-1 text-indigo-600 font-medium">
            <Zap size={12} /> Real-time Groq Engine
          </span>
        </div>
      </div>

    </div>
  );
}
