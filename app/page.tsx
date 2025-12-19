'use client';
import React, { useState, useEffect } from 'react';
import { Lock, TrendingUp, Building2, DollarSign, BarChart3, Eye, EyeOff, ArrowLeft, ExternalLink, Settings, Save, X, Plus, Edit2, Upload } from 'lucide-react';

interface Investment {
  id: number;
  name: string;
  category: string;
  logo: string;
  color: string;
  
  // Admin-editable fields
  amountCommitted: number;  // Total commitment
  amountCalled: number;     // Capital actually called
  currentValue: number;     // Current market value
  contactEmail: string;     // Contact person
  
  // Calculated fields
  allocation: string;
  return: string;
  status: string;
  
  // Static fields
  fundName: string;
  investmentDate: string;
  sector: string;
  description: string;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  
  const PORTAL_PASSWORD = 'invest2024';
  const ADMIN_PASSWORD = 'gator1323';

  // Load investments from persistent storage or use defaults
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      // Try to load from persistent storage
      const response = await fetch('/api/investments');
      if (response.ok) {
        const data = await response.json();
        setInvestments(data.investments || getDefaultInvestments());
      } else {
        setInvestments(getDefaultInvestments());
      }
    } catch (error) {
      console.log('Loading defaults');
      setInvestments(getDefaultInvestments());
    }
    setIsLoading(false);
  };

  const saveInvestments = async (newInvestments: Investment[]) => {
    setInvestments(newInvestments);
    
    // Save to server so changes persist for everyone
    try {
      await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investments: newInvestments })
      });
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const calculateMetrics = (inv: Investment) => {
    const moic = inv.amountCalled > 0 ? inv.currentValue / inv.amountCalled : 0;
    const returnPct = inv.amountCalled > 0 ? ((inv.currentValue - inv.amountCalled) / inv.amountCalled) * 100 : 0;
    
    return {
      allocation: `$${(inv.currentValue / 1000000).toFixed(1)}M`,
      return: returnPct >= 0 ? `+${returnPct.toFixed(1)}%` : `${returnPct.toFixed(1)}%`,
      moic: `${moic.toFixed(1)}x`,
      status: inv.currentValue > inv.amountCalled ? 'Profitable' : 'Active'
    };
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      setError('');
    } else if (password === PORTAL_PASSWORD) {
      setIsAuthenticated(true);
      setIsAdmin(false);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleLogin();
  };

  const handleUpdateInvestment = (updated: Investment) => {
    const newInvestments = investments.map(inv => 
      inv.id === updated.id ? { ...updated, ...calculateMetrics(updated) } : inv
    );
    saveInvestments(newInvestments);
    setEditingInvestment(null);
  };

  const founders: Founder[] = [
    {
      id: 1,
      name: 'Jack Diemar',
      title: 'Co-Founder & Managing Partner',
      image: '/logos/jack-diemar.jpeg',
      bio: 'Jack brings extensive experience in private equity and venture capital, focusing on technology and growth-stage investments.',
      email: 'jack@portfolio.com'
    },
    {
      id: 2,
      name: 'Kevin Diemar',
      title: 'Co-Founder & Managing Partner',
      image: '/logos/kevin-diemar.jpeg',
      bio: 'Kevin specializes in real estate and growth equity investments with a focus on value creation and operational excellence.',
      email: 'kevin@portfolio.com'
    }
  ];

  function getDefaultInvestments(): Investment[] {
    // Convert allocation string to numbers for calculations
    const parseAllocation = (str: string) => {
      const num = parseFloat(str.replace(/[$MK,]/g, ''));
      return str.includes('K') ? num * 1000 : num * 1000000;
    };
    
    const originals = [
      { id: 1, name: 'Trivest', category: 'Private Equity', logo: '/logos/trivest.png', color: 'from-blue-900 to-blue-700', allocation: '$3.5M', return: '+24.8%', fundName: 'Trivest Fund VI', investmentDate: 'March 2022', sector: 'Middle Market PE', description: 'Private equity firm focused on control investments.', website: 'https://trivest.com', contactEmail: 'contact@trivest.com' },
      { id: 2, name: 'Sosin Partners', category: 'Private Equity', logo: '/logos/sosin.png', color: 'from-purple-900 to-indigo-700', allocation: '$2.8M', return: '+19.2%', fundName: 'Sosin Growth Fund', investmentDate: 'July 2022', sector: 'Growth Equity', description: 'Growth-focused private equity firm.', website: 'https://sosinpartners.com', contactEmail: 'contact@sosinpartners.com' },
      { id: 3, name: 'Ibex Investors', category: 'Venture Capital', logo: '/logos/ibex.png', color: 'from-slate-900 to-gray-700', allocation: '$3.5M', return: '+34.6%', fundName: 'Ibex Growth Fund III', investmentDate: 'January 2023', sector: 'Growth Equity', description: 'Growth equity firm.', website: 'https://ibexinvestors.com', contactEmail: 'contact@ibexinvestors.com' },
      { id: 4, name: 'Medina Ventures', category: 'Venture Capital', logo: '/logos/medina.png', color: 'from-amber-900 to-orange-700', allocation: '$2.2M', return: '+42.1%', fundName: 'Medina Fund II', investmentDate: 'May 2023', sector: 'Early Stage VC', description: 'VC firm backing startups.', website: 'https://medinaventures.com', contactEmail: 'contact@medinaventures.com' },
      { id: 5, name: 'Align Ventures', category: 'Venture Capital', logo: '/logos/align.avif', color: 'from-green-900 to-emerald-700', allocation: '$1.8M', return: '+28.3%', fundName: 'Align Fund III', investmentDate: 'September 2023', sector: 'Tech VC', description: 'Early-stage technology VC.', website: 'https://alignvc.com', contactEmail: 'contact@alignvc.com' },
      { id: 6, name: 'Vuori', category: 'Direct Investments', logo: '/logos/vuori.png', color: 'from-sky-900 to-blue-700', allocation: '$2.5M', return: '+45.8%', fundName: 'Series D Preferred', investmentDate: 'March 2023', sector: 'Athletic Apparel', description: 'Premium apparel brand.', website: 'https://vuoriclothing.com', contactEmail: 'contact@vuoriclothing.com' },
      { id: 7, name: 'Liquid Death', category: 'Direct Investments', logo: '/logos/liquid-death.png', color: 'from-gray-900 to-slate-700', allocation: '$3.2M', return: '+68.4%', fundName: 'Series C Preferred', investmentDate: 'January 2023', sector: 'Beverage', description: 'Mountain water brand.', website: 'https://liquiddeath.com', contactEmail: 'contact@liquiddeath.com' },
      { id: 8, name: 'Garage Beer', category: 'Direct Investments', logo: '/logos/garage-beer.png', color: 'from-amber-900 to-yellow-700', allocation: '$850K', return: '+38.4%', fundName: 'Equity Investment', investmentDate: 'October 2022', sector: 'Craft Beverage', description: 'Craft brewery brand.', website: 'https://garagebeer.co', contactEmail: 'contact@garagebeer.co' },
      { id: 9, name: 'Pavise', category: 'Direct Investments', logo: '/logos/pavise.png', color: 'from-indigo-900 to-purple-700', allocation: '$1.8M', return: '+52.3%', fundName: 'Series B Preferred', investmentDate: 'July 2023', sector: 'Cybersecurity', description: 'Cybersecurity platform.', website: 'https://pavise.security', contactEmail: 'contact@pavise.security' },
      { id: 10, name: 'Nimble', category: 'Direct Investments', logo: '/logos/nimble.webp', color: 'from-cyan-900 to-blue-700', allocation: '$1.2M', return: '+31.5%', fundName: 'Series B Preferred', investmentDate: 'April 2023', sector: 'Technology', description: 'Tech platform.', website: 'https://nimble.com', contactEmail: 'contact@nimble.com' },
      { id: 11, name: 'Drywater', category: 'Direct Investments', logo: '/logos/drywater.jpeg', color: 'from-blue-900 to-cyan-700', allocation: '$950K', return: '+24.7%', fundName: 'Series A Preferred', investmentDate: 'June 2023', sector: 'Consumer', description: 'Consumer products.', website: 'https://drywater.com', contactEmail: 'contact@drywater.com' },
      { id: 12, name: 'FOS', category: 'Direct Investments', logo: '/logos/FOS.jpg', color: 'from-red-900 to-orange-700', allocation: '$1.5M', return: '+41.2%', fundName: 'Series B Preferred', investmentDate: 'February 2023', sector: 'Sports Media', description: 'Sports media platform.', website: 'https://frontofficesports.com', contactEmail: 'contact@frontofficesports.com' },
      { id: 13, name: 'stayHVN', category: 'Direct Investments', logo: '/logos/stayHVN.png', color: 'from-teal-900 to-green-700', allocation: '$1.1M', return: '+36.8%', fundName: 'Series A Preferred', investmentDate: 'August 2023', sector: 'Hospitality Tech', description: 'Hospitality platform.', website: 'https://stayhvn.com', contactEmail: 'contact@stayhvn.com' },
      { id: 14, name: 'Losers', category: 'Direct Investments', logo: '/logos/loser.jpeg', color: 'from-purple-900 to-pink-700', allocation: '$800K', return: '+29.3%', fundName: 'Equity Investment', investmentDate: 'May 2023', sector: 'Entertainment', description: 'Entertainment brand.', website: 'https://losers.com', contactEmail: 'contact@losers.com' },
      { id: 15, name: 'Onward', category: 'Direct Investments', logo: '/logos/onward.png', color: 'from-indigo-900 to-blue-700', allocation: '$1.3M', return: '+33.7%', fundName: 'Series B Preferred', investmentDate: 'March 2023', sector: 'Technology', description: 'Digital platform.', website: 'https://onward.com', contactEmail: 'contact@onward.com' },
      { id: 16, name: 'Bolt', category: 'Direct Investments', logo: '/logos/bolt.jpg', color: 'from-green-900 to-lime-700', allocation: '$2.1M', return: '+26.4%', fundName: 'Series D Preferred', investmentDate: 'November 2022', sector: 'Fintech', description: 'Checkout technology.', website: 'https://bolt.com', contactEmail: 'contact@bolt.com' },
      { id: 17, name: 'Boyne', category: 'Direct Investments', logo: '/logos/boyne.png', color: 'from-blue-900 to-indigo-700', allocation: '$3.8M', return: '+18.9%', fundName: 'Direct Equity', investmentDate: 'January 2022', sector: 'Hospitality', description: 'Resort operator.', website: 'https://boyne.com', contactEmail: 'contact@boyne.com' },
      { id: 18, name: 'Kawa', category: 'Direct Investments', logo: '/logos/kawa.jpeg', color: 'from-yellow-900 to-amber-700', allocation: '$680K', return: '+22.6%', fundName: 'Series A Preferred', investmentDate: 'July 2023', sector: 'Consumer', description: 'Coffee brand.', website: 'https://kawa.com', contactEmail: 'contact@kawa.com' },
      { id: 19, name: 'Basis', category: 'Direct Investments', logo: '/logos/basis.jpeg', color: 'from-slate-900 to-gray-700', allocation: '$1.4M', return: '+28.1%', fundName: 'Series B Preferred', investmentDate: 'April 2023', sector: 'SaaS', description: 'BI platform.', website: 'https://basis.com', contactEmail: 'contact@basis.com' },
      { id: 20, name: 'Socratic', category: 'Direct Investments', logo: '/logos/socratic .jpeg', color: 'from-violet-900 to-purple-700', allocation: '$920K', return: '+35.4%', fundName: 'Series A Preferred', investmentDate: 'June 2023', sector: 'EdTech', description: 'Ed tech platform.', website: 'https://socratic.com', contactEmail: 'contact@socratic.com' },
      { id: 21, name: 'Sonder', category: 'Direct Investments', logo: '/logos/sonder.jpeg', color: 'from-pink-900 to-rose-700', allocation: '$2.7M', return: '+15.8%', fundName: 'Public Equity', investmentDate: 'October 2022', sector: 'Hospitality', description: 'Hospitality company.', website: 'https://sonder.com', contactEmail: 'contact@sonder.com' },
      { id: 22, name: 'BridgeInvest', category: 'Real Estate', logo: '/logos/bridgeinvest.png', color: 'from-gray-900 to-slate-700', allocation: '$4.2M', return: '+16.3%', fundName: 'BridgeInvest Fund IV', investmentDate: 'March 2022', sector: 'RE Debt', description: 'RE lending platform.', website: 'https://bridgeinvest.com', contactEmail: 'contact@bridgeinvest.com' },
      { id: 23, name: 'PineBay RE', category: 'Real Estate', logo: '/logos/pinebay.jpeg', color: 'from-green-900 to-emerald-700', allocation: '$3.5M', return: '+19.4%', fundName: 'PineBay Opportunity Fund', investmentDate: 'June 2022', sector: 'Commercial RE', description: 'Opportunistic RE fund.', website: 'https://pinebay.com', contactEmail: 'contact@pinebay.com' },
      { id: 24, name: 'Cutting Horse', category: 'Real Estate', logo: '/logos/cutting-horse.jpeg', color: 'from-amber-900 to-yellow-700', allocation: '$2.8M', return: '+22.1%', fundName: 'Cutting Horse Fund II', investmentDate: 'September 2022', sector: 'Multifamily', description: 'Multifamily RE fund.', website: 'https://cuttinghorse.com', contactEmail: 'contact@cuttinghorse.com' },
      { id: 25, name: 'Adler RE', category: 'Real Estate', logo: '/logos/adler.png', color: 'from-blue-900 to-indigo-700', allocation: '$3.1M', return: '+17.5%', fundName: 'Adler Fund III', investmentDate: 'May 2022', sector: 'Industrial', description: 'Industrial RE fund.', website: 'https://adlerre.com', contactEmail: 'contact@adlerre.com' },
      { id: 26, name: '13th Floor', category: 'Real Estate', logo: '/logos/13th floor.jpeg', color: 'from-red-900 to-orange-700', allocation: '$2.4M', return: '+20.3%', fundName: '13th Floor Investments', investmentDate: 'August 2022', sector: 'Mixed-Use', description: 'Mixed-use development.', website: 'https://13thfloor.com', contactEmail: 'contact@13thfloor.com' },
      { id: 27, name: 'Select Oil', category: 'Real Estate', logo: '/logos/select-oil.jpg', color: 'from-slate-900 to-gray-700', allocation: '$1.9M', return: '+14.2%', fundName: 'Select Energy Partners', investmentDate: 'December 2022', sector: 'Energy & Land', description: 'Energy RE platform.', website: 'https://selectoil.com', contactEmail: 'contact@selectoil.com' }
    ];
    
    // Convert to new format with calculated fields
    return originals.map(inv => {
      const currentVal = parseAllocation(inv.allocation);
      const returnPct = parseFloat(inv.return.replace(/[+%]/g, ''));
      const calledAmount = currentVal / (1 + returnPct / 100);
      
      return {
        ...inv,
        amountCommitted: calledAmount * 1.4, // Assume 40% uncalled
        amountCalled: calledAmount,
        currentValue: currentVal,
        status: 'Active'
      };
    });
  }

  const categories = ['all', 'Private Equity', 'Venture Capital', 'Direct Investments', 'Real Estate', 'Founders'];
  const filteredInvestments = activeTab === 'all' ? investments : investments.filter(inv => inv.category === activeTab);
  
  const totalAllocation = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalCalled = investments.reduce((sum, inv) => sum + inv.amountCalled, 0);
  const avgReturn = totalCalled > 0 ? ((totalAllocation - totalCalled) / totalCalled) * 100 : 0;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-2xl shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Investment Portal
            </h1>
            <p className="text-slate-400 text-center mb-8">Secure access to portfolio dashboard</p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  autoFocus
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
            >
              Access Portal
            </button>
            
            <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-500 text-center">
                Demo Access: <span className="text-slate-400 font-mono">invest2024</span>
              </p>
              {isAdmin && (
                <p className="text-xs text-slate-500 text-center mt-1">
                  Admin Access: <span className="text-slate-400 font-mono">admin2024</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Edit Modal
  const AdminEditModal = ({ investment, onClose, onSave }: { investment: Investment, onClose: () => void, onSave: (inv: Investment) => void }) => {
    const [editData, setEditData] = useState({
      ...investment,
      amountCommitted: undefined as number | undefined,
      amountCalled: undefined as number | undefined,
      currentValue: undefined as number | undefined,
      contactEmail: investment.contactEmail || ''
    });

    const handleAllCommitted = () => {
      if (editData.amountCommitted) {
        setEditData({...editData, amountCalled: editData.amountCommitted});
      }
    };

    const handleSave = () => {
      const finalData = {
        ...investment,
        amountCommitted: editData.amountCommitted || investment.amountCommitted,
        amountCalled: editData.amountCalled || investment.amountCalled,
        currentValue: editData.currentValue || investment.currentValue,
        contactEmail: editData.contactEmail
      };
      onSave(finalData);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
            <h3 className="text-2xl font-bold text-white">Edit Investment</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount Committed ($)</label>
                <input
                  type="number"
                  value={editData.amountCommitted ?? ''}
                  onChange={(e) => setEditData({...editData, amountCommitted: e.target.value ? parseFloat(e.target.value) : undefined})}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount Called ($)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editData.amountCalled ?? ''}
                    onChange={(e) => setEditData({...editData, amountCalled: e.target.value ? parseFloat(e.target.value) : undefined})}
                    placeholder="Enter amount"
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAllCommitted}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                    title="Set Amount Called = Amount Committed"
                  >
                    All Called
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Value ($)</label>
                <input
                  type="number"
                  value={editData.currentValue ?? ''}
                  onChange={(e) => setEditData({...editData, currentValue: e.target.value ? parseFloat(e.target.value) : undefined})}
                  placeholder="Enter value"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={editData.contactEmail}
                  onChange={(e) => setEditData({...editData, contactEmail: e.target.value})}
                  placeholder="contact@example.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Calculated Metrics (Preview)</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-400 mb-1">MOIC</p>
                  <p className="text-lg font-bold text-white">
                    {editData.amountCalled && editData.currentValue 
                      ? (editData.currentValue / editData.amountCalled).toFixed(2) + 'x'
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Return</p>
                  <p className="text-lg font-bold text-green-400">
                    {editData.amountCalled && editData.currentValue
                      ? (((editData.currentValue - editData.amountCalled) / editData.amountCalled) * 100).toFixed(1) + '%'
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Unrealized Gain</p>
                  <p className="text-lg font-bold text-white">
                    {editData.amountCalled && editData.currentValue
                      ? '$' + ((editData.currentValue - editData.amountCalled) / 1000000).toFixed(2) + 'M'
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-700 flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Investment Detail View
  if (selectedInvestment) {
    const inv = selectedInvestment;
    const metrics = calculateMetrics(inv);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedInvestment(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </button>
            
            {isAdmin && (
              <button
                onClick={() => setEditingInvestment(inv)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Investment
              </button>
            )}
          </div>
          
          <div className={`bg-gradient-to-br ${inv.color} rounded-3xl p-8 mb-6 text-white shadow-2xl`}>
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-2xl p-4 flex items-center justify-center shadow-lg">
                  <img
                    src={inv.logo}
                    alt={inv.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(inv.name)}&size=200&background=random`;
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-3">{inv.name}</h1>
                  <p className="text-xl opacity-90">{inv.fundName}</p>
                  <p className="text-sm opacity-75 mt-2">{inv.sector}</p>
                </div>
              </div>
              <span className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {metrics.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm opacity-75 mb-2">Current Value</p>
                <p className="text-3xl font-bold">${(inv.currentValue / 1000000).toFixed(2)}M</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm opacity-75 mb-2">Return</p>
                <p className="text-3xl font-bold text-green-300">{metrics.return}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm opacity-75 mb-2">MOIC</p>
                <p className="text-3xl font-bold">{metrics.moic}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm opacity-75 mb-2">Called Capital</p>
                <p className="text-3xl font-bold">${(inv.amountCalled / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-4">Investment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Category</span>
                  <span className="font-medium text-white">{inv.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Investment Date</span>
                  <span className="font-medium text-white">{inv.investmentDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Commitment</span>
                  <span className="font-medium text-white">${(inv.amountCommitted / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Contact</span>
                  <a href={`mailto:${inv.contactEmail}`} className="font-medium text-blue-400 hover:text-blue-300">
                    {inv.contactEmail}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-4">About</h3>
              <p className="text-slate-300 leading-relaxed mb-6">{inv.description}</p>
              <a
                href={inv.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
            </div>
          </div>
        </div>
        
        {editingInvestment && (
          <AdminEditModal
            investment={editingInvestment}
            onClose={() => setEditingInvestment(null)}
            onSave={handleUpdateInvestment}
          />
        )}
      </div>
    );
  }

  // Founders View
  if (activeTab === 'Founders') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Our Founders</h1>
              <p className="text-slate-400">Meet the team behind the portfolio</p>
            </div>
            <div className="flex gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </button>
              )}
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all font-medium ${
                  activeTab === cat
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Investments' : cat}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {founders.map((founder) => (
              <div key={founder.id} className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden group hover:border-blue-500/50 transition-all">
                <div className="h-96 bg-gradient-to-br from-blue-900 to-indigo-900 overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(founder.name)}&size=800&background=random&bold=true`;
                    }}
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{founder.name}</h3>
                  <p className="text-blue-400 text-sm mb-4 font-medium">{founder.title}</p>
                  <p className="text-slate-300 leading-relaxed mb-6">{founder.bio}</p>
                  <a
                    href={`mailto:${founder.email}`}
                    className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    {founder.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Portfolio View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_70%)]"></div>
      
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Investment Portfolio</h1>
            <p className="text-slate-400">Private wealth management dashboard</p>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            )}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm font-medium">Total Portfolio Value</p>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">${(totalAllocation / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-slate-500 mt-2">Across {investments.length} investments</p>
          </div>
          
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm font-medium">Average Return</p>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">+{avgReturn.toFixed(1)}%</p>
            <p className="text-sm text-slate-500 mt-2">Portfolio weighted average</p>
          </div>
          
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm font-medium">Capital Called</p>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">${(totalCalled / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-slate-500 mt-2">Total deployed capital</p>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all font-medium ${
                activeTab === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Investments' : cat}
            </button>
          ))}
        </div>
        
        {/* Investment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments.map((inv) => {
            const metrics = calculateMetrics(inv);
            return (
              <button
                key={inv.id}
                onClick={() => setSelectedInvestment(inv)}
                className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/20 text-left group"
              >
                <div className={`bg-gradient-to-br ${inv.color} p-8 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                  <div className="w-28 h-28 bg-white rounded-2xl p-5 flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                    <img
                      src={inv.logo}
                      alt={inv.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(inv.name)}&size=200&background=random`;
                      }}
                    />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {inv.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{inv.category}</p>
                  
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Current Value</p>
                      <p className="text-lg font-bold text-white">${(inv.currentValue / 1000000).toFixed(2)}M</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Return</p>
                      <p className="text-lg font-bold text-green-400">{metrics.return}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-xs text-slate-400">{inv.sector}</span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
                      {metrics.status}
                    </span>
                  </div>
                  
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingInvestment(inv);
                      }}
                      className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Quick Edit
                    </button>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      
      {editingInvestment && (
        <AdminEditModal
          investment={editingInvestment}
          onClose={() => setEditingInvestment(null)}
          onSave={handleUpdateInvestment}
        />
      )}
    </div>
  );
}
