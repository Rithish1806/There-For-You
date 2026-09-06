"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    content: "Hi! I'm your AI Academic & Career Assistant. How can I help you today? You can ask me about scholarships, career planning, exam preparation, or wellness.",
    timestamp: new Date().toISOString(),
  },
];

const SUGGESTED_PROMPTS = [
  "Which scholarships match my profile?",
  "How can I improve my placement readiness?",
  "Tips for managing study stress before exams",
  "How do I prepare a strong student resume?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : input).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
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

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err?.message || 'Something went wrong. Please try again.');
    } finally {
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
    setMessages(INITIAL_MESSAGES);
    setErrorMessage(null);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg text-white shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Student Assistant</h2>
            <p className="text-xs text-slate-500">Live AI assistance powered by Groq</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200 transition-colors"
          title="Reset Conversation"
          type="button"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user'
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-primary text-white shadow-sm'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Message Bubble */}
            <div
              className={`space-y-1 flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm shadow-sm whitespace-pre-wrap'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm prose prose-sm max-w-none prose-headings:text-primary prose-a:text-blue-600 prose-table:border-collapse prose-th:border prose-th:p-2 prose-td:border prose-td:p-2'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
              <span suppressHydrationWarning className="text-[10px] text-slate-400 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
              <div
                className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></div>
              <span className="text-xs text-slate-400 ml-2">Thinking...</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && !isLoading && (
        <div className="px-6 pb-2 pt-3 flex flex-wrap gap-2 bg-slate-50/50 border-t border-slate-100">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-xs border border-indigo-100 bg-indigo-50/70 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
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
          className="flex items-end gap-2 bg-slate-100 rounded-2xl p-2 border border-slate-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about scholarships, exam prep, career advice..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-2 max-h-32 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            rows={1}
            style={{ minHeight: '40px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              input.trim() && !isLoading
                ? 'bg-primary text-white shadow-md hover:bg-indigo-700 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI assistant powered by Groq. Verify critical academic deadlines independently.
        </p>
      </div>
    </div>
  );
}
