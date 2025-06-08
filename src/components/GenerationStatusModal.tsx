import React from 'react';
import { Sparkles, Copy, Twitter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GenerationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    status: string;
    image: string;
    story: string;
  } | null;
  onShare: () => void;
}

export function GenerationStatusModal({ isOpen, onClose, result, onShare }: GenerationStatusModalProps) {
  if (!isOpen || !result) return null;

  const shareUrl = `${window.location.origin}/future/${result.image.split('/').pop()?.split('.')[0]}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(`I just generated my future vision! Check it out: ${shareUrl} #TicketsToTheFuture`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full relative">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Your Future Vision
          </h3>

          <div className="space-y-6">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/30">
              <img 
                src={result.image} 
                alt="Generated future vision" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{result.story}</ReactMarkdown>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-white/70">Share your future:</span>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    <Copy size={18} className="text-white" />
                  </button>
                  <button
                    onClick={shareOnTwitter}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Share on Twitter"
                  >
                    <Twitter size={18} className="text-white" />
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 