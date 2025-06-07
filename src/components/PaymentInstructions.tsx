import React from 'react';
import { ExternalLink, CreditCard, Copy, CheckCircle } from 'lucide-react';

interface PaymentInstructionsProps {
  onTicketClaim: () => void;
}

export function PaymentInstructions({ onTicketClaim }: PaymentInstructionsProps) {
  const paypalEmail = "info@up4thechallenge.org";
  
  const copyEmail = () => {
    navigator.clipboard.writeText(paypalEmail);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      
      
      {/* Manual Instructions */}
      <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20">
        <h4 className="text-white font-semibold mb-4 text-center">Payment Instructions</h4>
        
        <div className="space-y-3">
          <div>
            <label className="text-white/70 text-sm">Send to:</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-black/40 px-3 py-2 rounded-lg border border-purple-500/20">
                <span className="text-white font-mono text-sm">{paypalEmail}</span>
              </div>
              <button
                onClick={copyEmail}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                title="Copy email"
              >
                <Copy size={16} className="text-white" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-white/70 text-sm">Amount:</label>
            <div className="bg-black/40 px-3 py-2 rounded-lg border border-purple-500/20 mt-1">
              <span className="text-white font-bold">£1.00 GBP</span>
            </div>
          </div>
          
          <div>
            <label className="text-white/70 text-sm">Note (optional):</label>
            <div className="bg-black/40 px-3 py-2 rounded-lg border border-purple-500/20 mt-1">
              <span className="text-white/80 text-sm">Ticket to the Future</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Claim Button */}
      <div className="text-center space-y-3">
        <button
          onClick={onTicketClaim}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <CheckCircle size={24} />
          <span className="text-lg">I've sent £1 — Log my ticket</span>
        </button>
        
        <p className="text-white/60 text-sm">
          Click after completing your payment. Verification will occur automatically.
        </p>
      </div>
    </div>
  );
}