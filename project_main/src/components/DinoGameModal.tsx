import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';


interface DinoGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockItem: (productId: string) => void;
  isUnlocked: boolean;
}

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'excel' | 'slack' | 'box';
}

export const DinoGameModal: React.FC<DinoGameModalProps> = ({
  isOpen,
  onClose,
  onUnlockItem,
  isUnlocked,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'won'>('intro');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('flop_dino_highscore') || 0);
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Animation frame and game variables refs
  const reqIdRef = useRef<number | null>(null);
  const playerRef = useRef({
    x: 50,
    y: 150,
    width: 32,
    height: 38,
    vy: 0,
    isJumping: false,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const frameCountRef = useRef(0);

  const TARGET_SCORE = 100; // 100m to unlock

  const jump = () => {
    if (gameStateRef.current === 'playing') {
      if (!playerRef.current.isJumping) {
        playerRef.current.vy = -12;
        playerRef.current.isJumping = true;
        sounds.playJump();
      }
    } else if (gameStateRef.current === 'intro' || gameStateRef.current === 'gameover') {
      startGame();
    }
  };

  const startGame = () => {
    setGameState('playing');
    scoreRef.current = 0;
    setScore(0);
    frameCountRef.current = 0;
    playerRef.current = {
      x: 50,
      y: 150,
      width: 32,
      height: 38,
      vy: 0,
      isJumping: false,
    };
    obstaclesRef.current = [];
    sounds.playTick();
  };

  useEffect(() => {
    if (!isOpen) {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Main Canvas game loop
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const groundY = 180;
    const gravity = 0.65;
    const speed = 4.8;

    const loop = () => {
      frameCountRef.current += 1;

      // Update player physics
      const p = playerRef.current;
      p.vy += gravity;
      p.y += p.vy;

      if (p.y >= groundY - p.height) {
        p.y = groundY - p.height;
        p.vy = 0;
        p.isJumping = false;
      }

      // Update score (meters)
      if (frameCountRef.current % 5 === 0) {
        scoreRef.current += 1;
        setScore(scoreRef.current);

        // Check Victory
        if (scoreRef.current >= TARGET_SCORE) {
          setGameState('won');
          sounds.playSuccessFanfare();
          onUnlockItem('prod-infinite-debt');

          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
          });
          return;
        }
      }

      // Spawn obstacles
      if (frameCountRef.current % 85 === 0 || (Math.random() < 0.018 && frameCountRef.current > 40)) {
        const types: ('excel' | 'slack' | 'box')[] = ['excel', 'slack', 'box'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        let w = 26, h = 32;
        if (chosenType === 'excel') { w = 28; h = 36; }
        if (chosenType === 'slack') { w = 24; h = 24; }
        if (chosenType === 'box') { w = 34; h = 26; }

        obstaclesRef.current.push({
          x: canvas.width + 10,
          width: w,
          height: h,
          type: chosenType,
        });
      }

      // Update obstacles
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.x -= speed;

        // Collision detection (AABB with slight padding)
        const pad = 4;
        if (
          p.x + p.width - pad > obs.x &&
          p.x + pad < obs.x + obs.width &&
          p.y + p.height - pad > groundY - obs.height
        ) {
          // Crash!
          sounds.playCrash();
          setGameState('gameover');
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('flop_dino_highscore', String(scoreRef.current));
          }
          return;
        }

        // Remove off-screen obstacles
        if (obs.x + obs.width < -10) {
          obstaclesRef.current.splice(i, 1);
        }
      }

      // Clear & Draw
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Ground
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      // Ground pebble details
      ctx.fillStyle = '#94a3b8';
      const pebbleOffset = (frameCountRef.current * speed) % 60;
      for (let x = -pebbleOffset; x < canvas.width; x += 45) {
        ctx.fillRect(x, groundY + 5, 6, 2);
        ctx.fillRect(x + 18, groundY + 11, 4, 2);
      }

      // Draw Player (Fatigued Dino with Red Necktie)
      ctx.fillStyle = '#0284c7';
      // Body
      ctx.fillRect(p.x, p.y, p.width, p.height);
      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x + 20, p.y + 6, 6, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(p.x + 23, p.y + 8, 3, 3);
      // Exhausted dark circle under eye
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(p.x + 18, p.y + 12, 10, 2);
      // Red corporate necktie flapping behind
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(p.x + 8, p.y + 16);
      ctx.lineTo(p.x - 10, p.y + 22);
      ctx.lineTo(p.x + 8, p.y + 26);
      ctx.fill();

      // Draw Obstacles
      obstaclesRef.current.forEach((obs) => {
        const obsY = groundY - obs.height;
        if (obs.type === 'excel') {
          // Green Excel Sheet
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(obs.x, obsY, obs.width, obs.height);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('XLS', obs.x + 3, obsY + 16);
        } else if (obs.type === 'slack') {
          // Purple Slack Ping
          ctx.fillStyle = '#9333ea';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obsY + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('!', obs.x + 9, obsY + 16);
        } else {
          // Brown Soggy Cardboard Box
          ctx.fillStyle = '#b45309';
          ctx.fillRect(obs.x, obsY, obs.width, obs.height);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1;
          ctx.strokeRect(obs.x, obsY, obs.width, obs.height);
          // tape
          ctx.fillStyle = '#d97706';
          ctx.fillRect(obs.x + 4, obsY + 6, obs.width - 8, 4);
        }
      });

      // Draw Score overlay on canvas
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`DISTANCE: ${scoreRef.current}m / ${TARGET_SCORE}m`, canvas.width - 170, 24);

      reqIdRef.current = requestAnimationFrame(loop);
    };

    reqIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, [isOpen, gameState]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-gray-300 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#2874f0] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffe500]" />
            <div>
              <h3 className="font-bold text-sm">The Depressed Dinosaur Run (T-Rex Parody)</h3>
              <p className="text-[10.5px] text-blue-100">
                Survive 100m to unlock the Black Obsidian Debt Card
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Canvas Container */}
        <div className="p-4 sm:p-6 bg-slate-900 flex flex-col items-center justify-center">
          <div
            onClick={jump}
            className="relative border-4 border-slate-700 rounded-lg overflow-hidden bg-white shadow-2xl cursor-pointer select-none"
          >
            <canvas
              ref={canvasRef}
              width={520}
              height={220}
              className="block w-full max-w-full"
            />

            {/* Overlay for Intro */}
            {gameState === 'intro' && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center p-4">
                <span className="text-3xl mb-1">🦖👔</span>
                <h4 className="text-base font-black text-[#ffe500]">THE DEPRESSED DINOSAUR RUN</h4>
                <p className="text-xs text-gray-300 mt-1 max-w-xs leading-relaxed">
                  Jump over Excel sheets, Slack pings, and damp cardboard boxes. Survive 100 meters to unlock your corporate debt!
                </p>
                <button
                  onClick={startGame}
                  className="mt-3 bg-[#ffe500] hover:bg-yellow-400 text-slate-950 font-black px-5 py-2 rounded text-xs shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>PRESS SPACEBAR OR CLICK TO START</span>
                </button>
              </div>
            )}

            {/* Overlay for Game Over */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-red-950/85 flex flex-col items-center justify-center text-white text-center p-4">
                <span className="text-3xl mb-1">💥</span>
                <h4 className="text-base font-black text-red-400">COLLAPSED UNDER PRESSURE!</h4>
                <p className="text-xs text-gray-300 mt-1">
                  You succumbed to spreadsheets at <strong>{score}m</strong>. (Needed 100m).
                </p>
                <button
                  onClick={startGame}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2 rounded text-xs shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>TRY AGAIN (SPACEBAR / CLICK)</span>
                </button>
              </div>
            )}

            {/* Overlay for Won */}
            {gameState === 'won' && (
              <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-white text-center p-4">
                <Sparkles className="w-8 h-8 text-[#ffe500] animate-bounce" />
                <h4 className="text-base font-black text-[#ffe500]">CORRUPT VICTORY! 100M REACHED!</h4>
                <p className="text-xs text-emerald-100 mt-1 max-w-xs">
                  You have demonstrated extraordinary resilience to corporate absurdity! The <strong>Flopkart Infinite Debt Pass</strong> is now permanently UNLOCKED.
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 bg-[#ffe500] hover:bg-yellow-400 text-slate-950 font-black px-6 py-2 rounded text-xs shadow cursor-pointer"
                >
                  VIEW UNLOCKED DEBT CARD IN CATALOG →
                </button>
              </div>
            )}
          </div>

          {/* Controls hint */}
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between w-full max-w-[520px]">
            <span>Controls: <strong>SPACEBAR</strong> / <strong>UP ARROW</strong> / <strong>CLICK</strong> to Jump</span>
            <span>Target: <strong>100m</strong> | Highscore: <strong>{highScore}m</strong></span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {isUnlocked ? '✓ Status: Debt Card Unlocked' : '🔒 Status: Debt Card Locked'}
          </span>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
          >
            Close Game
          </button>
        </div>
      </div>
    </div>
  );
};
