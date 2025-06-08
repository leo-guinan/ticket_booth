import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface FutureDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
  isSubmitting: boolean;
}

export function FutureDescriptionModal({ isOpen, onClose, onSubmit, isSubmitting }: FutureDescriptionModalProps) {
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(description);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Describe Your Future
          </h3>
          <p className="text-white/70">
            What future do you want to help create? Share your vision.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the future you want to see..."
              className="w-full h-32 bg-black/30 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 resize-none"
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !description.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Your Future...</span>
              </>
            ) : (
              <span>Generate My Future</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 