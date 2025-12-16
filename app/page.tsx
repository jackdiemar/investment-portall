'use client';

import React, { useState } from 'react';
import { Lock, TrendingUp, Building2, DollarSign, BarChart3, Eye, EyeOff, ArrowLeft, ExternalLink } from 'lucide-react';

export default function InvestmentPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const PORTAL_PASSWORD = 'invest2024';

  const handleLogin = () => {
    if (password === PORTAL_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const investments = [
    { id: 1, name: 'Trivest', category: 'Private Equity', logo: '🏢', color: 'from-blue-900 to-blue-700', allocation: '$3.5M', return: '+24.8%', status: 'Active', fundName: 'Trivest Fund VI', investmentDate: 'March 2022', sector: 'Middle Market PE', description: 'Private equity firm focused on control investments in middle-market companies.', keyMetrics: { irr: '27.3%', moic: '1.8x', vintage: '2022', commitment: '$5.0M' }, website: 'trivest.com' },
    { id: 2, name: 'Sosin Partners', category: 'Private Equity', logo: '💎', color: 'from-purple-900 to-indigo-700', allocation: '$2.8M', return: '+19.2%', status: 'Active', fundName: 'Sosin Growth Fund', investmentDate: 'July 2022', sector: 'Growth Equity', description: 'Growth-focused private equity firm.', keyMetrics: { irr: '21.5%', moic: '1.6x', vintage: '2022', commitment: '$4.0M' }, website: 'sosinpartners.com' },
    { id: 3, name: 'Ibex Investors', category: 'Venture Capital', logo: '🏔️', color: 'from-slate-900 to-gray-700', allocation: '$3.5M', return: '+34.6%', status: 'Active', fundName: 'Ibex Growth Fund III', investmentDate: 'January 2023', sector: 'Growth Equity', description: 'Growth equity firm investing in high-growth tech companies.', keyMetrics: { irr: '38.2%', moic: '2.1x', vintage: '2023', commitment: '$5.0M' }, website: 'ibexinvestors.com' },
    { id: 4, name: 'Medina Ventures', category: 'Venture Capital', logo: '🌟', color: 'from-amber-900 to-orange-700', allocation: '$2.2M', return: '+42.1%', status: 'Active', fundName: 'Medina Fund II', investmentDate: 'May 2023', sector: 'Early Stage VC', description: 'VC firm backing innovative startups.', keyMetrics: { irr: '45.8%', moic: '2.5x', vintage: '2023', commitment: '$3.5M' }, website: 'medinaventures.com' },
    { id: 5, name: 'Align Ventures', category: 'Venture Capital', logo: '🎯', color: 'from-green-900 to-emerald-700', allocation: '$1.8M', return: '+28.3%', status: 'Active', fundName: 'Align Fund III', investmentDate: 'September 2023', sector: 'Tech VC', description: 'Early-stage technology VC.', keyMetrics: { irr: '31.7%', moic: '1.9x', vintage: '2023', commitment: '$3.0M' }, website: 'alignvc.com' },
    { id: 6, name: 'Vuori', category: 'Direct Investments', logo: '👕', color: 'from-sky-900 to-blue-700', allocation: '$2.5M', return: '+45.8%', status: 'Active', fundName: 'Series D Preferred', investmentDate: 'March 2023', sector: 'Athletic Apparel', description: 'Premium performance apparel brand.', keyMetrics: { irr: '48.2%', moic: '2.3x', vintage: '2023', commitment: '$2.5M' }, website: 'vuoriclothing.com' },
    { id: 7, name: 'Liquid Death', category: 'Direct Investments', logo: '💀', color: 'from-gray-900 to-slate-700', allocation: '$3.2M', return: '+68.4%', status: 'Active', fundName: 'Series C Preferred', investmentDate: 'January 2023', sector: 'Beverage', description: 'Mountain water brand in aluminum cans.', keyMetrics: { irr: '72.1%', moic: '3.4x', vintage: '2023', commitment: '$3.2M' }, website: 'liquiddeath.com' },
    { id: 8, name: 'Garage Beer', category: 'Direct Investments', logo: '🍺', color: 'from-amber-900 to-yellow-700', allocation: '$850K', return: '+38.4%', status: 'Active', fundName: 'Equity Investment', investmentDate: 'October 2022', sector: 'Craft Beverage', description: 'Craft brewery brand.', keyMetrics: { irr: '42.1%', moic: '2.1x', vintage: '2022', commitment: '$850K' }, website: 'garagebeer.co' },
    { id: 9, name: 'Pavise', category: 'Direct Investments', logo: '🛡️', color: 'from-indigo-900 to-purple-700', allocation: '$1.8M', return: '+52.3%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'July 2023', sector: 'Cybersecurity', description: 'Next-gen cybersecurity platform.', keyMetrics: { irr: '56.7%', moic: '2.8x', vintage: '2023', commitment: '$1.8M' }, website: 'pavise.security' },
    { id: 10, name: 'Nimble', category: 'Direct Investments', logo: '⚡', color: 'from-cyan-900 to-blue-700', allocation: '$1.2M', return: '+31.5%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'April 2023', sector: 'Technology', description: 'Innovative tech platform.', keyMetrics: { irr: '34.8%', moic: '1.9x', vintage: '2023', commitment: '$1.2M' }, website: 'nimble.com' },
    { id: 11, name: 'Drywater', category: 'Direct Investments', logo: '💧', color: 'from-blue-900 to-cyan-700', allocation: '$950K', return: '+24.7%', status: 'Active', fundName: 'Series A Preferred', investmentDate: 'June 2023', sector: 'Consumer', description: 'Consumer products company.', keyMetrics: { irr: '27.3%', moic: '1.7x', vintage: '2023', commitment: '$950K' }, website: 'drywater.com' },
    { id: 12, name: 'FOS', category: 'Direct Investments', logo: '🏈', color: 'from-red-900 to-orange-700', allocation: '$1.5M', return: '+41.2%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'February 2023', sector: 'Sports Media', description: 'Front Office Sports media platform.', keyMetrics: { irr: '44.6%', moic: '2.2x', vintage: '2023', commitment: '$1.5M' }, website: 'frontofficesports.com' },
    { id: 13, name: 'stayHVN', category: 'Direct Investments', logo: '🏠', color: 'from-teal-900 to-green-700', allocation: '$1.1M', return: '+36.8%', status: 'Active', fundName: 'Series A Preferred', investmentDate: 'August 2023', sector: 'Hospitality Tech', description: 'Modern hospitality platform.', keyMetrics: { irr: '39.4%', moic: '2.0x', vintage: '2023', commitment: '$1.1M' }, website: 'stayhvn.com' },
    { id: 14, name: 'Losers', category: 'Direct Investments', logo: '🎮', color: 'from-purple-900 to-pink-700', allocation: '$800K', return: '+29.3%', status: 'Active', fundName: 'Equity Investment', investmentDate: 'May 2023', sector: 'Entertainment', description: 'Entertainment lifestyle brand.', keyMetrics: { irr: '32.1%', moic: '1.8x', vintage: '2023', commitment: '$800K' }, website: 'losers.com' },
    { id: 15, name: 'Onward', category: 'Direct Investments', logo: '🚀', color: 'from-indigo-900 to-blue-700', allocation: '$1.3M', return: '+33.7%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'March 2023', sector: 'Technology', description: 'Digital transformation platform.', keyMetrics: { irr: '36.9%', moic: '1.9x', vintage: '2023', commitment: '$1.3M' }, website: 'onward.com' },
    { id: 16, name: 'Bolt', category: 'Direct Investments', logo: '⚡', color: 'from-green-900 to-lime-700', allocation: '$2.1M', return: '+26.4%', status: 'Active', fundName: 'Series D Preferred', investmentDate: 'November 2022', sector: 'Fintech', description: 'One-click checkout tech.', keyMetrics: { irr: '29.2%', moic: '1.7x', vintage: '2022', commitment: '$2.1M' }, website: 'bolt.com' },
    { id: 17, name: 'Boyne', category: 'Direct Investments', logo: '⛷️', color: 'from-blue-900 to-indigo-700', allocation: '$3.8M', return: '+18.9%', status: 'Active', fundName: 'Direct Equity', investmentDate: 'January 2022', sector: 'Hospitality', description: 'Mountain resort operator.', keyMetrics: { irr: '21.4%', moic: '1.6x', vintage: '2022', commitment: '$3.8M' }, website: 'boyne.com' },
    { id: 18, name: 'Kawa', category: 'Direct Investments', logo: '☕', color: 'from-yellow-900 to-amber-700', allocation: '$680K', return: '+22.6%', status: 'Active', fundName: 'Series A Preferred', investmentDate: 'July 2023', sector: 'Consumer', description: 'Premium coffee brand.', keyMetrics: { irr: '25.3%', moic: '1.7x', vintage: '2023', commitment: '$680K' }, website: 'kawa.com' },
    { id: 19, name: 'Basis', category: 'Direct Investments', logo: '📊', color: 'from-slate-900 to-gray-700', allocation: '$1.4M', return: '+28.1%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'April 2023', sector: 'SaaS', description: 'Business intelligence platform.', keyMetrics: { irr: '31.2%', moic: '1.8x', vintage: '2023', commitment: '$1.4M' }, website: 'basis.com' },
    { id: 20, name: 'Socratic', category: 'Direct Investments', logo: '🧠', color: 'from-violet-900 to-purple-700', allocation: '$920K', return: '+35.4%', status: 'Active', fundName: 'Series A Preferred', investmentDate: 'June 2023', sector: 'EdTech', description: 'Educational tech platform.', keyMetrics: { irr: '38.7%', moic: '2.0x', vintage: '2023', commitment: '$920K' }, website: 'socratic.com' },
    { id: 21, name: 'Sonder', category: 'Direct Investments', logo: '🏨', color: 'from-pink-900 to-rose-700', allocation: '$2.7M', return: '+15.8%', status: 'Active', fundName: 'Public Equity', investmentDate: 'October 2022', sector: 'Hospitality', description: 'Tech-enabled hospitality.', keyMetrics: { irr: '18.2%', moic: '1.5x', vintage: '2022', commitment: '$2.7M' }, website: 'sonder.com' },
    { id: 22, name: 'BridgeInvest', category: 'Real Estate', logo: '🌉', color: 'from-gray-900 to-slate-700', allocation: '$4.2M', return: '+16.3%', status: 'Active', fundName: 'BridgeInvest Fund IV', investmentDate: 'March 2022', sector: 'RE Debt', description: 'Real estate lending platform.', keyMetrics: { irr: '18.7%', moic: '1.5x', vintage: '2022', commitment: '$6.0M' }, website: 'bridgeinvest.com' },
    { id: 23, name: 'PineBay RE', category: 'Real Estate', logo: '🌲', color: 'from-green-900 to-emerald-700', allocation: '$3.5M', return: '+19.4%', status: 'Active', fundName: 'PineBay Opportunity Fund', investmentDate: 'June 2022', sector: 'Commercial RE', description: 'Opportunistic RE fund.', keyMetrics: { irr: '21.8%', moic: '1.6x', vintage: '2022', commitment: '$5.0M' }, website: 'pinebay.com' },
    { id: 24, name: 'Cutting Horse', category: 'Real Estate', logo: '🐴', color: 'from-amber-900 to-yellow-700', allocation: '$2.8M', return: '+22.1%', status: 'Active', fundName: 'Cutting Horse Fund II', investmentDate: 'September 2022', sector: 'Multifamily', description: 'Multifamily RE fund.', keyMetrics: { irr: '24.6%', moic: '1.7x', vintage: '2022', commitment: '$4.0M' }, website: 'cuttinghorse.com' },
    { id: 25, name: 'Adler RE', category: 'Real Estate', logo: '🦅', color: 'from-blue-900 to-indigo-700', allocation: '$3.1M', return: '+17.5%', status: 'Active', fundName: 'Adler Fund III', investmentDate: 'May 2022', sector: 'Industrial', description: 'Industrial RE fund.', keyMetrics: { irr: '19.8%', moic: '1.6x', vintage: '2022', commitment: '$4.5M' }, website: 'adlerre.com' },
    { id: 26, name: '13th Floor', category: 'Real Estate', logo: '🏗️', color: 'from-red-900 to-orange-700', allocation: '$2.4M', return: '+20.3%', status: 'Active', fundName: '13th Floor Investments', investmentDate: 'August 2022', sector: 'Mixed-Use', description: 'Mixed-use development.', keyMetrics: { irr: '22.9%', moic: '1.7x', vintage: '2022', commitment: '$3.5M' }, website: '13thfloor.com' },
    { id: 27, name: 'Select Oil', category: 'Real Estate', logo: '⛽', color: 'from-slate-900 to-gray-700', allocation: '$1.9M', return: '+14.2%', status: 'Active', fundName: 'Select Energy Partners', investmentDate: 'December 2022', sector: 'Energy & Land', description: 'Energy-focused RE platform.', keyMetrics: { irr: '16.5%', moic: '1.4x', vintage: '2022', commitment: '$2.5M' }, website: 'selectoil.com' }
  ];

  const categories = ['all', 'Private Equity', 'Venture Capital', 'Direct Investments', 'Real Estate'];

  const filteredInvestments = activeTab === 'all' ? investments : investments.filter(inv => inv.category === activeTab);

  const totalAllocation = investments.reduce((sum, inv) => sum + parseFloat(inv.allocation.replace(/[$MK,]/g, '')), 0);
  const avgReturn = investments.reduce((sum, inv) => sum + parseFloat(inv.return.replace(/[+%]/g, '')), 0) / investments.length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-500/10 p-4 rounded-full">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Investment Portal</h1>
            <p className="text-slate-400 text-center mb-8">Enter password to access portfolio</p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter password" autoFocus />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">Access Portal</button>
            <p className="text-xs text-slate-500 text-center mt-6">Demo password: invest2024</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedInvestment) {
    const inv = selectedInvestment;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-5xl mx-auto p-6">
          <button onClick={() => setSelectedInvestment(null)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />Back to Portfolio
          </button>
          <div className={`bg-gradient-to-br ${inv.color} rounded-2xl p-8 mb-6 text-white`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{inv.logo}</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{inv.name}</h1>
                  <p className="text-xl opacity-90">{inv.fundName}</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">{inv.status}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-sm opacity-75 mb-1">Allocation</p><p className="text-2xl font-bold">{inv.allocation}</p></div>
              <div><p className="text-sm opacity-75 mb-1">Return</p><p className="text-2xl font-bold text-green-300">{inv.return}</p></div>
              <div><p className="text-sm opacity-75 mb-1">IRR</p><p className="text-2xl font-bold">{inv.keyMetrics.irr}</p></div>
              <div><p className="text-sm opacity-75 mb-1">MOIC</p><p className="text-2xl font-bold">{inv.keyMetrics.moic}</p></div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between"><span>Category:</span><span className="font-medium text-white">{inv.category}</span></div>
              <div className="flex justify-between"><span>Sector:</span><span className="font-medium text-white">{inv.sector}</span></div>
              <div className="flex justify-between"><span>Investment Date:</span><span className="font-medium text-white">{inv.investmentDate}</span></div>
              <div className="flex justify-between"><span>Commitment:</span><span className="font-medium text-white">{inv.keyMetrics.commitment}</span></div>
            </div>
            <p className="text-slate-300 mt-4">{inv.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Investment Portfolio</h1>
            <p className="text-slate-400">Private wealth management overview</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">Logout</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Total Allocation</p>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">${totalAllocation.toFixed(1)}M</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Average Return</p>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">+{avgReturn.toFixed(1)}%</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Active Positions</p>
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">{investments.length}</p>
          </div>
        </div>
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}>
              {cat === 'all' ? 'All Investments' : cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments.map((inv) => (
            <button key={inv.id} onClick={() => setSelectedInvestment(inv)} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 text-left">
              <div className={`bg-gradient-to-br ${inv.color} p-6 flex items-center justify-center`}>
                <div className="text-5xl">{inv.logo}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{inv.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{inv.category}</p>
                <div className="flex justify-between mb-3">
                  <div><p className="text-xs text-slate-400 mb-1">Allocation</p><p className="text-lg font-bold text-white">{inv.allocation}</p></div>
                  <div className="text-right"><p className="text-xs text-slate-400 mb-1">Return</p><p className="text-lg font-bold text-green-400">{inv.return}</p></div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <span className="text-xs text-slate-400">{inv.sector}</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-medium">{inv.status}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-8 text-center text-slate-500 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
      </div>
    </div>
  );
}