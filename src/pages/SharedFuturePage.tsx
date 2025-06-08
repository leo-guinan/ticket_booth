import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Share2, Copy, Twitter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GenerationResult {
  status: string;
  image_url: string;
  story: string;
}
const VALIDATION_TOKEN = import.meta.env.VITE_VALIDATION_TOKEN || 'https://n8n.ideanexusventures.com/webhook-test/c5534b62-e4bb-4921-99ed-26bcb2aadf7b';

const statusMessages = [
  "Dreaming up your future…",
  "Consulting the time oracles…",
  "Stitching together tomorrow's possibilities…",
  "Gathering inspiration from the stars…",
  "Rendering your vision into reality…"
];

export function SharedFuturePage() {
  const { generationId } = useParams<{ generationId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [statusIndex, setStatusIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');

  useEffect(() => {
    if (loading) {
      const msgInterval = setInterval(() => {
        setStatusIndex((i) => (i + 1) % statusMessages.length);
      }, 2500);
      return () => clearInterval(msgInterval);
    }
  }, [loading]);

  useEffect(() => {
    if (!generationId) {
      navigate('/');
      return;
    }

    setShareUrl(`${window.location.origin}/future/${generationId}`);

    let interval: ReturnType<typeof setInterval>;
    let isMounted = true;

    const fetchFuture = async () => {
      try {
        const url = new URL(`${import.meta.env.VITE_GENERATION_STATUS_ENDPOINT || 'https://n8n.ideanexusventures.com/webhook/generation-status'}/${generationId}`);
     
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        // Add authorization header if token is configured
        if (VALIDATION_TOKEN) {
          headers['Authorization'] = `Bearer ${VALIDATION_TOKEN}`;
        }
        
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers,
          mode: 'cors' // Explicitly set CORS mode
        });

        if (!response.ok) throw new Error('Failed to fetch future');

        const data = await response.json();
        
        if (data.status === 'success') {
          if (isMounted) {
            setResult(data);
            setLoading(false);
            clearInterval(interval);
          }
        } else if (data.status === 'error') {
          throw new Error('Future not found');
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load this future vision');
          setLoading(false);
          clearInterval(interval);
        }
      }
    };

    fetchFuture();
    interval = setInterval(fetchFuture, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [generationId, navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(`Check out this vision of the future: ${shareUrl} #TicketsToTheFuture`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus('sending');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization header if token is configured
    if (VALIDATION_TOKEN) {
      headers['Authorization'] = `Bearer ${VALIDATION_TOKEN}`;
    }
    

    try {
      await fetch('https://n8n.ideanexusventures.com/webhook/capture-email', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, generationId }),
        mode: 'cors'
      });
      setEmailStatus('sent');
    } catch {
      setEmailStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {statusMessages[statusIndex]}
          </h3>
          <form onSubmit={handleEmailSubmit} className="space-y-2 max-w-xs mx-auto">
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-black/40 border border-purple-500/30 text-white"
              placeholder="Your email for updates"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={emailStatus === 'sending' || emailStatus === 'sent'}
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
              disabled={emailStatus === 'sending' || emailStatus === 'sent'}
            >
              {emailStatus === 'sending' ? 'Signing up…' : emailStatus === 'sent' ? 'Signed up!' : 'Notify Me'}
            </button>
            {emailStatus === 'error' && (
              <div className="text-red-400 text-sm mt-1">Failed to sign up. Try again.</div>
            )}
          </form>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {error || 'Future Not Found'}
          </h3>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              A Vision of the Future
            </h1>
          </div>

          <div className="space-y-8">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/30">
              <img 
                src={'https://s3.us-east-2.amazonaws.com/ticket-to-the-future-hhgttf/' + result.image_url} 
                alt="Generated future vision" 
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="bg-black/70 rounded-lg p-8 border border-purple-500/20"
              style={{ color: "#fff", fontSize: "1.15rem", lineHeight: "1.7" }}
            >
              <div className="prose prose-invert max-w-none" style={{ color: "#fff" }}>
                <ReactMarkdown>{result.story}</ReactMarkdown>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Copy size={18} />
                Copy Link
              </button>
              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Twitter size={18} />
                Share on Twitter
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 