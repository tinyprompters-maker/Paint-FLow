
export type ProjectType = 'Interior' | 'Exterior' | 'Cabinets' | 'Commercial' | 'Deck/Fence';
export type LeadStatus = 'New' | 'Accepted' | 'Declined' | 'Contacted';
export type PaymentMethod = 'Fiat' | 'Crypto';

export interface Lead {
  id: string;
  timestamp: number;
  zip: string;
  size: string; // e.g. "1500 sq ft" or "3 Bedrooms"
  projectType: ProjectType;
  details: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  aiSummary?: string;
  preferredPayment: PaymentMethod;
}

export interface TradeConfig {
  name: string;
  primaryColor: string;
  icon: string;
  projectTypes: ProjectType[];
}

export const DEFAULT_TRADE: TradeConfig = {
  name: 'Painting',
  primaryColor: 'indigo-600',
  icon: 'fa-paint-roller',
  projectTypes: ['Interior', 'Exterior', 'Cabinets', 'Commercial', 'Deck/Fence']
};
