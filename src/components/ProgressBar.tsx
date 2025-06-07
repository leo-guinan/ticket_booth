import React from 'react';
import { Sparkles } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  goal: number;
  isUnlocked: boolean;
}

export function ProgressBar({ current, goal, isUnlocked }: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-white/80 font-medium">Progress to the Future</span>
        <span className="text-white font-bold">
          {current.toLocaleString()} / {goal.toLocaleString()}
        </span>
      </div>
      
      <div className="relative h-4 bg-black/30 rounded-full overflow-hidden border border-purple-500/30">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${
            isUnlocked 
              ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400' 
              : 'bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
        
        {isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      
      <div className="text-center mt-4">
        <span className={`text-lg font-semibold ${
          isUnlocked ? 'text-green-400' : 'text-purple-400'
        }`}>
          {percentage.toFixed(1)}% Complete
        </span>
      </div>
    </div>
  );
}