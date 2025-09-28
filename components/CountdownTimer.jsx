'use client';
import { useEffect, useState } from 'react';

function computeTimeLeft(target) {
  const now = new Date();
  const diff = Math.max(0, target - now);
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function Tile({ label, value, index }) {
  const delayClass = index === 0 ? '' : index === 1 ? 'animate-delay-75' : index === 2 ? 'animate-delay-150' : 'animate-delay-300';
  
  return (
    <div className={`flex flex-col items-center animate-fade-in ${delayClass}`}>
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-accent-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
        <div className="relative min-w-[72px] h-[72px] sm:min-w-[80px] sm:h-[80px] rounded-xl bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105">
          <span className="bg-gradient-to-br from-brand-600 to-accent-600 bg-clip-text text-transparent">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="mt-3 text-xs uppercase tracking-wider font-medium muted">{label}</div>
    </div>
  );
}

export default function CountdownTimer({ targetDate, prefixText = 'Europupis comienza en…' }) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => setTimeLeft(computeTimeLeft(target));
    updateTime(); // Set initial time
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div aria-live="polite" className="animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-sm font-medium muted uppercase tracking-wider">{prefixText}</div>
          <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-brand-400 to-accent-400 rounded-full"></div>
        </div>
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <Tile label="Días" value={0} index={0} />
          <div className="text-2xl text-zinc-400 animate-pulse">:</div>
          <Tile label="Horas" value={0} index={1} />
          <div className="text-2xl text-zinc-400 animate-pulse">:</div>
          <Tile label="Minutos" value={0} index={2} />
          <div className="text-2xl text-zinc-400 animate-pulse">:</div>
          <Tile label="Segundos" value={0} index={3} />
        </div>
      </div>
    );
  }

  if (timeLeft.done) {
    return (
      <div className="text-center animate-fade-in">
        <div className="text-4xl sm:text-6xl mb-4">🎉</div>
        <p className="text-2xl sm:text-3xl font-bold gradient-text">¡Buen viaje!</p>
        <p className="text-lg muted mt-2">¡Tu aventura europea comienza!</p>
      </div>
    );
  }

  return (
    <div aria-live="polite" className="animate-fade-in">
      <div className="text-center mb-6">
        <div className="text-sm font-medium muted uppercase tracking-wider">{prefixText}</div>
        <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-brand-400 to-accent-400 rounded-full"></div>
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <Tile label="Días" value={timeLeft.days} index={0} />
        <div className="text-2xl text-zinc-400 animate-pulse">:</div>
        <Tile label="Horas" value={timeLeft.hours} index={1} />
        <div className="text-2xl text-zinc-400 animate-pulse">:</div>
        <Tile label="Minutos" value={timeLeft.minutes} index={2} />
        <div className="text-2xl text-zinc-400 animate-pulse">:</div>
        <Tile label="Segundos" value={timeLeft.seconds} index={3} />
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm muted">
          {timeLeft.days > 1 && `¡Faltan ${timeLeft.days} días! `}
          {timeLeft.days === 1 && '¡Falta 1 día! '}
          ¡A emocionarse! ✨
        </p>
      </div>
    </div>
  );
}
