import React, { useState } from 'react';
import { Shield, Save, BarChart3, Settings, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function AdminPage() {
  const { state, updateTicketsClaimed, updateTicketsVerified, updateGoal, updateStatusMessage, checkValidation } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    ticketsClaimed: state.ticketsClaimed,
    ticketsVerified: state.ticketsVerified,
    goal: state.goal,
    statusMessage: state.statusMessage
  });
  const [isSaving, setIsSaving] = useState(false);

  // Demo password - in production, this would be properly hashed and stored securely
  const ADMIN_PASSWORD = 'future2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateTicketsClaimed(formData.ticketsClaimed);
    updateTicketsVerified(formData.ticketsVerified);
    updateGoal(formData.goal);
    updateStatusMessage(formData.statusMessage);
    
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const handleManualValidationCheck = () => {
    checkValidation();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-purple-500/20">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-white/60 mt-2">Enter password to manage the portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-black/30 text-white placeholder-white/40 px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Access Admin Panel
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              ← Back to Portal
            </a>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
            <p className="text-blue-300 text-xs text-center">
              Demo Password: <code className="bg-black/30 px-1 rounded">future2024</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Settings className="text-purple-400" size={32} />
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleManualValidationCheck}
              disabled={state.validationInProgress}
              className="flex items-center gap-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={state.validationInProgress ? 'animate-spin' : ''} />
              Check Validation
            </button>
            <a
              href="/"
              className="text-white/60 hover:text-white transition-colors"
            >
              View Portal
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-600/20 text-red-400 hover:bg-red-600/30 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-blue-400 text-xl">🎫</span>
              <span className="text-white/80">Claimed</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {state.ticketsClaimed.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">tickets claimed</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-green-400" size={20} />
              <span className="text-white/80">Verified</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {state.ticketsVerified.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">payments verified</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-purple-400" size={24} />
              <span className="text-white/80">Progress</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {((state.ticketsVerified / state.goal) * 100).toFixed(1)}%
            </div>
            <div className="text-white/60 text-sm">of verified goal</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-blue-400 text-xl">🎯</span>
              <span className="text-white/80">Status</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {state.isUnlocked ? '🌟 UNLOCKED' : 'In Progress'}
            </div>
            <div className="text-white/60 text-sm">
              {state.isUnlocked ? 'Future activated!' : `${state.goal - state.ticketsVerified} verified remaining`}
            </div>
          </div>
        </div>

        {/* Validation Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Validation System</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/80 text-sm">Validation Endpoint:</label>
              <div className="bg-black/30 px-3 py-2 rounded-lg border border-purple-500/30 mt-1">
                <code className="text-green-400 text-sm">
                  {import.meta.env.VITE_VALIDATION_ENDPOINT || 'Demo mode (no endpoint configured)'}
                </code>
              </div>
            </div>
            <div>
              <label className="text-white/80 text-sm">Last Check:</label>
              <div className="bg-black/30 px-3 py-2 rounded-lg border border-purple-500/30 mt-1">
                <span className="text-white text-sm">
                  {new Date(state.lastValidationCheck).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-4">
            Configure VITE_VALIDATION_ENDPOINT and VITE_VALIDATION_TOKEN environment variables to connect to your payment validation service.
          </p>
        </div>

        {/* Admin Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Manage Portal Settings</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white/80 font-medium mb-2">
                  Tickets Claimed
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.ticketsClaimed}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketsClaimed: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-black/30 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                />
              </div>
              
              <div>
                <label className="block text-white/80 font-medium mb-2">
                  Tickets Verified
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.ticketsClaimed}
                  value={formData.ticketsVerified}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketsVerified: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-black/30 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                />
              </div>
              
              <div>
                <label className="block text-white/80 font-medium mb-2">
                  Goal Target
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: parseInt(e.target.value) || 5000 }))}
                  className="w-full bg-black/30 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Status Message
              </label>
              <textarea
                value={formData.statusMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, statusMessage: e.target.value }))}
                rows={4}
                className="w-full bg-black/30 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 resize-none"
                placeholder="Enter the status message shown to visitors..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}