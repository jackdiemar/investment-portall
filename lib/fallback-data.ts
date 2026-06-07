import type { Investment } from "./supabase";

function parseAllocation(value: string) {
  const amount = Number.parseFloat(value.replace(/[$MK,]/g, ""));
  return value.includes("K") ? amount * 1_000 : amount * 1_000_000;
}

const rows = [
  { id: 1, name: "Trivest", category: "Private Equity", logo: "/logos/trivest.png", fundName: "Trivest Fund VI", investmentDate: "2022-03-01", sector: "Middle Market PE", description: "Private equity firm focused on control investments.", website: "https://trivest.com", contactEmail: "contact@trivest.com", allocation: "$3.5M", return: "+24.8%" },
  { id: 2, name: "Sosin Partners", category: "Private Equity", logo: "/logos/sosin.jpg", fundName: "Sosin Growth Fund", investmentDate: "2022-07-01", sector: "Growth Equity", description: "Growth-focused private equity firm.", website: "https://sosinpartners.com", contactEmail: "contact@sosinpartners.com", allocation: "$2.8M", return: "+19.2%" },
  { id: 3, name: "Ibex Investors", category: "Venture Capital", logo: "/logos/ibex.png", fundName: "Ibex Growth Fund III", investmentDate: "2023-01-01", sector: "Growth Equity", description: "Growth equity firm.", website: "https://ibexinvestors.com", contactEmail: "contact@ibexinvestors.com", allocation: "$3.5M", return: "+34.6%" },
  { id: 4, name: "Medina Ventures", category: "Venture Capital", logo: "/logos/medina.png", fundName: "Medina Fund II", investmentDate: "2023-05-01", sector: "Early Stage VC", description: "Venture capital firm backing early-stage companies.", website: "https://medinaventures.com", contactEmail: "contact@medinaventures.com", allocation: "$2.2M", return: "+42.1%" },
  { id: 5, name: "Align Ventures", category: "Venture Capital", logo: "/logos/align.avif", fundName: "Align Fund III", investmentDate: "2023-09-01", sector: "Tech VC", description: "Early-stage technology venture capital firm.", website: "https://alignvc.com", contactEmail: "contact@alignvc.com", allocation: "$1.8M", return: "+28.3%" },
  { id: 6, name: "Vuori", category: "Direct Investments", logo: "/logos/vuori.png", fundName: "Series D Preferred", investmentDate: "2023-03-01", sector: "Athletic Apparel", description: "Premium performance apparel brand.", website: "https://vuoriclothing.com", contactEmail: "contact@vuoriclothing.com", allocation: "$2.5M", return: "+45.8%" },
  { id: 7, name: "Liquid Death", category: "Direct Investments", logo: "/logos/liquid-death.png", fundName: "Series C Preferred", investmentDate: "2023-01-01", sector: "Beverage", description: "Packaged water and beverage brand.", website: "https://liquiddeath.com", contactEmail: "contact@liquiddeath.com", allocation: "$3.2M", return: "+68.4%" },
  { id: 8, name: "Garage Beer", category: "Direct Investments", logo: "/logos/garage-beer.png", fundName: "Equity Investment", investmentDate: "2022-10-01", sector: "Craft Beverage", description: "Beer brand with national retail distribution.", website: "https://garagebeer.co", contactEmail: "contact@garagebeer.co", allocation: "$850K", return: "+38.4%" },
  { id: 9, name: "Pavise", category: "Direct Investments", logo: "/logos/pavise.png", fundName: "Series B Preferred", investmentDate: "2023-07-01", sector: "Cybersecurity", description: "Cybersecurity platform company.", website: "https://pavise.security", contactEmail: "contact@pavise.security", allocation: "$1.8M", return: "+52.3%" },
  { id: 10, name: "Nimble", category: "Direct Investments", logo: "/logos/nimble.webp", fundName: "Series B Preferred", investmentDate: "2023-04-01", sector: "Technology", description: "Technology platform company.", website: "https://nimble.com", contactEmail: "contact@nimble.com", allocation: "$1.2M", return: "+31.5%" },
  { id: 11, name: "Drywater", category: "Direct Investments", logo: "/logos/drywater.jpeg", fundName: "Series A Preferred", investmentDate: "2023-06-01", sector: "Consumer", description: "Consumer products company.", website: "https://drywater.com", contactEmail: "contact@drywater.com", allocation: "$950K", return: "+24.7%" },
  { id: 12, name: "FOS", category: "Direct Investments", logo: "/logos/FOS.jpg", fundName: "Series B Preferred", investmentDate: "2023-02-01", sector: "Sports Media", description: "Sports media platform.", website: "https://frontofficesports.com", contactEmail: "contact@frontofficesports.com", allocation: "$1.5M", return: "+41.2%" },
  { id: 13, name: "stayHVN", category: "Direct Investments", logo: "/logos/stayHVN.png", fundName: "Series A Preferred", investmentDate: "2023-08-01", sector: "Hospitality Tech", description: "Hospitality platform company.", website: "https://stayhvn.com", contactEmail: "contact@stayhvn.com", allocation: "$1.1M", return: "+36.8%" },
  { id: 14, name: "Losers", category: "Direct Investments", logo: "/logos/loser.jpeg", fundName: "Equity Investment", investmentDate: "2023-05-01", sector: "Entertainment", description: "Entertainment brand.", website: "https://losers.com", contactEmail: "contact@losers.com", allocation: "$800K", return: "+29.3%" },
  { id: 15, name: "Onward", category: "Direct Investments", logo: "/logos/onward.png", fundName: "Series B Preferred", investmentDate: "2023-03-01", sector: "Technology", description: "Digital platform company.", website: "https://onward.com", contactEmail: "contact@onward.com", allocation: "$1.3M", return: "+33.7%" },
  { id: 16, name: "Bolt", category: "Direct Investments", logo: "/logos/bolt.jpg", fundName: "Series D Preferred", investmentDate: "2022-11-01", sector: "Fintech", description: "Checkout technology platform.", website: "https://bolt.com", contactEmail: "contact@bolt.com", allocation: "$2.1M", return: "+26.4%" },
  { id: 17, name: "Boyne", category: "Direct Investments", logo: "/logos/boyne.png", fundName: "Direct Equity", investmentDate: "2022-01-01", sector: "Hospitality", description: "Resort operator.", website: "https://boyne.com", contactEmail: "contact@boyne.com", allocation: "$3.8M", return: "+18.9%" },
  { id: 18, name: "Kawa", category: "Direct Investments", logo: "/logos/kawa.jpeg", fundName: "Series A Preferred", investmentDate: "2023-07-01", sector: "Consumer", description: "Coffee brand.", website: "https://kawa.com", contactEmail: "contact@kawa.com", allocation: "$680K", return: "+22.6%" },
  { id: 19, name: "Basis", category: "Direct Investments", logo: "/logos/basis.jpeg", fundName: "Series B Preferred", investmentDate: "2023-04-01", sector: "SaaS", description: "Business intelligence platform.", website: "https://basis.com", contactEmail: "contact@basis.com", allocation: "$1.4M", return: "+28.1%" },
  { id: 20, name: "Socratic", category: "Direct Investments", logo: "/logos/socratic .jpeg", fundName: "Series A Preferred", investmentDate: "2023-06-01", sector: "EdTech", description: "Education technology platform.", website: "https://socratic.com", contactEmail: "contact@socratic.com", allocation: "$920K", return: "+35.4%" },
  { id: 21, name: "Sonder", category: "Direct Investments", logo: "/logos/sonder.jpeg", fundName: "Public Equity", investmentDate: "2022-10-01", sector: "Hospitality", description: "Hospitality company.", website: "https://sonder.com", contactEmail: "contact@sonder.com", allocation: "$2.7M", return: "+15.8%" },
  { id: 22, name: "BridgeInvest", category: "Real Estate", logo: "/logos/bridgeinvest.png", fundName: "BridgeInvest Fund IV", investmentDate: "2022-03-01", sector: "RE Debt", description: "Real estate lending platform.", website: "https://bridgeinvest.com", contactEmail: "contact@bridgeinvest.com", allocation: "$4.2M", return: "+16.3%" },
  { id: 23, name: "PineBay RE", category: "Real Estate", logo: "/logos/pinebay.jpeg", fundName: "PineBay Opportunity Fund", investmentDate: "2022-06-01", sector: "Commercial RE", description: "Opportunistic real estate fund.", website: "https://pinebay.com", contactEmail: "contact@pinebay.com", allocation: "$3.5M", return: "+19.4%" },
  { id: 24, name: "Cutting Horse", category: "Real Estate", logo: "/logos/cutting-horse.jpeg", fundName: "Cutting Horse Fund II", investmentDate: "2022-09-01", sector: "Multifamily", description: "Multifamily real estate fund.", website: "https://cuttinghorse.com", contactEmail: "contact@cuttinghorse.com", allocation: "$2.8M", return: "+22.1%" },
  { id: 25, name: "Adler RE", category: "Real Estate", logo: "/logos/adler.png", fundName: "Adler Fund III", investmentDate: "2022-05-01", sector: "Industrial", description: "Industrial real estate fund.", website: "https://adlerre.com", contactEmail: "contact@adlerre.com", allocation: "$3.1M", return: "+17.5%" },
  { id: 26, name: "13th Floor", category: "Real Estate", logo: "/logos/13th floor.jpeg", fundName: "13th Floor Investments", investmentDate: "2022-08-01", sector: "Mixed-Use", description: "Mixed-use real estate development platform.", website: "https://13thfloor.com", contactEmail: "contact@13thfloor.com", allocation: "$2.4M", return: "+20.3%" },
  { id: 27, name: "Select Oil", category: "Real Estate", logo: "/logos/select-oil.jpg", fundName: "Select Energy Partners", investmentDate: "2022-12-01", sector: "Energy & Land", description: "Energy and land real estate platform.", website: "https://selectoil.com", contactEmail: "contact@selectoil.com", allocation: "$1.9M", return: "+14.2%" },
];

export const fallbackInvestments: Investment[] = rows.map((row) => {
  const currentValue = parseAllocation(row.allocation);
  const returnPct = Number.parseFloat(row.return.replace(/[+%]/g, ""));
  const amountCalled = currentValue / (1 + returnPct / 100);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    logo: row.logo,
    fundName: row.fundName,
    sector: row.sector,
    description: row.description,
    website: row.website,
    contactEmail: row.contactEmail,
    investmentDate: row.investmentDate,
    amountCommitted: amountCalled * 1.4,
    amountCalled,
    currentValue,
    createdAt: null,
    updatedAt: null,
  };
});
