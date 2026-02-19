
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, DEFAULT_TRADE } from './types';
import LeadForm from './components/LeadForm';
import ContractorDashboard from './components/ContractorDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<'homeowner' | 'contractor'>('homeowner');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  // Load leads from localStorage on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('paintflow_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, []);

  // Save leads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('paintflow_leads', JSON.stringify(leads));
  }, [leads]);

  const handleLeadSubmit = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation / Mode Toggle */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-indigo-600">
            <i className={`fa-solid ${DEFAULT_TRADE.icon}`}></i>
            <span>PAINTFLOW</span>
          </div>
          
          <div className="bg-slate-100 p-1 rounded-full flex gap-1">
            <button
              onClick={() => setView('homeowner')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                view === 'homeowner' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Homeowner
            </button>
            <button
              onClick={() => setView('contractor')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition flex items-center gap-2 ${
                view === 'contractor' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Contractor
              {leads.filter(l => l.status === 'New').length > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-12">
        {view === 'homeowner' ? (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight">
                Quality Painting. <br/>
                <span className="text-indigo-600">Crypto Friendly.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                Connect with vetted local painting contractors in seconds. Pay with standard currency or your favorite crypto assets.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">
                    <i className="fa-solid fa-shield-check"></i>
                  </div>
                  <div>
                    <div className="font-bold">Vetted Pros</div>
                    <div className="text-sm text-slate-500">Verified licenses</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xl">
                    <i className="fa-brands fa-ethereum"></i>
                  </div>
                  <div>
                    <div className="font-bold">Crypto Ready</div>
                    <div className="text-sm text-slate-500">Pay in ETH/BTC</div>
                  </div>
                </div>
              </div>
            </div>

            <LeadForm onSubmit={handleLeadSubmit} />
          </div>
        ) : (
          <ContractorDashboard leads={leads} onUpdateStatus={updateLeadStatus} />
        )}
      </main>

      {/* Submission Notification */}
      {showNotification && (
        <div className="fixed bottom-8 right-8 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 animate-bounce">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-check"></i>
          </div>
          <div>
            <div className="font-bold">Lead Submitted!</div>
            <div className="text-sm opacity-90">Contractors are reviewing your project.</div>
          </div>
        </div>
      )}

      {/* White Label Info Footer (Visible to developers/white-labelers) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-400 py-3 text-xs text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-center gap-8">
          <span>White Label for: <strong>{DEFAULT_TRADE.name}</strong></span>
          <span className="hidden md:inline">|</span>
          <span>Crypto Payments Enabled</span>
          <span className="hidden md:inline">|</span>
          <span>Gemini AI Engine Active</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
