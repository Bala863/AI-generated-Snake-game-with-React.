import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-pink-500 to-purple-600"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Silicon Soul",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-emerald-500 to-teal-600"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="flex items-center gap-6 mb-8">
        <motion.div 
          key={currentTrack.id}
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center shadow-lg shadow-black/40`}
        >
          <Music className="w-10 h-10 text-white" />
        </motion.div>
        
        <div className="flex-1 overflow-hidden">
          <motion.h3 
            key={`title-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white font-bold text-xl truncate"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={`artist-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-gradient-to-r ${currentTrack.color}`}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'tween', ease: 'linear' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button className="text-slate-500 hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-white/70 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-xl shadow-white/10"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white/70 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-5" /> {/* Spacer */}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [8, 24, 12, 20, 8] } : { height: 8 }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
              className={`w-1 rounded-full bg-gradient-to-t ${currentTrack.color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
