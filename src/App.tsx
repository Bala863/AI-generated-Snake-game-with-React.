import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-12">
        <header className="text-center space-y-2">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic"
          >
            Neon <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">Rhythm</span>
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm uppercase tracking-[0.3em] font-medium"
          >
            Snake Game • AI Beats • Cyberpunk Vibes
          </motion.p>
        </header>

        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Left Side: Music Player */}
          <motion.section 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-auto order-2 lg:order-1"
          >
            <MusicPlayer />
          </motion.section>

          {/* Center: Snake Game */}
          <motion.section 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <SnakeGame />
          </motion.section>

          {/* Right Side: Stats/Info (Optional but adds to aesthetic) */}
          <motion.section 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden xl:flex flex-col gap-4 w-64 order-3"
          >
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">Controls</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex justify-between"><span>Move</span> <span className="text-white font-mono">ARROWS</span></li>
                <li className="flex justify-between"><span>Pause</span> <span className="text-white font-mono">SPACE</span></li>
                <li className="flex justify-between"><span>Volume</span> <span className="text-white font-mono">AUTO</span></li>
              </ul>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <h4 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4">Game Info</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Collect the pink orbs to grow. Avoid hitting yourself. The rhythm guides your movement.
              </p>
            </div>
          </motion.section>
        </div>

        <footer className="mt-auto pt-12 text-slate-600 text-[10px] uppercase tracking-[0.5em]">
          Built for AI Studio • 2026
        </footer>
      </main>
    </div>
  );
}
