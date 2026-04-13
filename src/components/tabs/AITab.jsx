import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Key, Loader2, Sparkles, Trash2, Download } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { callGroqAI, generateSystemPrompt } from '../../utils/aiService';
import { exportDocumentSummary, exportKeywordContext } from '../../utils/csvExporter';
import { bundleAsZip } from '../../utils/zipExporter';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export const AITab = () => {
  const { documents } = useAppContext();
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSaveKey = () => {
    localStorage.setItem('groq_api_key', apiKey);
    setShowKeyInput(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = generateSystemPrompt(documents);
      const conversation = [
        { role: 'system', content: systemPrompt },
        ...messages,
        userMessage
      ];

      const response = await callGroqAI(conversation, apiKey);

      let downloadBtn = null;
      if (response.toLowerCase().includes('csv') || response.toLowerCase().includes('spreadsheet')) {
        downloadBtn = 'csv';
      } else if (response.toLowerCase().includes('zip') || response.toLowerCase().includes('archive')) {
        downloadBtn = 'zip';
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        downloadType: downloadBtn
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}. Please check your API key and connection.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDownload = (type) => {
    if (type === 'csv') exportDocumentSummary(documents);
    if (type === 'zip') bundleAsZip(documents);
  };

  return (
    <div className="relative min-h-[calc(100vh-200px)] pb-24 animate-slide-up">
      {/* Key Input (Only if missing) */}
      {showKeyInput && (
        <div className="max-w-4xl mx-auto mb-6 glass-card p-10 bg-indigo-50/40 border-indigo-100 backdrop-blur-2xl">
          <div className="flex items-center gap-5 mb-4">
            <div className="p-4 bg-white rounded-2xl text-indigo-600 shadow-sm">
              <Key size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">AI Analyst Gateway</h3>
              <p className="text-gray-500 font-medium">Connect your Groq account to begin document interrogation.</p>
            </div>
          </div>
          <div className="flex">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter gsk_..."
              className="flex-1 bg-white/80 border border-gray-200 rounded-2xl px-6 py-4 text-base focus:ring-2 focus:ring-accent outline-none font-mono shadow-sm"
            />
            <button onClick={handleSaveKey} className="btn-primary px-8">Initialize</button>
          </div>
        </div>
      )}

      {/* Messages List Area */}
      <div className="max-w-[1400px] mx-auto space-y-12">
        {messages.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 opacity-50">
            <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center">
              <Sparkles size={40} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Ready for Deep Data Crawl</p>
              <p className="text-gray-500 max-w-sm mt-3 font-medium leading-relaxed">
                Connect your documents to simulate thematic trends and representation disparities.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-6 max-w-[95%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-accent text-white border-accent' : 'bg-white border-gray-100 text-accent'
                }`}>
                {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
              </div>
              <div className="space-y-4">
                <div className={`p-7 rounded-3xl text-sm leading-relaxed shadow-xl shadow-black/[0.01] prose prose-slate max-w-none ${msg.role === 'user'
                  ? 'bg-accent text-white rounded-tr-none prose-invert'
                  : 'bg-white text-gray-900 rounded-tl-none border border-gray-100 font-medium prose-p:my-2 prose-ul:my-2'
                  }`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.downloadType && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => triggerDownload(msg.downloadType)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95"
                  >
                    <Download size={14} />
                    Export {msg.downloadType.toUpperCase()}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <Loader2 size={24} className="text-accent animate-spin" />
              </div>
              <div className="p-6 bg-white border border-gray-100 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Generating Insight Stream...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} className="h-20" />
      </div>

      {/* REFINED FIXED VIEWPORT BOTTOM BAR */}
      <div className="fixed bottom-10 left-0 right-0 z-[100] px-6">
        <div className="max-w-[1200px] mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="glass-card p-2 pr-2 pl-8 flex items-center gap-4 bg-white/95 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-white/50 ring-1 ring-black/[0.05] rounded-full"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the analyst..."
              className="flex-1 bg-transparent py-4 text-base focus:outline-none placeholder:text-gray-400 font-medium text-gray-700"
              disabled={documents.length === 0 || isLoading}
            />
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button
                type="submit"
                disabled={!input.trim() || isLoading || documents.length === 0}
                className="w-12 h-12 flex items-center justify-center bg-accent text-white rounded-full hover:bg-accent-dark hover:scale-110 active:scale-95 transition-all disabled:opacity-10 shadow-lg shadow-accent/30"
              >
                <Send size={22} />
              </button>
            </div>
          </form>
          <div className="mt-3 text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] font-mono opacity-50">
              AI Data Interrogator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
