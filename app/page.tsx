'use client';

import React, { useState } from 'react';
import { Lock, TrendingUp, Building2, DollarSign, BarChart3, Eye, EyeOff, ArrowLeft, ExternalLink } from 'lucide-react';

interface Investment {
  id: number;
  name: string;
  category: string;
  logo: string;
  color: string;
  allocation: string;
  return: string;
  status: string;
  fundName: string;
  investmentDate: string;
  sector: string;
  description: string;
  keyMetrics: {
    irr: string;
    moic: string;
    vintage: string;
    commitment: string;
  };
  website: string;
}

interface Founder {
  id: number;
  name: string;
  title: string;
  image: string;
  bio: string;
  email: string;
}

export default function InvestmentPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
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

  const founders: Founder[] = [
    { id: 1, name: 'Jack Diemar', title: 'Co-Founder & Managing Partner', image: '/logos/jack-diemar.jpeg', bio: 'Jack brings extensive experience in private equity and venture capital.', email: 'jack@portfolio.com' },
    { id: 2, name: 'Kevin Diemar', title: 'Co-Founder & Managing Partner', image: '/logos/kevin-diemar.jpeg', bio: 'Kevin specializes in real estate and growth equity investments.', email: 'kevin@portfolio.com' }
  ];

  const investments: Investment[] = [
    { id: 1, name: 'Trivest', category: 'Private Equity', logo: '/logos/trivest.png', color: 'from-blue-900 to-blue-700', allocation: '$3.5M', return: '+24.8%', status: 'Active', fundName: 'Trivest Fund VI', investmentDate: 'March 2022', sector: 'Middle Market PE', description: 'Private equity firm focused on control investments.', keyMetrics: { irr: '27.3%', moic: '1.8x', vintage: '2022', commitment: '$5.0M' }, website: 'https://trivest.com' },
    { id: 2, name: 'Sosin Partners', category: 'Private Equity', logo: '/logos/sosin.png', color: 'from-purple-900 to-indigo-700', allocation: '$2.8M', return: '+19.2%', status: 'Active', fundName: 'Sosin Growth Fund', investmentDate: 'July 2022', sector: 'Growth Equity', description: 'Growth-focused private equity firm.', keyMetrics: { irr: '21.5%', moic: '1.6x', vintage: '2022', commitment: '$4.0M' }, website: 'https://sosinpartners.com' },
    { id: 3, name: 'Ibex Investors', category: 'Venture Capital', logo: '/logos/ibex.png', color: 'from-slate-900 to-gray-700', allocation: '$3.5M', return: '+34.6%', status: 'Active', fundName: 'Ibex Growth Fund III', investmentDate: 'January 2023', sector: 'Growth Equity', description: 'Growth equity firm.', keyMetrics: { irr: '38.2%', moic: '2.1x', vintage: '2023', commitment: '$5.0M' }, website: 'https://ibexinvestors.com' },
    { id: 4, name: 'Medina Ventures', category: 'Venture Capital', logo: '/logos/medina.png', color: 'from-amber-900 to-orange-700', allocation: '$2.2M', return: '+42.1%', status: 'Active', fundName: 'Medina Fund II', investmentDate: 'May 2023', sector: 'Early Stage VC', description: 'VC firm backing startups.', keyMetrics: { irr: '45.8%', moic: '2.5x', vintage: '2023', commitment: '$3.5M' }, website: 'https://medinaventures.com' },
    { id: 5, name: 'Align Ventures', category: 'Venture Capital', logo: '/logos/align.avif', color: 'from-green-900 to-emerald-700', allocation: '$1.8M', return: '+28.3%', status: 'Active', fundName: 'Align Fund III', investmentDate: 'September 2023', sector: 'Tech VC', description: 'Early-stage technology VC.', keyMetrics: { irr: '31.7%', moic: '1.9x', vintage: '2023', commitment: '$3.0M' }, website: 'https://alignvc.com' },
    { id: 6, name: 'Vuori', category: 'Direct Investments', logo: '/logos/vuori.png', color: 'from-sky-900 to-blue-700', allocation: '$2.5M', return: '+45.8%', status: 'Active', fundName: 'Series D Preferred', investmentDate: 'March 2023', sector: 'Athletic Apparel', description: 'Premium apparel brand.', keyMetrics: { irr: '48.2%', moic: '2.3x', vintage: '2023', commitment: '$2.5M' }, website: 'https://vuoriclothing.com' },
    { id: 7, name: 'Liquid Death', category: 'Direct Investments', logo: '/logos/liquid-death.png', color: 'from-gray-900 to-slate-700', allocation: '$3.2M', return: '+68.4%', status: 'Active', fundName: 'Series C Preferred', investmentDate: 'January 2023', sector: 'Beverage', description: 'Mountain water brand.', keyMetrics: { irr: '72.1%', moic: '3.4x', vintage: '2023', commitment: '$3.2M' }, website: 'https://liquiddeath.com' },
    { id: 8, name: 'Garage Beer', category: 'Direct Investments', logo: '/logos/garage-beer.png', color: 'from-amber-900 to-yellow-700', allocation: '$850K', return: '+38.4%', status: 'Active', fundName: 'Equity Investment', investmentDate: 'October 2022', sector: 'Craft Beverage', description: 'Craft brewery brand.', keyMetrics: { irr: '42.1%', moic: '2.1x', vintage: '2022', commitment: '$850K' }, website: 'https://garagebeer.co' },
    { id: 9, name: 'Pavise', category: 'Direct Investments', logo: '/logos/pavise.png', color: 'from-indigo-900 to-purple-700', allocation: '$1.8M', return: '+52.3%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'July 2023', sector: 'Cybersecurity', description: 'Cybersecurity platform.', keyMetrics: { irr: '56.7%', moic: '2.8x', vintage: '2023', commitment: '$1.8M' }, website: 'https://pavise.security' },
    { id: 10, name: 'Nimble', category: 'Direct Investments', logo: '/logos/nimble.webp', color: 'from-cyan-900 to-blue-700', allocation: '$1.2M', return: '+31.5%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'April 2023', sector: 'Technology', description: 'Tech platform.', keyMetrics: { irr: '34.8%', moic: '1.9x', vintage: '2023', commitment: '$1.2M' }, website: 'https://nimble.com' },
    { id: 11, name: 'Drywater', category: 'Direct Investments', logo: '/logos/drywater.jpeg', color: 'from-blue-900 to-cyan-700', allocation: '$950K', return: '+24.7%', status: 'Active', fundName: 'Series A Preferred', investmentDate: 'June 2023', sector: 'Consumer', description: 'Consumer products company.', keyMetrics: { irr: '27.3%', moic: '1.7x', vintage: '2023', commitment: '$950K' }, website: 'https://drywater.com' },
    { id: 12, name: 'FOS', category: 'Direct Investments', logo: '/logos/FOS.jpg', color: 'from-red-900 to-orange-700', allocation: '$1.5M', return: '+41.2%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'February 2023', sector: 'Sports Media', description: 'Sports media platform.', keyMetrics: { irr: '44.6%', moic: '2.2x', vintage: '2023', commitment: '$1.5M' }, website: 'https://frontofficesports.com' },
    { id: 13, name: 'stayHVN', category: 'Direct Investments', logo: '/logos/stayHVN.png', color: 'from-teal-900 to-green-700', allocation: '$1.1M', return: '+36.8%', status: 'Active', fundName: 'Series A Preferred', investmentDate: 'August 2023', sector: 'Hospitality Tech', description: 'Hospitality platform.', keyMetrics: { irr: '39.4%', moic: '2.0x', vintage: '2023', commitment: '$1.1M' }, website: 'https://stayhvn.com' },
    { id: 14, name: 'Losers', category: 'Direct Investments', logo: '/logos/loser.jpeg', color: 'from-purple-900 to-pink-700', allocation: '$800K', return: '+29.3%', status: 'Active', fundName: 'Equity Investment', investmentDate: 'May 2023', sector: 'Entertainment', description: 'Entertainment brand.', keyMetrics: { irr: '32.1%', moic: '1.8x', vintage: '2023', commitment: '$800K' }, website: 'https://losers.com' },
    { id: 15, name: 'Onward', category: 'Direct Investments', logo: '/logos/onward.png', color: 'from-indigo-900 to-blue-700', allocation: '$1.3M', return: '+33.7%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'March 2023', sector: 'Technology', description: 'Digital transformation platform.', keyMetrics: { irr: '36.9%', moic: '1.9x', vintage: '2023', commitment: '$1.3M' }, website: 'https://onward.com' },
    { id: 16, name: 'Bolt', category: 'Direct Investments', logo: '/logos/bolt.jpg', color: 'from-green-900 to-lime-700', allocation: '$2.1M', return: '+26.4%', status: 'Active', fundName: 'Series D Preferred', investmentDate: 'November 2022', sector: 'Fintech', description: 'Checkout technology.', keyMetrics: { irr: '29.2%', moic: '1.7x', vintage: '2022', commitment: '$2.1M' }, website: 'https://bolt.com' },
    { id: 17, name: 'Boyne', category: 'Direct Investments', logo: '/logos/boyne.png', color: 'from-blue-900 to-indigo-700', allocation: '$3.8M', return: '+18.9%', status: 'Active', fundName: 'Direct Equity', investmentDate: 'January 2022', sector: 'Hospitality', description: 'Resort operator.', keyMetrics: { irr: '21.4%', moic: '1.6x', vintage: '2022', commitment: '$3.8M' }, website: 'https://boyne.com' },
    { id: 18, name: 'Kawa', category: 'Direct Investments', logo: '/logos/kawa.jpeg', color: 'from-yellow-900 to-amber-700', allocation: '$680K', return: '+22.6%', status: 'Active', fundName: 'Series A Preferred', investmentDate: 'July 2023', sector: 'Consumer', description: 'Coffee brand.', keyMetrics: { irr: '25.3%', moic: '1.7x', vintage: '2023', commitment: '$680K' }, website: 'https://kawa.com' },
    { id: 19, name: 'Basis', category: 'Direct Investments', logo: '/logos/basis.jpeg', color: 'from-slate-900 to-gray-700', allocation: '$1.4M', return: '+28.1%', status: 'Active', fundName: 'Series B Preferred', investmentDate: 'April 2023', sector: 'SaaS', description: 'BI platform.', keyMetrics: { irr: '31.2%', moic: '1.8x', vintage: '2023', commitment: '$1.4M' }, website: 'https://basis.com' },
    { id: 20, name: 'Socratic', category: 'Direct Investments', logo: '/logos/socratic .jpeg', color: 'from-violet-900 to-purple-700', allocation: '$920K', return: '+35.4%', status: 'Active', fundName: 'Series A Preferred', investmentDate: 'June 2023', sector: 'EdTech', description: 'Ed tech platform.', keyMetrics: { irr: '38.7%', moic: '2.0x', vintage: '2023', commitment: '$920K' }, website: 'https://socratic.com' },
    { id: 21, name: 'Sonder', category: 'Direct Investments', logo: '/logos/sonder.jpeg', color: 'from-pink-900 to-rose-700', allocation: '$2.7M', return: '+15.8%', status: 'Active', fundName: 'Public Equity', investmentDate: 'October 2022', sector: 'Hospitality', description: 'Hospitality company.', keyMetrics: { irr: '18.2%', moic: '1.5x', vintage: '2022', commitment: '$2.7M' }, website: 'https://sonder.com' },
    { id: 22, name: 'BridgeInvest', category: 'Real Estate', logo: '/logos/bridgeinvest.png', color: 'from-gray-900 to-slate-700', allocation: '$4.2M', return: '+16.3%', status: 'Active', fundName: 'BridgeInvest Fund IV', investmentDate: 'March 2022', sector: 'RE Debt', description: 'RE lending platform.', keyMetrics: { irr: '18.7%', moic: '1.5x', vintage: '2022', commitment: '$6.0M' }, website: 'https://bridgeinvest.com' },
    { id: 23, name: 'PineBay RE', category: 'Real Estate', logo: '/logos/pinebay.jpeg', color: 'from-green-900 to-emerald-700', allocation: '$3.5M', return: '+19.4%', status: 'Active', fundName: 'PineBay Opportunity Fund', investmentDate: 'June 2022', sector: 'Commercial RE', description: 'Opportunistic RE fund.', keyMetrics: { irr: '21.8%', moic: '1.6x', vintage: '2022', commitment: '$5.0M' }, website: 'https://pinebay.com' },
    { id: 24, name: 'Cutting Horse', category: 'Real Estate', logo: '/logos/cutting-horse.jpeg', color: 'from-amber-900 to-yellow-700', allocation: '$2.8M', return: '+22.1%', status: 'Active', fundName: 'Cutting Horse Fund II', investmentDate: 'September 2022', sector: 'Multifamily', description: 'Multifamily RE fund.', keyMetrics: { irr: '24.6%', moic: '1.7x', vintage: '2022', commitment: '$4.0M' }, website: 'https://cuttinghorse.com' },
    { id: 25, name: 'Adler RE', category: 'Real Estate', logo: '/logos/adler.png', color: 'from-blue-900 to-indigo-700', allocation: '$3.1M', return: '+17.5%', status: 'Active', fundName: 'Adler Fund III', investmentDate: 'May 2022', sector: 'Industrial', description: 'Industrial RE fund.', keyMetrics: { irr: '19.8%', moic: '1.6x', vintage: '2022', commitment: '$4.5M' }, website: 'https://adlerre.com' },
    { id: 26, name: '13th Floor', category: 'Real Estate', logo: '/logos/13th floor.jpeg', color: 'from-red-900 to-orange-700', allocation: '$2.4M', return: '+20.3%', status: 'Active', fundName: '13th Floor Investments', investmentDate: 'August 2022', sector: 'Mixed-Use', description: 'Mixed-use development.', keyMetrics: { irr: '22.9%', moic: '1.7x', vintage: '2022', commitment: '$3.5M' }, website: 'https://13thfloor.com' },
    { id: 27, name: 'Select Oil', category: 'Real Estate', logo: '/logos/select-oil.jpg', color: 'from-slate-900 to-gray-700', allocation: '$1.9M', return: '+14.2%', status: 'Active', fundName: 'Select Energy Partners', investmentDate: 'December 2022', sector: 'Energy & Land', description: 'Energy RE platform.', keyMetrics: { irr: '16.5%', moic: '1.4x', vintage: '2022', commitment: '$2.5M' }, website: 'https://selectoil.com' }
  ];

  const categories = ['all', 'Private Equity', 'Venture Capital', 'Direct Investments', 'Real Estate', 'Founders'];
  const filteredInvestments = activeTab === 'all' ? investments : investments.filter(inv => inv.category === activeTab);
  const totalAllocation = investments.reduce((sum, inv) => sum + parseFloat(inv.allocation.replace(/[$MK,]/g, '')), 0);
  const avgReturn = investments.reduce((sum, inv) => sum + parseFloat(inv.return.replace(/[+%]/g, '')), 0) / investments.length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
            <div className="flex justify-center mb-6"><div className="bg-blue-500/10 p-4 rounded-full"><Lock className="w-8 h-8 text-blue-400" /></div></div>
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
          <button onClick={() => setSelectedInvestment(null)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-5 h-5" />Back to Portfolio</button>
          <div className={`bg-gradient-to-br ${inv.color} rounded-2xl p-8 mb-6 text-white`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-lg p-3 flex items-center justify-center">
                  <img src={inv.logo} alt={inv.name} className="w-full h-full object-contain" />
                </div>
                <div><h1 className="text-4xl font-bold mb-2">{inv.name}</h1><p className="text-xl opacity-90">{inv.fundName}</p></div>
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
            <a href={inv.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300 transition-colors"><ExternalLink className="w-4 h-4" />Visit Website</a>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'Founders') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div><h1 className="text-3xl font-bold text-white mb-2">Our Founders</h1><p className="text-slate-400">Meet the team behind the portfolio</p></div>
            <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">Logout</button>
          </div>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (<button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}>{cat === 'all' ? 'All Investments' : cat}</button>))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {founders.map((founder) => (
              <div key={founder.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="h-80 bg-gradient-to-br from-blue-900 to-indigo-900">
                  <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{founder.name}</h3>
                  <p className="text-blue-400 text-sm mb-4">{founder.title}</p>
                  <p className="text-slate-300 leading-relaxed mb-4">{founder.bio}</p>
                  <a href={`mailto:${founder.email}`} className="text-slate-400 hover:text-white transition-colors text-sm">{founder.email}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-3xl font-bold text-white mb-2">Investment Portfolio</h1><p className="text-slate-400">Private wealth management overview</p></div>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">Logout</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2"><p className="text-slate-400 text-sm">Total Allocation</p><DollarSign className="w-5 h-5 text-green-400" /></div>
            <p className="text-3xl font-bold text-white">${totalAllocation.toFixed(1)}M</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2"><p className="text-slate-400 text-sm">Average Return</p><TrendingUp className="w-5 h-5 text-blue-400" /></div>
            <p className="text-3xl font-bold text-white">+{avgReturn.toFixed(1)}%</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2"><p className="text-slate-400 text-sm">Active Positions</p><BarChart3 className="w-5 h-5 text-purple-400" /></div>
            <p className="text-3xl font-bold text-white">{investments.length}</p>
          </div>
        </div>
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (<button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-