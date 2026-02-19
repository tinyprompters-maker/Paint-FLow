
import React, { useState } from 'react';
import { Lead, LeadStatus, ProjectType, DEFAULT_TRADE } from '../types';
import LeadDetail from './LeadDetail';

interface ContractorDashboardProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const ContractorDashboard: React.FC<ContractorDashboardProps> = ({ leads, onUpdateStatus }) => {
  const [verifying, setVerifying] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectType | 'All'>('All');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // Apply filters to leads
  const filteredLeads = projectFilter === 'All' 
    ? leads 
    : leads.filter(l => l.projectType === projectFilter);

  const newLeads = filteredLeads.filter(l => l.status === 'New');
  const activeLeads = filteredLeads.filter(l => l.status === 'Accepted' || l.status === 'Contacted');
  
  const cryptoSettlements = filteredLeads.filter(l => l.status === 'Accepted' && l.preferredPayment === 'Crypto');

  const handleVerify = (id: string) => {
    setVerifying(id);
    setTimeout(() => {
      setVerifying(null);
      alert("Payment verified on-chain! Funds moved to internal wallet.");
    }, 2000);
  };

  if (selectedLead) {
    return (
      <LeadDetail 
        lead={selectedLead} 
        onBack={() => setSelectedLeadId(null)} 
        onUpdateStatus={onUpdateStatus}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Contractor Command Center</h2>
          <p className="text-slate-500">Manage your painting pipeline and crypto earnings</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">New Leads</div>
              <div className="text-xl font-bold">{leads.filter(l => l.status === 'New').length}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <i className="fa-brands fa-bitcoin"></i>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Wallet Balance</div>
              <div className="text-xl font-bold">0.042 BTC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-filter text-indigo-500"></i>
            Filter Projects:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setProjectFilter('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                projectFilter === 'All'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              All Types
            </button>
            {DEFAULT_TRADE.projectTypes.map(type => (
              <button
                key={type}
                onClick={() => setProjectFilter(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  projectFilter === type
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Leads Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Inbox (Pending Review)
          </h3>
          {newLeads.length === 0 ? (
            <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <i className="fa-solid fa-inbox text-4xl mb-4"></i>
              <p>No {projectFilter !== 'All' ? projectFilter.toLowerCase() : ''} leads in queue.</p>
            </div>
          ) : (
            newLeads.map(lead => (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLeadId(lead.id)}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
                        {lead.projectType}
                      </span>
                      <h4 className="text-lg font-bold mt-2 group-hover:text-indigo-600 transition">{lead.zip} Area - {lead.size}</h4>
                    </div>
                    {lead.preferredPayment === 'Crypto' && (
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 text-xs font-semibold">
                        <i className="fa-brands fa-bitcoin"></i>
                      </span>
                    )}
                  </div>

                  {lead.aiSummary && (
                    <div className="bg-indigo-50 rounded-xl p-4 mb-4 border border-indigo-100">
                      <p className="text-sm text-indigo-900 italic leading-relaxed line-clamp-2">
                        "{lead.aiSummary}"
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => onUpdateStatus(lead.id, 'Accepted')}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onUpdateStatus(lead.id, 'Declined')}
                      className="flex-1 border border-slate-200 text-slate-400 py-3 rounded-xl font-bold hover:bg-slate-50 transition"
                    >
                      Pass
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Active Pipeline Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800">In Progress</h3>
          {activeLeads.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-400">
              <p>No active {projectFilter !== 'All' ? projectFilter.toLowerCase() : ''} projects.</p>
            </div>
          ) : (
            activeLeads.map(lead => (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLeadId(lead.id)}
                className="bg-white rounded-2xl shadow-sm border-l-4 border-green-500 border-t border-b border-r border-slate-200 p-6 hover:shadow-lg transition cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold group-hover:text-indigo-600 transition">{lead.name}</h4>
                  <span className="text-xs text-slate-400">{new Date(lead.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-phone w-4"></i> {lead.phone}
                  </div>
                </div>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <a href={`tel:${lead.phone}`} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-center font-semibold hover:bg-slate-200 transition">
                    Call
                  </a>
                  <button className="flex-1 border border-indigo-200 text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition">
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Crypto Payment Details Section */}
      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <i className="fa-brands fa-ethereum text-indigo-600"></i>
            Crypto Settlements
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awaiting Confirmation</span>
        </div>
        <div className="overflow-x-auto">
          {cryptoSettlements.length === 0 ? (
            <div className="p-12 text-center text-slate-400 italic">
              No pending crypto transactions for {projectFilter !== 'All' ? projectFilter.toLowerCase() : 'the current'} selection.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Generated Wallet (Client Side)</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cryptoSettlements.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div 
                        className="font-bold text-slate-700 cursor-pointer hover:text-indigo-600"
                        onClick={() => setSelectedLeadId(lead.id)}
                      >
                        {lead.name}
                      </div>
                      <div className="text-xs text-slate-400">{lead.projectType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 p-2 rounded block text-slate-600 font-mono">
                        0x71C7...{lead.id.substring(0, 4)}...E3d2
                      </code>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-600">BTC / ETH</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Awaiting Deposit
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleVerify(lead.id)}
                        disabled={verifying === lead.id}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1"
                      >
                        {verifying === lead.id ? (
                          <><i className="fa-solid fa-spinner fa-spin"></i> Checking...</>
                        ) : (
                          'Verify Sync'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
