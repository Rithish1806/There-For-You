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
  Zap,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Bot
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@/components/theme/ThemeProvider';

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
    content: "Hi there! 👋 I'm your AI Academic & Career Assistant. How can I help you excel today?\n\nYou can ask me about:\n- 🎯 **Matched Scholarships** based on your category & income\n- 💼 **Resume & ATS Optimization** for top internships\n- 📚 **Exam Revision & Study Schedules** with spaced repetition\n- 🧘 **Stress Management & Wellness** techniques",
    displayedContent: "Hi there! 👋 I'm your AI Academic & Career Assistant. How can I help you excel today?\n\nYou can ask me about:\n- 🎯 **Matched Scholarships** based on your category & income\n- 💼 **Resume & ATS Optimization** for top internships\n- 📚 **Exam Revision & Study Schedules** with spaced repetition\n- 🧘 **Stress Management & Wellness** techniques",
    isStreaming: false,
    timestamp: new Date().toISOString(),
  },
];

const SUGGESTED_PROMPTS = [
  {
    title: "🎯 Scholarship Matching",
    prompt: "Which scholarships match my academic profile and category?"
  },
  {
    title: "💼 High-Score ATS Resume",
    prompt: "How do I prepare a high-scoring ATS resume for tech internships?"
  },
  {
    title: "📚 Exam Study Strategy",
    prompt: "Give me an active recall and spaced repetition study strategy for my exams."
  },
  {
    title: "🧘 Focus & Stress Tips",
    prompt: "Tips for managing academic stress and staying focused during revision."
  }
];

// Animatic Bot Avatar Component with expressive animated eyes and reactive glow
function AnimaticBotAvatar({ size = "md", state = "idle" }: { size?: "sm" | "md" | "lg"; state?: "idle" | "thinking" | "answering" }) {
  const isSm = size === "sm";
  const isLg = size === "lg";
  const dim = isSm ? "w-8 h-8" : isLg ? "w-12 h-12" : "w-10 h-10";

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
        className="not-prose bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono text-xs font-semibold tracking-wide" 
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="not-prose my-4 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl text-slate-100 font-mono">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 select-none">
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
      <pre className="p-4 overflow-x-auto text-[13px] text-slate-100 font-mono leading-relaxed bg-[#0d1117] m-0">
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { theme, toggleTheme } = useTheme();

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

  // Listen for Escape key to close expanded mode and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  // Auto-resize textarea based on content
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // Animated typewriter/streaming function
  const animateResponse = (messageId: string, fullText: string) => {
    setIsStreaming(true);
    setStreamingMsgId(messageId);
    fullTextRef.current = fullText;

    let currentIndex = 0;
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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

  // ==========================================
  // ChatGPT-STYLE MAXIMIZED INTERFACE
  // ==========================================
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 h-screen w-screen bg-white dark:bg-[#0E131F] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-250">
        
        {/* ChatGPT Header Bar */}
        <header className="h-14 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">There For You • GPT Academic</span>
                <span className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                  LLaMA 3.3
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-indigo-600" />}
            </button>

            {/* New Chat Button */}
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title="Reset conversation"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            {/* Minimize / Exit Fullscreen Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
              title="Minimize chat (Esc)"
            >
              <Minimize2 size={14} />
              <span>Minimize</span>
              <kbd className="hidden md:inline px-1 py-0.2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[9px] font-mono ml-0.5">Esc</kbd>
            </button>
          </div>
        </header>

        {/* ChatGPT Centered Message Stream */}
        <main className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center scroll-smooth px-4 sm:px-6">
          <div className="w-full max-w-3xl sm:max-w-4xl py-8 space-y-6 flex-1 flex flex-col justify-start">
            
            {/* Welcome Greeting & Starter Cards (ChatGPT Style) */}
            {messages.length <= 1 && (
              <div className="text-center my-6 space-y-3">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2 shadow-xs">
                  <Sparkles size={28} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  What would you like to accomplish today?
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Ask me about scholarships, ATS resume reviews, exam strategies, or stress management.
                </p>

                {/* 2x2 Starter Prompt Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 max-w-2xl mx-auto text-left">
                  {SUGGESTED_PROMPTS.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => handleSend(item.prompt)}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/70 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 transition-all hover-lift cursor-pointer group"
                    >
                      <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rendered Messages */}
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isCurrentStreaming = msg.id === streamingMsgId && isStreaming;
              const displayBody = msg.displayedContent !== undefined ? msg.displayedContent : msg.content;

              if (isUser) {
                return (
                  <div key={msg.id} className="flex justify-end w-full animate-slide-up">
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-5 py-3 rounded-3xl max-w-[80%] text-[15px] leading-relaxed shadow-xs whitespace-pre-wrap">
                      {displayBody}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex gap-4 w-full items-start animate-slide-up">
                  {/* Bot Avatar Icon */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Sparkles size={15} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="text-[15px] leading-relaxed text-slate-900 dark:text-slate-100 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:font-bold prose-strong:text-slate-950 dark:prose-strong:text-white prose-p:leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
                        {displayBody}
                      </ReactMarkdown>

                      {isCurrentStreaming && (
                        <span className="inline-block w-2 h-4 ml-1 bg-indigo-600 dark:bg-indigo-400 rounded-xs animate-typewriter-cursor align-middle shadow-[0_0_8px_#4f46e5]" />
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-3 pt-1 text-xs text-slate-400 dark:text-slate-500">
                      <span suppressHydrationWarning>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {isCurrentStreaming ? (
                        <button
                          onClick={() => handleSkipAnimation(msg.id)}
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer text-[10px]"
                        >
                          <FastForward size={11} /> Skip typing
                        </button>
                      ) : (
                        displayBody && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check size={13} className="text-emerald-500" />
                                <span className="text-emerald-500 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking Indicator */}
            {isLoading && (
              <div className="flex gap-4 w-full items-start animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Sparkles size={15} className="animate-spin" />
                </div>
                <div className="flex items-center gap-2 pt-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Generating response...</span>
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-700 dark:text-rose-300 text-sm animate-slide-up">
                <AlertCircle size={17} className="flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* ChatGPT Centered Floating Bottom Input */}
        <footer className="w-full max-w-3xl sm:max-w-4xl mx-auto px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-[#0E131F] dark:via-[#0E131F] dark:to-transparent shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative bg-slate-100/90 dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md focus-within:border-slate-400 dark:focus-within:border-slate-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all p-3 pl-4 flex flex-col gap-2"
          >
            <textarea
              ref={textareaRef}
              id="chat-input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading || isStreaming}
              placeholder={isStreaming ? "AI is responding..." : isLoading ? "Thinking..." : "Message AI Tutor..."}
              className="w-full bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 max-h-44 min-h-[44px]"
              rows={1}
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  <Zap size={13} /> Groq LLaMA 3.3
                </span>
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isLoading || isStreaming}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  input.trim() && !isLoading && !isStreaming
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95 shadow'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </form>

          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            There For You can make mistakes. Verify critical academic and scholarship details.
          </p>
        </footer>

      </div>
    );
  }

  // ==========================================
  // STANDARD IN-PAGE DASHBOARD VIEW
  // ==========================================
  return (
    <div className="h-[calc(100vh-8rem)] w-full max-w-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden relative min-h-0 transition-colors duration-250">
      
      {/* Top Bar Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 relative shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="animate-float-slow">
            <AnimaticBotAvatar size="md" state={currentBotState} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">There For You • AI Assistant</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-300 ${
                currentBotState === "thinking" 
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800" 
                  : currentBotState === "answering"
                  ? "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800"
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
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
            <p className="text-xs text-slate-500 dark:text-slate-400">Live AI mentoring powered by Groq Llama & Deep Learning</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Expand to ChatGPT Fullscreen */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs font-semibold cursor-pointer shadow-xs group"
            title="Expand to Fullscreen ChatGPT Interface"
          >
            <Maximize2 size={15} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Expand Chat</span>
          </button>

          {/* Reset Conversation Button */}
          <button
            onClick={clearChat}
            className="text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer group"
            title="Reset Conversation"
            type="button"
          >
            <RefreshCw size={17} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 space-y-6 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-950/80 dark:via-slate-900 dark:to-slate-950/70">
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
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-600 dark:from-slate-700 dark:to-slate-500 text-white flex items-center justify-center shadow-sm">
                  <User size={15} />
                </div>
              ) : (
                <AnimaticBotAvatar size="sm" state={isCurrentStreaming ? "answering" : "idle"} />
              )}

              {/* Message Bubble Container */}
              <div className={`space-y-1.5 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`relative px-5 py-4 rounded-2xl text-[14.5px] leading-relaxed transition-all duration-200 shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm whitespace-pre-wrap'
                      : 'bg-white dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-tl-sm prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:font-bold prose-strong:text-slate-950 dark:prose-strong:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400'
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

                      {isCurrentStreaming && (
                        <span className="inline-block w-2 h-4 ml-1 bg-indigo-600 dark:bg-indigo-400 rounded-xs animate-typewriter-cursor align-middle shadow-[0_0_8px_#4f46e5]" />
                      )}
                    </div>
                  )}
                </div>

                {/* Bubble Footer Actions */}
                <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <span suppressHydrationWarning>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {isCurrentStreaming && (
                    <button
                      onClick={() => handleSkipAnimation(msg.id)}
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer text-[10px]"
                    >
                      <FastForward size={11} />
                      <span>Skip Animation</span>
                    </button>
                  )}

                  {!isUser && !isCurrentStreaming && displayBody && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1 ml-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">Copied</span>
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 dark:bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium animate-pulse">
                AI is processing your query...
              </span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-700 dark:text-rose-300 text-xs animate-slide-up">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length <= 1 && !isLoading && !isStreaming && (
        <div className="px-6 py-3 flex flex-wrap gap-2 bg-slate-50/70 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 animate-slide-up shrink-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-center mr-1 flex items-center gap-1">
            <Sparkles size={13} className="text-indigo-600 dark:text-indigo-400" />
            Try asking:
          </span>
          {SUGGESTED_PROMPTS.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => handleSend(item.prompt)}
              className="text-xs font-medium border border-indigo-200/70 dark:border-indigo-800/80 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200 px-3.5 py-1.5 rounded-full transition-all hover-lift cursor-pointer shadow-xs"
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-700/80 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:focus-within:ring-indigo-400/20 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-xs"
        >
          <textarea
            ref={textareaRef}
            id="chat-input-standard"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isStreaming}
            placeholder={
              isStreaming
                ? "AI is responding..."
                : isLoading
                ? "Thinking..."
                : "Ask about scholarships, exam prep, career advice, or resume tips..."
            }
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-3 max-h-36 text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none leading-relaxed"
            rows={1}
            style={{ minHeight: '42px' }}
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading || isStreaming}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              input.trim() && !isLoading && !isStreaming
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md hover:shadow-indigo-200 dark:hover:shadow-indigo-900 hover:scale-105 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-700/70 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-750 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-750 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-mono">Shift + Enter</kbd> for new line</span>
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
            <Zap size={12} /> Real-time Groq Engine
          </span>
        </div>
      </div>

    </div>
  );
}
