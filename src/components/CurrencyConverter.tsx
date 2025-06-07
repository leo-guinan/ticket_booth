import React, { useState, useEffect } from 'react';
import { DollarSign, Euro, Pen as Yen } from 'lucide-react';

interface CurrencyRate {
  code: string;
  symbol: string;
  rate: number;
  icon: React.ReactNode;
}

export function CurrencyConverter() {
  const [rates, setRates] = useState<CurrencyRate[]>([
    { code: 'USD', symbol: '$', rate: 1.27, icon: <DollarSign size={16} /> },
    { code: 'EUR', symbol: '€', rate: 1.17, icon: <Euro size={16} /> },
    { code: 'JPY', symbol: '¥', rate: 188.5, icon: <Yen size={16} /> },
    { code: 'CAD', symbol: 'C$', rate: 1.72, icon: <DollarSign size={16} /> },
    { code: 'AUD', symbol: 'A$', rate: 1.92, icon: <DollarSign size={16} /> }
  ]);

  useEffect(() => {
    // In production, fetch real exchange rates
    const fetchRates = async () => {
      try {
        // Mock API call - replace with actual exchange rate service
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
        if (response.ok) {
          const data = await response.json();
          setRates(prev => prev.map(rate => ({
            ...rate,
            rate: data.rates[rate.code] || rate.rate
          })));
        }
      } catch (error) {
        console.log('Using fallback exchange rates');
      }
    };

    fetchRates();
  }, []);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
      <h4 className="text-white font-semibold mb-4 text-center">£1 GBP converts to:</h4>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {rates.map((currency) => (
          <div 
            key={currency.code}
            className="bg-black/30 rounded-lg p-3 text-center border border-white/10"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              {currency.icon}
              <span className="text-white/80 text-sm font-medium">{currency.code}</span>
            </div>
            <div className="text-white font-bold">
              {currency.symbol}{currency.rate.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-white/60 text-xs text-center mt-4">
        Exchange rates are approximate and updated periodically
      </p>
    </div>
  );
}