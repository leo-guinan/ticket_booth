import React from 'react';
import { X, Share2, Copy, Twitter, AlertCircle } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
}

export function TicketModal({ isOpen, onClose, isUnlocked }: TicketModalProps) {
  if (!isOpen) return null;

  const shareText = isUnlocked 
    ? "🌟 The Future is UNLOCKED! Join the movement at" 
    : "🎫 I just claimed a ticket to the future! Join me at";
  
  const shareUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(`${shareText} ${shareUrl} #TicketsToTheFuture`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🎫</span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            {isUnlocked ? '🌟 Future Unlocked!' : 'Ticket Claimed!'}
          </h3>
          
          <p className="text-white/80 mb-6 leading-relaxed">
            {isUnlocked 
              ? "Incredible! We've reached our verified goal. The future is now unlocked for everyone. You're part of history!"
              : "Thank you for contributing to the future! Your ticket has been logged and we're one step closer to unlocking tomorrow's possibilities."
            }
          </p>

          {!isUnlocked && (
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-blue-400" size={20} />
                <span className="text-blue-400 font-semibold">Verification Pending</span>
              </div>
              <p className="text-white/70 text-sm">
                Your payment will be verified automatically within minutes. Only verified payments count toward unlocking the future.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Share the Future</h4>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Twitter size={18} />
                Tweet
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Copy size={18} />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}