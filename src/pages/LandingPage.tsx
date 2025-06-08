import React, { useState } from 'react';
import { Rocket, Clock, Users, Sparkles, Shield, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { DualProgressBar } from '../components/DualProgressBar';
import { PaymentInstructions } from '../components/PaymentInstructions';
import { CurrencyConverter } from '../components/CurrencyConverter';
import { TicketModal } from '../components/TicketModal';
import { FutureDescriptionModal } from '../components/FutureDescriptionModal';
import { GenerationStatusModal } from '../components/GenerationStatusModal';
import { CosmicBackground } from '../components/CosmicBackground';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const { state, incrementTicketsClaimed, checkValidation, generateFuture } = useApp();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showFutureModal, setShowFutureModal] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleTicketClaim = async () => {
    await incrementTicketsClaimed();
    setShowFutureModal(true);
  };

  const handleFutureSubmit = async (description: string) => {
    try {
      setIsSubmitting(true);
      const id = await generateFuture(description);
      setShowFutureModal(false);
      navigate(`/future/${id}`);
    } catch (error) {
      console.error('Error submitting future:', error);
      alert('Failed to submit your future vision. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerationComplete = () => {
    setShowTicketModal(true);
  };

  const handleManualValidationCheck = () => {
    checkValidation();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Rocket className="text-purple-400" size={32} />
              <span className="text-white font-bold text-xl">Future Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleManualValidationCheck}
                disabled={state.validationInProgress}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm disabled:opacity-50"
                title="Check validation status"
              >
                <RefreshCw size={16} className={state.validationInProgress ? 'animate-spin' : ''} />
                Refresh
              </button>
              <a
                href="/admin"
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                Admin
              </a>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-6 leading-tight">
              Tickets to the Future
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
              For just £1, secure your place in tomorrow's possibilities
            </p>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-12">
              {state.isUnlocked ? (
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
                  <h2 className="text-4xl font-bold text-green-400 mb-4">🎉 Future Unlocked!</h2>
                  <p className="text-white/90 text-lg">
                    Incredible! We've reached our verified goal. The timeline is now active and the future is unlocked for everyone!
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Mission Status</h2>
                  <DualProgressBar 
                    claimed={state.ticketsClaimed}
                    verified={state.ticketsVerified}
                    goal={state.goal} 
                    isUnlocked={state.isUnlocked}
                    validationInProgress={state.validationInProgress}
                    lastValidationCheck={state.lastValidationCheck}
                  />
                  <p className="text-white/70 mt-6 leading-relaxed">
                    {state.statusMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Currency Converter */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <CurrencyConverter />
          </div>
        </section>

        {/* Payment Section */}
        {!state.isUnlocked && (
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
                <h3 className="text-2xl font-bold text-white text-center mb-8">
                  Secure Your Ticket
                </h3>
                
                <PaymentInstructions onTicketClaim={handleTicketClaim} />
              </div>
            </div>
          </section>
        )}

        {/* Validation Info Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">Payment Validation</h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                All payments are verified through our secure validation system before counting toward the goal. 
                This ensures the integrity of our mission and prevents the future from being unlocked prematurely. 
                Verification typically occurs within minutes of payment and is checked automatically every 30 seconds.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-white text-center mb-12">
              Why Join the Mission?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
                <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">Verified Progress</h4>
                <p className="text-white/70">
                  Only verified payments count toward unlocking the future. Every contribution is validated for authenticity.
                </p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">Collective Power</h4>
                <p className="text-white/70">
                  Join thousands of verified contributors working together to unlock tomorrow's possibilities.
                </p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
                <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">Be Part of History</h4>
                <p className="text-white/70">
                  Your verified contribution will be remembered as part of the moment the future was unlocked.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-purple-500/20">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">
              Not a security offering. This is about vibes, vision, and collective action.
            </p>
            <p className="text-white/60 text-sm">
              Contact: <span className="text-white/80">info@up4thechallenge.org</span>
            </p>
            <p className="text-white/60 text-xs mt-2">
              Validation endpoint: {import.meta.env.VITE_VALIDATION_ENDPOINT || 'Demo mode'}
            </p>
          </div>
        </footer>
      </div>

      <TicketModal 
        isOpen={showTicketModal} 
        onClose={() => setShowTicketModal(false)}
        isUnlocked={state.isUnlocked}
      />

      <FutureDescriptionModal
        isOpen={showFutureModal}
        onClose={() => setShowFutureModal(false)}
        onSubmit={handleFutureSubmit}
        isSubmitting={isSubmitting}
      />

      <GenerationStatusModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        result={state.generationResult}
        onShare={handleGenerationComplete}
      />
    </div>
  );
}