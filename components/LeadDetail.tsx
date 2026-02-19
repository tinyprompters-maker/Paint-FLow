
import React from 'react';
import { Lead, LeadStatus, DEFAULT_TRADE } from '../types';

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack, onUpdateStatus }) => {
  const isNew = lead.status === 'New';

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className={`bg-slate-900 p-8 text-white relative overflow-hidden`}>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
                  {lead.projectType}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  lead.status === 'New' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                  lead.status === 'Accepted' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  'bg-slate-500/20 text-slate-300 border-slate-500/30'
                }`}>
                  {lead.status}
                </span>
              </div>
              <h1 className="text-3xl font-black">{lead.name || 'Anonymous Inquiry'}</h1>
              <p className="text-slate-400 mt-1">
                <i className="fa-solid fa-location-dot mr-2"></i>
                {lead.zip} Area • Submitted {new Date(lead.timestamp).toLocaleString()}
              </p>
            </div>

            {isNew && (
              <div className="flex gap-3">
                <button
                  onClick={() => { onUpdateStatus(lead.id, 'Accepted'); onBack(); }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i> Accept
                </button>
                <button
                  onClick={() => { onUpdateStatus(lead.id, 'Declined'); onBack(); }}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition border border-white/20"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
          {/* Abstract background shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          {/* Left Column: Contact & Core Specs */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Project Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Scope</div>
                  <div className="font-bold text-slate-800">{lead.size}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Type</div>
                  <div className="font-bold text-slate-800">{lead.projectType}</div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Phone Number</div>
                    <div className="font-bold">{lead.phone}</div>
                  </div>
                  <a href={`tel:${lead.phone}`} className="ml-auto text-indigo-600 font-bold hover:underline">Call Now</a>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Email Address</div>
                    <div className="font-bold">{lead.email}</div>
                  </div>
                  <a href={`mailto:${lead.email}`} className="ml-auto text-indigo-600 font-bold hover:underline">Message</a>
                </div>
              </div>
            </section>

            {lead.aiSummary && (
              <section className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4 font-black text-sm uppercase tracking-tighter">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    AI Project Intelligence
                  </div>
                  <p className="text-lg leading-relaxed font-medium opacity-90 italic">
                    "{lead.aiSummary}"
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 opacity-10 -mr-8 -mb-8">
                  <i className="fa-solid fa-brain text-9xl"></i>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Payment & Meta */}
          <div className="space-y-8">
            <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Preference</h3>
              {lead.preferredPayment === 'Crypto' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-600 font-bold">
                    <i className="fa-brands fa-bitcoin text-2xl"></i>
                    Cryptocurrency
                  </div>
                  <div className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-200 break-all font-mono">
                    Wallet Hash:<br/>
                    0x71C7...{lead.id.substring(0, 4)}...E3d2
                  </div>
                  <p className="text-xs text-slate-500">
                    This client prefers to settle via on-chain transaction. Ensure your wallet is synced before starting.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-700 font-bold">
                    <i className="fa-solid fa-credit-card text-2xl text-indigo-600"></i>
                    Fiat / Standard
                  </div>
                  <p className="text-xs text-slate-500">
                    Client prefers cash, check, or standard credit card processing.
                  </p>
                </div>
              )}
            </section>

            <section className="p-6 bg-white border border-slate-100 rounded-3xl">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Lead Score</h3>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-black text-slate-900">92</div>
                <div className="text-sm text-slate-500 pb-1 font-bold">/ 100</div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-green-500 h-full w-[92%] rounded-full"></div>
              </div>
              <p className="text-xs text-slate-400 mt-3">Based on project size and local market demand.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
