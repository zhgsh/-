/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MonkFigureProps {
  name: string;
  isSelf?: boolean;
  robeColor?: string;
  sashColor?: string;
  posture?: 'idle' | 'bowing' | 'prostrating' | 'meditating' | 'sweeping' | 'reading';
  statusText?: string;
  onClick?: () => void;
}

export const MonkFigure: React.FC<MonkFigureProps> = ({
  name,
  isSelf = false,
  robeColor = "#bf7c43",
  sashColor = "#633215",
  posture = 'idle',
  statusText,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className={`relative flex flex-col items-center cursor-pointer transition-all duration-500 group select-none ${
        posture === 'bowing' ? 'scale-95 translate-y-1' : ''
      } ${posture === 'prostrating' ? 'translate-y-3 scale-90' : ''}`}
    >
      {/* Name and status badge */}
      <div className="mb-1.5 flex flex-col items-center">
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-serif font-medium backdrop-blur-md shadow-sm transition-all duration-300 flex items-center gap-1 ${
          isSelf 
            ? 'bg-amber-950/85 text-amber-100 border border-amber-500/60 shadow-amber-900/30' 
            : 'bg-stone-900/75 text-stone-200 border border-stone-700/50'
        }`}>
          {isSelf && <span className="text-amber-300 font-bold">我 ·</span>}
          <span>{name}</span>
        </div>
        {statusText && (
          <span className="text-[10px] font-serif text-stone-300/80 drop-shadow-sm mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {statusText}
          </span>
        )}
      </div>

      {/* Halo for self */}
      {isSelf && (
        <div className="absolute top-7 w-14 h-14 bg-amber-400/20 rounded-full blur-md -z-10 animate-pulse pointer-events-none" />
      )}

      {/* SVG Cartoon Child Monk (Dongjaseung / 小沙弥) */}
      <div className="relative w-14 h-16 transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="50" cy="114" rx="28" ry="6" fill="rgba(0, 0, 0, 0.25)" />

          {posture === 'prostrating' ? (
            /* Prostrating pose */
            <g transform="translate(0, 20)">
              {/* Back / Body bowing down */}
              <ellipse cx="50" cy="80" rx="35" ry="18" fill={robeColor} />
              <rect x="25" y="76" width="50" height="8" rx="4" fill={sashColor} />
              {/* Head touching cushion */}
              <circle cx="50" cy="55" r="18" fill="#fce4cc" />
              {/* Folded hands in front */}
              <ellipse cx="50" cy="40" rx="14" ry="7" fill="#fce4cc" />
            </g>
          ) : posture === 'meditating' ? (
            /* Meditating pose (sitting cross legged) */
            <g>
              {/* Crossed legs / Lower body */}
              <ellipse cx="50" cy="100" rx="36" ry="14" fill={robeColor} />
              {/* Robe torso */}
              <path d="M 30 55 Q 50 50 70 55 L 75 95 Q 50 102 25 95 Z" fill={robeColor} />
              {/* Monk Sash */}
              <rect x="28" y="78" width="44" height="6" rx="3" fill={sashColor} />
              {/* Hands in Dhyana Mudra (禅定印) */}
              <ellipse cx="50" cy="85" rx="14" ry="7" fill="#fce4cc" />
              {/* Head */}
              <circle cx="50" cy="38" r="21" fill="#fce4cc" />
              {/* Ears */}
              <circle cx="28" cy="38" r="4.5" fill="#f9d1b0" />
              <circle cx="72" cy="38" r="4.5" fill="#f9d1b0" />
              {/* Peaceful closed eyes */}
              <path d="M 40 37 Q 45 40 48 37" stroke="#684736" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 52 37 Q 55 40 60 37" stroke="#684736" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Gentle smile */}
              <path d="M 46 47 Q 50 50 54 47" stroke="#684736" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <ellipse cx="37" cy="44" rx="3" ry="1.5" fill="#fca5a5" opacity="0.6" />
              <ellipse cx="63" cy="44" rx="3" ry="1.5" fill="#fca5a5" opacity="0.6" />
            </g>
          ) : posture === 'bowing' ? (
            /* Bowing pose (Hands pressed in Anjali) */
            <g>
              {/* Legs */}
              <rect x="36" y="96" width="10" height="15" rx="4" fill="#6c5643" />
              <rect x="54" y="96" width="10" height="15" rx="4" fill="#6c5643" />
              {/* Robe */}
              <path d="M 28 52 Q 50 48 72 52 L 76 98 Q 50 104 24 98 Z" fill={robeColor} />
              {/* Sash */}
              <rect x="27" y="74" width="46" height="6" rx="3" fill={sashColor} />
              {/* Bowing head */}
              <circle cx="50" cy="36" r="20" fill="#fce4cc" />
              {/* Ears */}
              <circle cx="29" cy="36" r="4.5" fill="#f9d1b0" />
              <circle cx="71" cy="36" r="4.5" fill="#f9d1b0" />
              {/* Closed eyes */}
              <path d="M 41 35 Q 45 38 48 35" stroke="#684736" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 52 35 Q 55 38 59 35" stroke="#684736" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Pressed hands (合掌) */}
              <g transform="translate(42, 60)">
                <path d="M 8 0 L 3 14 L 13 14 Z" fill="#fce4cc" stroke="#d49a75" strokeWidth="1" />
              </g>
            </g>
          ) : (
            /* Standard standing posture */
            <g>
              {/* Legs */}
              <rect x="36" y="95" width="10" height="16" rx="4" fill="#6c5643" />
              <rect x="54" y="95" width="10" height="16" rx="4" fill="#6c5643" />
              {/* Robe Body */}
              <path d="M 28 50 Q 50 46 72 50 L 76 97 Q 50 103 24 97 Z" fill={robeColor} />
              {/* Sash */}
              <rect x="27" y="72" width="46" height="6" rx="3" fill={sashColor} />
              {/* Cute sleeves */}
              <ellipse cx="27" cy="65" rx="7" ry="12" fill={robeColor} />
              <ellipse cx="73" cy="65" rx="7" ry="12" fill={robeColor} />
              {/* Hands */}
              <circle cx="28" cy="74" r="5" fill="#fce4cc" />
              <circle cx="72" cy="74" r="5" fill="#fce4cc" />
              {/* Head */}
              <circle cx="50" cy="34" r="21" fill="#fce4cc" />
              {/* Ears */}
              <circle cx="28" cy="34" r="4.5" fill="#f9d1b0" />
              <circle cx="72" cy="34" r="4.5" fill="#f9d1b0" />
              {/* Cute round open eyes */}
              <circle cx="43" cy="33" r="2.8" fill="#4a2e18" />
              <circle cx="44" cy="32" r="0.9" fill="#ffffff" />
              <circle cx="57" cy="33" r="2.8" fill="#4a2e18" />
              <circle cx="58" cy="32" r="0.9" fill="#ffffff" />
              {/* Smile */}
              <path d="M 46 43 Q 50 46 54 43" stroke="#684736" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <ellipse cx="36" cy="40" rx="3.5" ry="2" fill="#fca5a5" opacity="0.65" />
              <ellipse cx="64" cy="40" rx="3.5" ry="2" fill="#fca5a5" opacity="0.65" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
