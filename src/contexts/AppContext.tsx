import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppState {
  ticketsClaimed: number;
  ticketsVerified: number;
  goal: number;
  statusMessage: string;
  isUnlocked: boolean;
  lastValidationCheck: number;
  validationInProgress: boolean;
}

interface AppContextType {
  state: AppState;
  updateTicketsClaimed: (count: number) => void;
  updateTicketsVerified: (count: number) => void;
  updateGoal: (goal: number) => void;
  updateStatusMessage: (message: string) => void;
  incrementTicketsClaimed: () => void;
  checkValidation: () => Promise<void>;
}

interface ValidationResponse {
  number_sold?: number;
  number_clicked?: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_STATE: AppState = {
  ticketsClaimed: 1247,
  ticketsVerified: 892,
  goal: 5000,
  statusMessage: "The future awaits your contribution. Every verified ticket brings us closer to unlocking tomorrow's possibilities.",
  isUnlocked: false,
  lastValidationCheck: Date.now(),
  validationInProgress: false
};

// Validation service configuration
const VALIDATION_ENDPOINT = import.meta.env.VITE_VALIDATION_ENDPOINT || 'https://n8n.ideanexusventures.com/webhook/c5534b62-e4bb-4921-99ed-26bcb2aadf7b';
const VALIDATION_TOKEN = import.meta.env.VITE_VALIDATION_TOKEN || 'https://n8n.ideanexusventures.com/webhook-test/c5534b62-e4bb-4921-99ed-26bcb2aadf7b';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('futureTickets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Ensure all numeric properties are valid numbers, fallback to defaults if not
        const validatedState: AppState = {
          ticketsClaimed: typeof parsed.ticketsClaimed === 'number' && !isNaN(parsed.ticketsClaimed) 
            ? parsed.ticketsClaimed 
            : DEFAULT_STATE.ticketsClaimed,
          ticketsVerified: typeof parsed.ticketsVerified === 'number' && !isNaN(parsed.ticketsVerified) 
            ? parsed.ticketsVerified 
            : DEFAULT_STATE.ticketsVerified,
          goal: typeof parsed.goal === 'number' && !isNaN(parsed.goal) 
            ? parsed.goal 
            : DEFAULT_STATE.goal,
          statusMessage: typeof parsed.statusMessage === 'string' 
            ? parsed.statusMessage 
            : DEFAULT_STATE.statusMessage,
          lastValidationCheck: typeof parsed.lastValidationCheck === 'number' && !isNaN(parsed.lastValidationCheck) 
            ? parsed.lastValidationCheck 
            : DEFAULT_STATE.lastValidationCheck,
          isUnlocked: false, // Will be recalculated below
          validationInProgress: false
        };
        
        // Calculate isUnlocked based on validated numbers
        validatedState.isUnlocked = validatedState.ticketsVerified >= validatedState.goal;
        
        return validatedState;
      } catch (error) {
        console.error('Error parsing saved state from localStorage:', error);
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    setState(prev => ({
      ...prev,
      isUnlocked: prev.ticketsVerified >= prev.goal
    }));
  }, [state.ticketsVerified, state.goal]);

  useEffect(() => {
    localStorage.setItem('futureTickets', JSON.stringify(state));
  }, [state]);

  // Function to fetch validation data
  const fetchValidationData = async (type: 'sold' | 'clicked'): Promise<number | null> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header if token is configured
      if (VALIDATION_TOKEN) {
        headers['Authorization'] = `Bearer ${VALIDATION_TOKEN}`;
      }
      
      const url = new URL(VALIDATION_ENDPOINT);
      url.searchParams.append('type', type);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        mode: 'cors' // Explicitly set CORS mode
      });
      
      if (response.ok) {
        const data: ValidationResponse = await response.json();
          console.log(data)
        if (type === 'sold' && typeof data.number_sold === 'number') {
          return data.number_sold;
        } else if (type === 'clicked' && typeof data.number_clicked === 'number') {
          return data.number_clicked;
        } else {
          console.warn(`Invalid response format: expected ${type === 'sold' ? 'number_sold' : 'number_clicked'} property`);
          return null;
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Validation check failed for type ${type}:`, error);
      return null;
    }
  };

  // Polling function to check validation service
  useEffect(() => {
    const pollValidation = async () => {
      if (state.validationInProgress) return;
      
      setState(prev => ({ ...prev, validationInProgress: true }));
      
      try {
        // Fetch both sold and clicked data
        const [soldCount, clickedCount] = await Promise.all([
          fetchValidationData('sold'),
          fetchValidationData('clicked')
        ]);
        
        setState(prev => ({
          ...prev,
          ticketsVerified: soldCount !== null ? soldCount : prev.ticketsVerified,
          ticketsClaimed: clickedCount !== null ? clickedCount : prev.ticketsClaimed,
          lastValidationCheck: Date.now(),
          validationInProgress: false
        }));
      } catch (error) {
        // Fallback for demo - simulate some progress
        setState(prev => ({
          ...prev,
          ticketsVerified: Math.min(prev.ticketsVerified + Math.floor(Math.random() * 2), prev.ticketsClaimed),
          lastValidationCheck: Date.now(),
          validationInProgress: false
        }));
      }
    };

    // Poll every 30 seconds
    const interval = setInterval(pollValidation, 30000);
    
    // Initial check
    pollValidation();
    
    return () => clearInterval(interval);
  }, []);

  const updateTicketsClaimed = (count: number) => {
    setState(prev => ({ ...prev, ticketsClaimed: count }));
  };

  const updateTicketsVerified = (count: number) => {
    setState(prev => ({ ...prev, ticketsVerified: count }));
  };

  const updateGoal = (goal: number) => {
    setState(prev => ({ ...prev, goal }));
  };

  const updateStatusMessage = (message: string) => {
    setState(prev => ({ ...prev, statusMessage: message }));
  };

  const incrementTicketsClaimed = () => {
    setState(prev => ({ ...prev, ticketsClaimed: prev.ticketsClaimed + 1 }));
  };

  const checkValidation = async () => {
    if (state.validationInProgress) return;
    
    setState(prev => ({ ...prev, validationInProgress: true }));
    
    try {
      // Fetch both sold and clicked data
      const [soldCount, clickedCount] = await Promise.all([
        fetchValidationData('sold'),
        fetchValidationData('clicked')
      ]);
      
      setState(prev => ({
        ...prev,
        ticketsVerified: soldCount !== null ? soldCount : prev.ticketsVerified,
        ticketsClaimed: clickedCount !== null ? clickedCount : prev.ticketsClaimed,
        lastValidationCheck: Date.now(),
        validationInProgress: false
      }));
    } catch (error) {
      // Fallback behavior
      setState(prev => ({
        ...prev,
        ticketsVerified: Math.min(prev.ticketsVerified + Math.floor(Math.random() * 2), prev.ticketsClaimed),
        lastValidationCheck: Date.now(),
        validationInProgress: false
      }));
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      updateTicketsClaimed,
      updateTicketsVerified,
      updateGoal,
      updateStatusMessage,
      incrementTicketsClaimed,
      checkValidation
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}