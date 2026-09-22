import React from 'react';

interface CulturalDividerProps {
  color?: string;
  symbol?: string;
  className?: string;
}

export const CulturalDivider: React.FC<CulturalDividerProps> = ({
  color = '#F59E0B',
  symbol = '🌸',
  className = '',
}) => {
  return (
    <div className={`w-full flex items-center justify-center gap-3 py-4 select-none ${className}`}>
      <div
        className="h-[1px] flex-1 max-w-xs bg-gradient-to-r from-transparent via-amber-400/60 to-amber-300"
        style={{ borderColor: color }}
      />
      <div className="flex items-center gap-1.5 text-amber-300 text-xs sm:text-sm font-cinzel">
        <span className="text-[10px] text-amber-400/80">✦</span>
        <span className="transform hover:scale-125 transition-transform duration-300">{symbol}</span>
        <span className="text-[10px] text-amber-400/80">✦</span>
      </div>
      <div
        className="h-[1px] flex-1 max-w-xs bg-gradient-to-l from-transparent via-amber-400/60 to-amber-300"
        style={{ borderColor: color }}
      />
    </div>
  );
};
