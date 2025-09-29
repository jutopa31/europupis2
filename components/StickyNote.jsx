import { useState } from 'react';

const noteColors = [
  'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30',
  'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/30',
  'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30',
  'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30',
  'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30',
];

export default function StickyNote({ note, onDelete, deletable = true }) {
  const [isHovered, setIsHovered] = useState(false);

  const colorIndex = note.id ? note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % noteColors.length : 0;
  const noteColorClass = noteColors[colorIndex];

  return (
    <div
      className={`group relative transform transition-all duration-300 hover:scale-105 hover:-rotate-1 animate-fade-in ${noteColorClass} rounded-xl border backdrop-blur-sm p-4 shadow-soft hover:shadow-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative corner fold */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-zinc-200 dark:border-t-zinc-700 opacity-30"></div>

      <div className="flex items-start justify-between gap-2">
        {note.title && (
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {note.title}
          </h3>
        )}
        {deletable && (
          <button
            onClick={() => onDelete?.(note.id)}
            aria-label="Eliminar nota"
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
              isHovered
                ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 scale-110'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            ✕
          </button>
        )}
      </div>

      {note.body && (
        <p className="whitespace-pre-wrap mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {note.body}
        </p>
      )}

      {/* Sticky note texture lines */}
      <div className="absolute top-8 left-0 right-0 h-px bg-red-200 dark:bg-red-800/30 opacity-20"></div>
      <div className="absolute top-12 left-0 right-0 h-px bg-red-200 dark:bg-red-800/30 opacity-10"></div>

      {/* Pin effect */}
      <div className="absolute -top-2 left-4 w-3 h-3 bg-red-400 dark:bg-red-500 rounded-full shadow-sm border-2 border-red-300 dark:border-red-400 group-hover:animate-bounce-gentle"></div>
    </div>
  );
}
