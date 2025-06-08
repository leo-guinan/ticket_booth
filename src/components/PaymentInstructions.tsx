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
      <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20 text-center">
        <h4 className="text-white font-semibold mb-4">Payment Instructions</h4>
        <a
          href="https://www.paypal.biz/ticketstothefuture"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-200 shadow-lg"
        >
          Pay with PayPal
        </a>
        <p className="text-white/70 mt-4">
          Click the button above to pay £1 for your Ticket to the Future.
        </p>
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