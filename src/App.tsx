/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Settings, 
  ArrowRight, 
  Bolt, 
  Lock, 
  Terminal, 
  Code,
  Copy,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { transcribeVideo, TranscriptionResult } from './services/transcriptionService';

// --- Components ---

const Header = () => (
  <nav className="bg-black border-b-2 border-white fixed top-0 z-50 w-full">
    <div className="flex justify-between items-center w-full px-6 py-4 max-w-full">
      <div className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase font-press-start">
        yttr
      </div>
      <div className="flex items-center gap-4 md:gap-8">
        <a 
          className="hidden md:block text-white font-bold hover:bg-white hover:text-black transition-colors px-2 py-1 uppercase text-sm font-space-grotesk" 
          href="#"
        >
          How it works
        </a>
        <div className="flex gap-4">
          <History className="text-white cursor-pointer hover:text-secondary w-5 h-5" />
          <Settings className="text-white cursor-pointer hover:text-secondary w-5 h-5" />
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-black border-t-2 border-white fixed bottom-0 w-full z-50">
    <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-4 md:py-6 gap-4">
      <div className="flex items-center gap-4">
        <span className="text-white font-bold text-[0.6875rem] font-mono tracking-widest uppercase">
          Built with 8-bit
        </span>
        <div className="h-4 w-[2px] bg-surface-container-highest hidden md:block"></div>
        <div className="flex gap-4">
          <a className="text-white/60 text-[0.6875rem] font-mono tracking-widest uppercase hover:text-white hover:bg-surface-container-highest px-2" href="#">Source</a>
          <a className="text-white/60 text-[0.6875rem] font-mono tracking-widest uppercase hover:text-white hover:bg-surface-container-highest px-2" href="#">API</a>
          <a className="text-white/60 text-[0.6875rem] font-mono tracking-widest uppercase hover:text-white hover:bg-surface-container-highest px-2" href="#">Support</a>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-secondary underline text-[0.6875rem] font-mono tracking-widest uppercase">v1.0.4-stable</span>
        <div className="flex gap-4">
          <Terminal className="text-white w-4 h-4" />
          <Code className="text-white w-4 h-4" />
        </div>
      </div>
    </div>
  </footer>
);

// --- Views ---

const HomeView = ({ onTranscribe }: { onTranscribe: (url: string) => void }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onTranscribe(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl px-6 z-10"
    >
      <div className="mb-12 space-y-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-press-start text-white leading-tight uppercase tracking-tight">
          Fast. Simple. <br/>
          <span className="text-secondary">8-BIT</span> AUDIO.
        </h1>
        <p className="text-base md:text-lg text-white/60 max-w-2xl font-medium">
          Convert any YouTube video into clean text instantly. No ads, no tracking, just pure data transcription.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="group relative">
          <label className="block text-secondary font-press-start text-[0.65rem] mb-4 uppercase">
            Input_Stream_Source
          </label>
          <div className="relative">
            <input 
              className="w-full bg-surface-container-lowest border-2 border-white p-6 md:p-8 text-lg md:text-2xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all"
              placeholder="PASTE YOUTUBE URL HERE"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="absolute -bottom-2 -right-2 w-full h-full border-b-4 border-r-4 border-white -z-10 group-focus-within:border-secondary"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <button 
            type="submit"
            className="w-full md:w-auto px-12 py-5 bg-white text-black font-press-start text-sm md:text-base hover:bg-secondary transition-colors active:translate-y-1 active:translate-x-1 border-b-4 border-r-4 border-surface-container-highest flex items-center justify-center gap-4 group"
          >
            TRANSCRIBE
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-secondary animate-pulse"></div>
              <span className="text-xs font-mono uppercase tracking-widest text-white/60">System Status: Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-surface-container-highest"></div>
              <span className="text-xs font-mono uppercase tracking-widest text-white/60">Queue Depth: 0ms</span>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-1">
        {[
          { icon: Bolt, title: 'INSTANT', desc: 'Proprietary 8-bit parsing engine delivers results in sub-second intervals.' },
          { icon: Lock, title: 'PRIVATE', desc: 'No logs. No storage. Your data exists only in the volatile memory of this session.' },
          { icon: Terminal, title: 'EXPORT', desc: 'Raw text, JSON, or SRT formats ready for your developer workflow.' }
        ].map((f, i) => (
          <div key={i} className="bg-surface-container p-8 border-2 border-white/10 hover:border-white transition-colors">
            <f.icon className="text-secondary w-10 h-10 mb-4" />
            <h3 className="font-press-start text-[0.7rem] mb-4 text-white">{f.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ResultView = ({ result, onReset }: { result: TranscriptionResult, onReset: () => void }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = result.transcript.map(t => `[${t.timestamp}] ${t.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-5xl px-4 md:px-8 z-10"
    >
      <header className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-12">
        <div className="w-32 h-24 bg-surface-container-highest pixel-border-heavy flex-shrink-0 relative overflow-hidden">
          <img 
            alt="Video thumbnail" 
            className="w-full h-full object-cover grayscale opacity-80" 
            src={`https://picsum.photos/seed/${result.id}/320/240?grayscale`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 dithered-bg pointer-events-none"></div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-tertiary-container text-black px-2 py-0.5 text-[0.6875rem] font-bold tracking-widest uppercase">PROCESSED</span>
            <span className="text-secondary text-[0.6875rem] font-bold tracking-widest uppercase">ID: {result.id}</span>
          </div>
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-tight">
            {result.title}
          </h1>
        </div>
      </header>

      <div className="mb-8 w-full">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[0.6875rem] font-bold tracking-widest uppercase text-white/60">System Status</span>
          <span className="text-[0.6875rem] font-bold tracking-widest uppercase text-secondary">100% COMPLETE</span>
        </div>
        <div className="h-4 w-full bg-surface-container-lowest pixel-border-heavy flex overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: "steps(10)" }}
            className="h-full bg-secondary"
          />
        </div>
        <div className="flex gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1 flex-grow ${i < 4 ? 'bg-secondary' : 'bg-secondary/20'}`}></div>
          ))}
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -top-4 -left-4 bg-white text-black px-3 py-1 font-bold text-xs uppercase z-10">
          TRANSCRIPT_v1.0.txt
        </div>
        <div className="bg-surface-container-lowest pixel-border-heavy p-6 md:p-8 min-h-[300px] stepped-shadow">
          <div className="font-mono text-sm md:text-base leading-relaxed text-white selection:bg-secondary selection:text-black">
            {result.transcript.map((line, i) => (
              <p key={i} className="mb-4">
                <span className="text-white/40 mr-4">[{line.timestamp}]</span>
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
        <button 
          onClick={handleCopy}
          className="group relative w-full sm:w-auto bg-white text-black px-8 py-4 font-bold tracking-widest uppercase pixel-border-heavy hover:bg-secondary transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'COPIED' : 'COPY TRANSCRIPT'}</span>
        </button>
        <button 
          onClick={onReset}
          className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          NEW TRANSCRIPTION
        </button>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Word Count', value: result.wordCount, color: 'text-secondary' },
          { label: 'Accuracy', value: result.accuracy, color: 'text-tertiary-container' },
          { label: 'Time Saved', value: result.timeSaved, color: 'text-white' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 pixel-border-heavy border-opacity-20">
            <div className={`text-[0.6875rem] font-bold ${stat.color} mb-2 uppercase`}>{stat.label}</div>
            <div className="text-2xl font-black font-press-start">{stat.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const LoadingView = () => (
  <div className="flex flex-col items-center justify-center space-y-8 z-10">
    <div className="w-24 h-24 border-4 border-white border-t-secondary animate-spin"></div>
    <div className="text-center space-y-2">
      <h2 className="font-press-start text-xl text-white animate-pulse">TRANSCRIBING...</h2>
      <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Accessing 8-bit parsing engine</p>
    </div>
  </div>
);

const ErrorView = ({ message, onReset }: { message: string, onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center space-y-8 z-10 max-w-md text-center">
    <AlertCircle className="w-20 h-20 text-tertiary-container" />
    <div className="space-y-4">
      <h2 className="font-press-start text-xl text-white">ERROR_DETECTED</h2>
      <p className="text-white/60">{message}</p>
    </div>
    <button 
      onClick={onReset}
      className="bg-white text-black px-8 py-4 font-bold tracking-widest uppercase pixel-border-heavy hover:bg-secondary transition-all"
    >
      REBOOT SYSTEM
    </button>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'home' | 'loading' | 'result' | 'error'>('home');
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranscribe = async (url: string) => {
    setView('loading');
    setError(null);
    try {
      const data = await transcribeVideo(url);
      setResult(data);
      setView('result');
    } catch (err) {
      setError('Failed to establish connection with the 8-bit parsing engine. Please verify the source URL and try again.');
      setView('error');
    }
  };

  const handleReset = () => {
    setView('home');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden pixel-grid bg-black">
      <Header />
      
      <main className="flex-grow pt-32 pb-40 flex flex-col items-center justify-center relative">
        {/* Background Decoration: 8-bit Stars */}
        <div className="absolute top-40 left-20 w-2 h-2 bg-white opacity-20"></div>
        <div className="absolute top-60 right-40 w-1 h-1 bg-white opacity-40"></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-secondary opacity-10"></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-tertiary-container opacity-20"></div>

        <AnimatePresence mode="wait">
          {view === 'home' && <HomeView key="home" onTranscribe={handleTranscribe} />}
          {view === 'loading' && <LoadingView key="loading" />}
          {view === 'result' && result && <ResultView key="result" result={result} onReset={handleReset} />}
          {view === 'error' && <ErrorView key="error" message={error || 'Unknown Error'} onReset={handleReset} />}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
