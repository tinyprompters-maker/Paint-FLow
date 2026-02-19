
import React, { useState } from 'react';
import { ProjectType, Lead, PaymentMethod, DEFAULT_TRADE } from '../types';
import { generateLeadSummary } from '../services/geminiService';

interface LeadFormProps {
  onSubmit: (lead: Lead) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({
    projectType: 'Interior',
    preferredPayment: 'Fiat',
    zip: '',
    size: '',
    details: '',
    name: '',
    email: '',
    phone: '',
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Enrich with AI summary before submitting
    const aiSummary = await generateLeadSummary(formData);
    
    const finalLead: Lead = {
      ...formData as Lead,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'New',
      aiSummary
    };

    onSubmit(finalLead);
    setLoading(false);
  };

  const updateField = (field: keyof Lead, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className={`bg-${DEFAULT_TRADE.primaryColor} p-6 text-white text-center`}>
        <h2 className="text-2xl font-bold">Get Your Free Quote</h2>
        <p className="opacity-90">Quick, simple, and crypto-friendly.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Project Type</label>
              <div className="grid grid-cols-2 gap-3">
                {DEFAULT_TRADE.projectTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('projectType', type)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      formData.projectType === type 
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-100' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 90210"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Approx. Size</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1500 sq ft"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.size}
                  onChange={(e) => updateField('size', e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              Next Step <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Name</label>
              <input
                type="text"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Payment</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateField('preferredPayment', 'Fiat')}
                  className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 ${
                    formData.preferredPayment === 'Fiat' ? 'bg-indigo-50 border-indigo-600' : 'bg-slate-50'
                  }`}
                >
                  <i className="fa-solid fa-credit-card text-indigo-600"></i> Credit/Cash
                </button>
                <button
                  type="button"
                  onClick={() => updateField('preferredPayment', 'Crypto')}
                  className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 ${
                    formData.preferredPayment === 'Crypto' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-slate-50'
                  }`}
                >
                  <i className="fa-brands fa-bitcoin text-amber-500"></i> Crypto
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Processing...</>
                ) : (
                  'Request Free Quote'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default LeadForm;
