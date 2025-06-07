import React from 'react';
import { Sparkles, Shield, Clock } from 'lucide-react';

interface DualProgressBarProps {
  claimed: number;
  verified: number;
  goal: number;
  isUnlocked: boolean;
  validationInProgress: boolean;
  lastValidationCheck: number;
}

export function DualProgressBar({ 
  claimed, 
  verified, 
  goal, 
  isUnlocked, 
  validationInProgress,
  lastValidationCheck 
}: DualProgressBarProps) {
  const claimedPercentage = Math.min((claimed / goal) * 100, 100);
  const verifiedPercentage = Math.min((verified / goal) * 100, 100);
  
  const timeSinceLastCheck = Math.floor((Date.now() - lastValidationCheck) / 1000);
  
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Claimed Tickets Progress */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-medium">Tickets Claimed</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <span className="text-white font-bold">
            {claimed.toLocaleString()} / {goal.toLocaleString()}
          </span>
        </div>
        
        <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-blue-500/30">
          <div 
            className="h-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
            style={{ width: `${claimedPercentage}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        <div className="text-center mt-2">
          <span className="text-blue-400 font-semibold">
            {claimedPercentage.toFixed(1)}% Claimed
          </span>
        </div>
      </div>

      {/* Verified Tickets Progress */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-medium">Tickets Verified</span>
            <Shield className="w-4 h-4 text-green-400" />
            {validationInProgress && (
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-white font-bold">
            {verified.toLocaleString()} / {goal.toLocaleString()}
          </span>
        </div>
        
        <div className="relative h-4 bg-black/30 rounded-full overflow-hidden border border-green-500/30">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${
              isUnlocked 
                ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400' 
                : 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600'
            }`}
            style={{ width: `${verifiedPercentage}%` }}
          />
          
          {isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        <div className="text-center mt-2">
          <span className={`font-semibold ${
            isUnlocked ? 'text-green-400' : 'text-green-500'
          }`}>
            {verifiedPercentage.toFixed(1)}% Verified
          </span>
        </div>
      </div>

      {/* Validation Status */}
      <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-white/80 text-sm">Last validation check:</span>
          </div>
          <span className="text-purple-400 text-sm">
            {timeSinceLastCheck < 60 ? `${timeSinceLastCheck}s ago` : `${Math.floor(timeSinceLastCheck / 60)}m ago`}
          </span>
        </div>
        
        {!isUnlocked && (
          <p className="text-white/60 text-sm mt-2">
            The future will only be unlocked when verified payments reach the goal. 
            Validation occurs automatically every 30 seconds.
          </p>
        )}
      </div>
    </div>
  );
}