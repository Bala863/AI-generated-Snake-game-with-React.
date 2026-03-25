import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-md rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <div className="flex justify-between w-full mb-4 px-2">
        <div className="text-cyan-400 font-mono text-xl">
          SCORE: <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">{score}</span>
        </div>
        <div className="text-pink-500 font-mono text-sm uppercase tracking-widest animate-pulse">
          {isPaused ? 'Paused' : 'Playing'}
        </div>
      </div>

      <div 
        className="relative bg-slate-900/80 rounded-xl overflow-hidden border-2 border-slate-800"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ 
              x: segment.x * 20, 
              y: segment.y * 20,
              scale: i === 0 ? 1.1 : 0.9
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute w-5 h-5 rounded-sm ${
              i === 0 
                ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10' 
                : 'bg-cyan-600/80'
            }`}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute w-5 h-5 bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.8)]"
          style={{ 
            left: food.x * 20, 
            top: food.y * 20 
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-bold text-pink-500 mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">GAME OVER</h2>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    TRY AGAIN
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-cyan-400 mb-6 tracking-widest">READY?</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-400 transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(236,72,153,0.6)]"
                  >
                    START GAME
                  </button>
                  <p className="mt-4 text-slate-400 text-xs uppercase tracking-tighter">Use Arrow Keys to Move • Space to Pause</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
