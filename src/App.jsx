import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Moon, Sun, Users, BookOpen, Heart, DollarSign, Zap, Leaf, MapPin, TrendingUp, TrendingDown, Minus, Activity, BarChart2, Clock, X, Plus, Globe } from 'lucide-react';

function cyrb128(str){let h1=1779033703,h2=3144134277,h3=1013904242,h4=2773480762;for(let i=0,k;i<str.length;i++){k=str.charCodeAt(i);h1=h2^Math.imul(h1^k,597399067);h2=h3^Math.imul(h2^k,2869860233);h3=h4^Math.imul(h3^k,951274213);h4=h1^Math.imul(h4^k,2716044179);}h1=Math.imul(h3^(h1>>>18),597399067);h2=Math.imul(h4^(h2>>>22),2869860233);h3=Math.imul(h1^(h3>>>17),951274213);h4=Math.imul(h2^(h4>>>19),2716044179);return[(h1^h2^h3^h4)>>>0,(h2^h1)>>>0,(h3^h1)>>>0,(h4^h1)>>>0];}
function sfc32(a,b,c,d){return function(){a>>>=0;b>>>=0;c>>>=0;d>>>=0;var t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=c<<21|c>>>11;c=c+t|0;return(t>>>0)/4294967296;}}
function getSeededRandom(seedStr){const seed=cyrb128(seedStr);return sfc32(seed[0],seed[1],seed[2],seed[3]);}

// --- 36 States & UTs Baseline Data ---
const STATES_INFO = [
    { name: "Andaman & Nicobar", type: "UT_Coast", base: { pop: 0.4, gdp: 3000, lit: 86, for: 81, urb: 37, rel: { h: 69, m: 8, c: 21, s: 0.5, o: 1.5 } } },
    { name: "Andhra Pradesh", type: "State_Coast", base: { pop: 53.0, gdp: 3500, lit: 67, for: 18, urb: 33, rel: { h: 90, m: 8, c: 1.5, s: 0, o: 0.5 } } },
    { name: "Arunachal Pradesh", type: "State_NE", base: { pop: 1.5, gdp: 2800, lit: 66, for: 80, urb: 23, rel: { h: 29, m: 2, c: 30, s: 0, o: 39 } } },
    { name: "Assam", type: "State_NE", base: { pop: 35.0, gdp: 2500, lit: 72, for: 36, urb: 14, rel: { h: 61, m: 34, c: 3.7, s: 0.1, o: 1.2 } } },
    { name: "Bihar", type: "State_Plains", base: { pop: 130.0, gdp: 1500, lit: 61, for: 7, urb: 11, rel: { h: 82, m: 17, c: 0.1, s: 0, o: 0.9 } } },
    { name: "Chandigarh", type: "UT_Metro", base: { pop: 1.2, gdp: 5500, lit: 86, for: 19, urb: 97, rel: { h: 80, m: 4.8, c: 0.8, s: 13, o: 1.4 } } },
    { name: "Chhattisgarh", type: "State_Central", base: { pop: 30.0, gdp: 2200, lit: 70, for: 41, urb: 23, rel: { h: 93, m: 2, c: 1.9, s: 0.3, o: 2.8 } } },
    { name: "Dadra & Nagar Haveli and Daman & Diu", type: "UT_Coast", base: { pop: 0.6, gdp: 4000, lit: 76, for: 20, urb: 46, rel: { h: 94, m: 4, c: 1.5, s: 0.1, o: 0.4 } } },
    { name: "Delhi", type: "UT_Metro", base: { pop: 21.0, gdp: 6000, lit: 86, for: 13, urb: 97, rel: { h: 81, m: 12.8, c: 0.8, s: 3.4, o: 2.0 } } },
    { name: "Goa", type: "State_Coast", base: { pop: 1.5, gdp: 6500, lit: 88, for: 33, urb: 62, rel: { h: 66, m: 8.3, c: 25, s: 0.1, o: 0.6 } } },
    { name: "Gujarat", type: "State_Coast", base: { pop: 71.0, gdp: 4200, lit: 78, for: 7, urb: 43, rel: { h: 88, m: 9.6, c: 0.5, s: 0.1, o: 1.8 } } },
    { name: "Haryana", type: "State_North", base: { pop: 29.0, gdp: 4800, lit: 75, for: 3, urb: 34, rel: { h: 87, m: 7, c: 0.2, s: 4.9, o: 0.9 } } },
    { name: "Himachal Pradesh", type: "State_Hill", base: { pop: 7.5, gdp: 3800, lit: 82, for: 27, urb: 10, rel: { h: 95, m: 2.1, c: 0.1, s: 1.1, o: 1.7 } } },
    { name: "Jammu & Kashmir", type: "UT_Hill", base: { pop: 13.5, gdp: 2800, lit: 67, for: 39, urb: 27, rel: { h: 28, m: 68, c: 0.2, s: 1.8, o: 2.0 } } },
    { name: "Jharkhand", type: "State_Central", base: { pop: 39.0, gdp: 2000, lit: 66, for: 29, urb: 24, rel: { h: 67, m: 14.5, c: 4.3, s: 0.2, o: 14.0 } } },
    { name: "Karnataka", type: "State_South", base: { pop: 67.0, gdp: 4500, lit: 75, for: 20, urb: 38, rel: { h: 84, m: 12.9, c: 1.8, s: 0.1, o: 1.2 } } },
    { name: "Kerala", type: "State_South", base: { pop: 35.0, gdp: 4600, lit: 94, for: 54, urb: 47, rel: { h: 54, m: 26.5, c: 18.3, s: 0, o: 1.2 } } },
    { name: "Ladakh", type: "UT_Alpine", base: { pop: 0.3, gdp: 2500, lit: 74, for: 1, urb: 22, rel: { h: 12, m: 46, c: 0.5, s: 0.1, o: 41.4 } } }, // Buddhists in 'o'
    { name: "Lakshadweep", type: "UT_Island", base: { pop: 0.07, gdp: 3000, lit: 91, for: 90, urb: 78, rel: { h: 2.7, m: 96.5, c: 0.5, s: 0, o: 0.3 } } },
    { name: "Madhya Pradesh", type: "State_Central", base: { pop: 86.0, gdp: 2400, lit: 69, for: 25, urb: 27, rel: { h: 90, m: 6.5, c: 0.2, s: 0.2, o: 3.1 } } },
    { name: "Maharashtra", type: "State_West", base: { pop: 125.0, gdp: 4800, lit: 82, for: 16, urb: 45, rel: { h: 79, m: 11.5, c: 1.0, s: 0.2, o: 8.3 } } }, // Buddhists in 'o'
    { name: "Manipur", type: "State_NE", base: { pop: 3.2, gdp: 2200, lit: 76, for: 76, urb: 29, rel: { h: 41, m: 8.4, c: 41.2, s: 0.1, o: 9.3 } } },
    { name: "Meghalaya", type: "State_NE", base: { pop: 3.3, gdp: 2400, lit: 74, for: 76, urb: 20, rel: { h: 11, m: 4.4, c: 74.5, s: 0.1, o: 10.0 } } },
    { name: "Mizoram", type: "State_NE", base: { pop: 1.2, gdp: 2600, lit: 91, for: 85, urb: 52, rel: { h: 2.7, m: 1.3, c: 87.1, s: 0.1, o: 8.8 } } },
    { name: "Nagaland", type: "State_NE", base: { pop: 2.2, gdp: 2500, lit: 79, for: 73, urb: 28, rel: { h: 8.7, m: 2.4, c: 87.9, s: 0.1, o: 0.9 } } },
    { name: "Odisha", type: "State_East", base: { pop: 46.0, gdp: 2800, lit: 72, for: 33, urb: 17, rel: { h: 93, m: 2.1, c: 2.7, s: 0.1, o: 2.1 } } },
    { name: "Puducherry", type: "UT_Coast", base: { pop: 1.4, gdp: 3500, lit: 85, for: 10, urb: 68, rel: { h: 87, m: 6.0, c: 6.2, s: 0.1, o: 0.7 } } },
    { name: "Punjab", type: "State_North", base: { pop: 30.0, gdp: 3500, lit: 75, for: 3, urb: 37, rel: { h: 38, m: 1.9, c: 1.2, s: 57.6, o: 1.3 } } },
    { name: "Rajasthan", type: "State_West", base: { pop: 81.0, gdp: 2800, lit: 66, for: 4, urb: 24, rel: { h: 88, m: 9.0, c: 0.1, s: 1.2, o: 1.7 } } },
    { name: "Sikkim", type: "State_NE", base: { pop: 0.7, gdp: 5500, lit: 81, for: 47, urb: 25, rel: { h: 57, m: 1.6, c: 9.9, s: 0.3, o: 31.2 } } }, // Buddhists in 'o'
    { name: "Tamil Nadu", type: "State_South", base: { pop: 77.0, gdp: 4500, lit: 80, for: 20, urb: 48, rel: { h: 87, m: 5.8, c: 6.1, s: 0.1, o: 1.0 } } },
    { name: "Telangana", type: "State_South", base: { pop: 38.0, gdp: 4200, lit: 66, for: 24, urb: 38, rel: { h: 85, m: 12.7, c: 1.3, s: 0.1, o: 0.9 } } },
    { name: "Tripura", type: "State_NE", base: { pop: 4.1, gdp: 2500, lit: 87, for: 73, urb: 26, rel: { h: 83, m: 8.6, c: 4.3, s: 0.1, o: 4.0 } } },
    { name: "Uttar Pradesh", type: "State_Plains", base: { pop: 235.0, gdp: 2000, lit: 67, for: 6, urb: 22, rel: { h: 79, m: 19.2, c: 0.1, s: 0.3, o: 1.4 } } },
    { name: "Uttarakhand", type: "State_Hill", base: { pop: 11.0, gdp: 3500, lit: 78, for: 45, urb: 30, rel: { h: 82, m: 13.9, c: 0.3, s: 2.3, o: 1.5 } } },
    { name: "West Bengal", type: "State_East", base: { pop: 99.0, gdp: 2600, lit: 76, for: 19, urb: 31, rel: { h: 70, m: 27.0, c: 0.7, s: 0.1, o: 2.2 } } }
];

const CATEGORIES = [
  { id: "Demographics", icon: Users, color: "text-amber-500 dark:text-amber-400" },
  { id: "Education", icon: BookOpen, color: "text-blue-500 dark:text-blue-400" },
  { id: "Health", icon: Heart, color: "text-rose-500 dark:text-rose-400" },
  { id: "Economy", icon: DollarSign, color: "text-emerald-500 dark:text-emerald-400" },
  { id: "Infrastructure", icon: Zap, color: "text-violet-500 dark:text-violet-400" },
  { id: "Environment", icon: Leaf, color: "text-teal-500 dark:text-teal-400" }
];

const generateStateData = (stateName) => {
    const state = STATES_INFO.find(d => d.name === stateName);
    const rand = getSeededRandom(stateName);
    const years = [2025, 2030, 2035, 2040, 2045, 2050];
    const { pop, gdp, lit, urb, for: frst, rel } = state.base;
    const vf = 1 + (rand() * 0.1 - 0.05); 
    const approach = (start, target, rate, t) => target - (target - start) * Math.exp(-rate * t);

    const isDeveloped = lit >= 80;
    const popGrowthRate = isDeveloped ? 0.03 : 0.08;
    const popCurve = isDeveloped ? 0.015 : 0.008; 

    const createRow = (name, cat, formula, decimals = 1, suffix = '', prefix = '') => {
        const values = {};
        years.forEach((yr, idx) => {
            const val = formula(idx, yr);
            const parts = Number(val).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            values[yr] = prefix + parts.join('.') + suffix;
        });
        return { name, category: cat, values };
    };

    const data = [];
    
    // Demographics & Religion
    data.push(createRow("Population (Millions)", "Demographics", (t) => pop * (1 + popGrowthRate * t - popCurve * t * t) * vf, pop < 10 ? 2 : 1));
    data.push(createRow("Population Density (per sq km)", "Demographics", (t) => (pop * 1000000 / (state.type.includes('Metro') || state.name === 'Delhi' ? 1500 : (state.type.includes('Hill') || state.type.includes('NE') ? 20000 : 5000))) * (1 + popGrowthRate * t - popCurve * t * t) * vf, 0));
    data.push(createRow("Urbanization Rate (%)", "Demographics", (t) => approach(urb, state.type.includes('Metro') ? 99 : 65, 0.2, t), 1, '%'));
    data.push(createRow("Gender Ratio (Females/1000 Males)", "Demographics", (t) => approach(920 + rand()*60, 1010, 0.3, t), 0));
    data.push(createRow("Total Fertility Rate", "Demographics", (t) => Math.max(1.4, (isDeveloped ? 1.7 : 2.5) - rand()*0.2 - 0.1 * t), 2));
    data.push(createRow("Elderly Population (60+ yrs) Share (%)", "Demographics", (t) => (isDeveloped ? 12 : 8) + rand()*2 + 2.2 * t, 1, '%'));
    
    data.push(createRow("Hindu Population Share (%)", "Religion", (t) => approach(rel.h, rel.h - (rand()*1.5), 0.1, t), 1, '%'));
    data.push(createRow("Muslim Population Share (%)", "Religion", (t) => approach(rel.m, rel.m + (rand()*1.5), 0.1, t), 1, '%'));
    data.push(createRow("Christian Population Share (%)", "Religion", (t) => approach(rel.c, rel.c + (rand()*0.5), 0.1, t), 1, '%'));
    data.push(createRow("Sikh Population Share (%)", "Religion", (t) => approach(rel.s, rel.s - (rand()*0.2), 0.1, t), 1, '%'));
    data.push(createRow("Buddhist/Jain/Other Share (%)", "Religion", (t) => approach(rel.o, rel.o + (rand()*0.2), 0.1, t), 1, '%'));

    // Education
    data.push(createRow("Overall Literacy Rate (%)", "Education", (t) => approach(lit, 99.5, 0.4, t), 1, '%'));
    data.push(createRow("Higher Education Gross Enrollment (%)", "Education", (t) => approach(25 + rand()*15, 75, 0.3, t), 1, '%'));
    data.push(createRow("Digital Literacy Rate (%)", "Education", (t) => approach(40 + urb*0.3, 98, 0.4, t), 1, '%'));

    // Health
    data.push(createRow("Life Expectancy (Years)", "Health", (t) => approach(68 + rand()*6, 84, 0.2, t), 1));
    data.push(createRow("Infant Mortality Rate (per 1000 births)", "Health", (t) => approach(isDeveloped ? 12 : 35, 5, 0.4, t), 1));
    data.push(createRow("Doctors (per 10,000 People)", "Health", (t) => approach(isDeveloped ? 12 : 5, 35, 0.3, t), 1));

    // Economy
    data.push(createRow("GDP per Capita (USD)", "Economy", (t) => gdp * Math.pow(isDeveloped ? 1.06 : 1.08, t * 5), 0, '', '$'));
    data.push(createRow("State GDP Growth Rate (%)", "Economy", (t) => Math.max(4.0, (isDeveloped ? 7.0 : 8.5) - rand()*1.5 - 0.4 * t), 1, '%'));
    data.push(createRow("Unemployment Rate (%)", "Economy", (t) => Math.max(3.0, 7.5 - rand()*2.0 - 0.4 * t), 1, '%'));
    data.push(createRow("Wealth Disparity Index (0-100)", "Economy", (t) => approach(72 + (gdp/1000) + rand()*5, 82 + rand()*10, 0.15, t), 1));
    data.push(createRow("Female Labor Force Participation (%)", "Economy", (t) => approach(25 + rand()*20, 60, 0.25, t), 1, '%'));

    // Infrastructure
    data.push(createRow("Electricity Availability (% Households)", "Infrastructure", (t) => approach(94, 100, 0.7, t), 1, '%'));
    data.push(createRow("Internet Penetration (%)", "Infrastructure", (t) => approach(50 + rand()*20, 99, 0.4, t), 1, '%'));

    // Environment
    data.push(createRow("Air Quality Index (Annual Avg)", "Environment", (t) => approach(isDeveloped && urb > 40 ? 120 : 60, isDeveloped ? 45 : 30, 0.3, t), 0));
    data.push(createRow("Forest & Tree Cover (%)", "Environment", (t) => approach(frst, Math.min(85, frst + (isDeveloped ? 5 : 8)), 0.2, t), 1, '%'));
    data.push(createRow("Per Capita Carbon Footprint (Tons)", "Environment", (t) => Math.max(0.8, (1.2 + gdp/4000) * (1 - 0.15 * t)), 2));

    return data;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState('timeline');
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [compareStates, setCompareStates] = useState(["Maharashtra", "Uttar Pradesh", "Kerala"]);
  const [compareYear, setCompareYear] = useState(2050);
  
  useEffect(() => { document.body.style.backgroundColor = darkMode ? '#020617' : '#f8fafc'; }, [darkMode]);

  const generatedData = useMemo(() => generateStateData(selectedState), [selectedState]);
  const activeStateInfo = useMemo(() => STATES_INFO.find(d => d.name === selectedState), [selectedState]);
  const generatedCompareData = useMemo(() => compareStates.map(sName => ({ name: sName, data: generateStateData(sName), info: STATES_INFO.find(d => d.name === sName) })), [compareStates]);

  const summaryMetrics = [
    { ...generatedData.find(m => m.name === "Population (Millions)"), icon: Users, color: "from-blue-500 to-indigo-400", shadow: "shadow-blue-500/20" },
    { ...generatedData.find(m => m.name === "GDP per Capita (USD)"), icon: DollarSign, color: "from-amber-500 to-orange-400", shadow: "shadow-amber-500/20" },
    { ...generatedData.find(m => m.name === "Overall Literacy Rate (%)"), icon: BookOpen, color: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/20" }
  ];

  const getTrend = (val25, val50, metricName) => {
    const v1 = parseFloat(val25.toString().replace(/[^0-9.-]+/g,""));
    const v2 = parseFloat(val50.toString().replace(/[^0-9.-]+/g,""));
    const isInverse = ["Unemployment Rate (%)", "Wealth Disparity Index (0-100)", "Infant Mortality Rate (per 1000 births)", "Air Quality Index (Annual Avg)", "Per Capita Carbon Footprint (Tons)"].includes(metricName);
    if (v2 > v1 * 1.02) return { icon: TrendingUp, color: isInverse ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400", bg: isInverse ? "bg-rose-500/10" : "bg-emerald-500/10" };
    if (v2 < v1 * 0.98) return { icon: TrendingDown, color: isInverse ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400", bg: isInverse ? "bg-emerald-500/10" : "bg-rose-500/10" };
    return { icon: Minus, color: "text-slate-400 dark:text-slate-500", bg: "bg-slate-500/10" };
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#081226] text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans pb-12 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-0 dark:opacity-100 mix-blend-overlay"></div>

        <header className="bg-gradient-to-r from-orange-600 via-slate-800 to-green-700 dark:from-[#1c1208]/90 dark:via-[#020617]/90 dark:to-[#061a12]/90 dark:backdrop-blur-lg text-white shadow-xl sticky top-0 z-50 border-b border-slate-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-inner border border-white/20 dark:border-white/10"><Globe size={32} className="text-amber-300" /></div>
              <div><h1 className="text-2xl md:text-3xl font-black tracking-tight">INDIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-emerald-300">2050</span></h1><p className="text-slate-200 text-xs font-semibold tracking-widest uppercase mt-0.5 opacity-80">National Projections Dashboard</p></div>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur transition-all shadow-sm border border-white/10">{darkMode ? <Sun size={20} className="text-amber-300" /> : <Moon size={20} className="text-slate-100" />}</button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col bg-white dark:bg-[#0b1121]/60 dark:backdrop-blur-xl rounded-2xl shadow-md border border-slate-200 dark:border-white/10 mb-8 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-amber-500/5 pointer-events-none"></div>
            <div className="relative z-10 p-5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-black/40 p-1.5 rounded-xl border border-slate-200 dark:border-white/5 w-full md:w-auto">
                <button onClick={() => setViewMode('timeline')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'timeline' ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><Clock size={16}/> State Timeline</button>
                <button onClick={() => setViewMode('compare')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'compare' ? 'bg-white dark:bg-[#1e293b] text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><BarChart2 size={16}/> Compare States</button>
              </div>
              {viewMode === 'compare' ? (
                <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 dark:bg-[#0f172a] p-2.5 px-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Target Year:</span>
                    <select value={compareYear} onChange={(e) => setCompareYear(Number(e.target.value))} className="bg-transparent text-amber-600 dark:text-amber-400 font-bold focus:outline-none pr-2 cursor-pointer text-base">{[2025, 2030, 2035, 2040, 2045, 2050].map(y => <option key={y} value={y} className="text-slate-800">{y}</option>)}</select>
                </div>
              ) : <div className="text-xs text-slate-500 font-medium">Projecting 25 years of socio-economic evolution</div>}
            </div>

            <div className="relative z-10 p-5 flex flex-col md:flex-row items-center gap-4">
              {viewMode === 'timeline' ? (
                <>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl hidden sm:block border dark:border-blue-500/20"><MapPin className="text-blue-600 dark:text-blue-400" size={24} /></div>
                    <div><h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">Select State/UT <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">{activeStateInfo.type.replace('_', ' ')}</span></h2></div>
                  </div>
                  <div className="relative w-full md:w-96 md:ml-auto">
                    <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="w-full appearance-none bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 py-3.5 px-5 rounded-xl font-semibold shadow-sm focus:ring-2 focus:ring-blue-500">{STATES_INFO.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}</select>
                    <ChevronDown className="absolute right-4 top-4 text-slate-500 pointer-events-none" size={20} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full">
                    {compareStates.map((dist, idx) => (
                        <div key={idx} className="flex-1 min-w-[240px] relative">
                            <div className="absolute -top-3 left-4 bg-white dark:bg-[#0f172a] px-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-white/10 z-10 shadow-sm">State {idx + 1}</div>
                            <select value={dist} onChange={(e) => { const n = [...compareStates]; n[idx] = e.target.value; setCompareStates(n); }} className="w-full appearance-none bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 py-3.5 px-4 rounded-xl font-semibold shadow-sm relative z-0">{STATES_INFO.map(d => <option key={d.name} value={d.name} disabled={compareStates.includes(d.name) && d.name !== dist}>{d.name}</option>)}</select>
                            {compareStates.length > 1 && <button onClick={() => setCompareStates(compareStates.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:scale-110 z-20"><X size={12} strokeWidth={3} /></button>}
                        </div>
                    ))}
                    {compareStates.length < 3 && <button onClick={() => { const a = STATES_INFO.find(d => !compareStates.includes(d.name)); if(a) setCompareStates([...compareStates, a.name]); }} className="flex-1 min-w-[240px] flex justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-white/20 bg-slate-50/50 dark:bg-white/5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-white py-3 font-bold transition-colors"><Plus size={18} strokeWidth={3} /> Add State</button>}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {viewMode === 'timeline' ? (
              summaryMetrics.map((m) => {
                const Icon = m.icon;
                return (
                <div key={m.name} className={`bg-gradient-to-br from-white to-slate-50 dark:from-[#0b1121]/80 dark:to-[#020617]/80 dark:backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg ${m.shadow} relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
                  <div className="absolute -top-4 -right-4 p-5 opacity-[0.03] dark:opacity-[0.05]"><Icon size={140} className="dark:text-white" /></div>
                  <div className="relative z-10 flex justify-between items-start mb-6"><div className={`p-3 rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-md`}><Icon size={24} /></div><div className="text-[10px] uppercase font-bold px-3 py-1.5 bg-slate-100 dark:bg-white/10 rounded-full dark:text-slate-300">2050 Proj.</div></div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 relative z-10">{m.name}</p>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-5 relative z-10 tracking-tight">{m.values[2050]}</h3>
                  <div className="flex items-center gap-2 text-sm pt-4 border-t border-slate-200/50 dark:border-white/10 relative z-10"><span className="text-slate-500">2025:</span><span className="font-bold text-slate-700 dark:text-slate-200">{m.values[2025]}</span></div>
                </div>
              )})
            ) : (
              summaryMetrics.map((m, idx) => {
                const colors = ["from-blue-500 to-indigo-400", "from-amber-500 to-orange-400", "from-emerald-500 to-teal-400"];
                const Icon = m.icon;
                return (
                  <div key={m.name} className={`bg-gradient-to-br from-white to-slate-50 dark:from-[#0b1121]/80 dark:to-[#020617]/80 dark:backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg relative flex flex-col`}>
                    <div className="relative z-10 flex items-center gap-3 mb-5 border-b pb-4 border-slate-100 dark:border-white/10"><div className={`p-2.5 rounded-xl bg-gradient-to-br ${colors[idx]} text-white`}><Icon size={20} /></div><p className="text-sm font-bold text-slate-800 dark:text-slate-200">{m.name}</p></div>
                    <div className="relative z-10 flex-1 flex flex-col justify-center gap-4">
                       {generatedCompareData.map(cd => (
                             <div key={cd.name} className="flex justify-between items-end">
                                <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase">{cd.info.type.replace('_', ' ')}</span><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{cd.name}</span></div>
                                <span className="text-xl font-black text-slate-900 dark:text-white">{cd.data.find(x => x.name === m.name).values[compareYear]}</span>
                             </div>
                       ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          {/* Main Socio-Economic Table */}
          <div className="bg-white dark:bg-[#070b14]/80 dark:backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-white/10">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-slate-100 dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-5 font-bold sticky left-0 bg-slate-100 dark:bg-[#0f172a] z-20 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] w-1/3 min-w-[320px] text-slate-600 dark:text-slate-300">Metric <span className="normal-case text-xs font-normal opacity-70 ml-1">({generatedData.filter(m => m.category !== 'Religion').length} Total)</span></th>
                    {viewMode === 'timeline' ? (
                      <>
                        {[2025, 2030, 2035, 2040, 2045, 2050].map(y => <th key={y} className="px-6 py-5 font-extrabold text-blue-600 dark:text-amber-400 text-center min-w-[110px]">{y}</th>)}
                        <th className="px-6 py-5 font-extrabold text-center sticky right-0 bg-slate-100 dark:bg-[#0f172a] z-20 shadow-[-1px_0_0_0_#e2e8f0] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] text-slate-500 dark:text-slate-400">Trend</th>
                      </>
                    ) : compareStates.map((d, i) => <th key={d} className={`px-6 ${i === compareStates.length-1?'pr-12':''} py-5 font-extrabold text-center w-[22%] ${i===0?'text-blue-600 dark:text-blue-400':i===1?'text-amber-600 dark:text-amber-400':'text-emerald-600 dark:text-emerald-400'}`}>{d}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {CATEGORIES.map(cat => {
                    const baseMetrics = viewMode === 'timeline' ? generatedData : generatedCompareData[0]?.data || [];
                    const catMetrics = baseMetrics.filter(m => m.category === cat.id);
                    return (
                      <React.Fragment key={cat.id}>
                        <tr className="bg-slate-50/50 dark:bg-[#111827]"><td colSpan={viewMode === 'timeline'?8:compareStates.length+1} className="px-6 py-4 font-bold sticky left-0 bg-slate-50/95 dark:bg-[#111827] z-10 text-slate-800 dark:text-slate-200 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)]"><div className="flex items-center gap-3"><div className={`p-1.5 rounded-lg bg-white dark:bg-white/5 shadow-sm ${cat.color}`}><cat.icon size={18} /></div> <span className="tracking-widest uppercase text-xs">{cat.id}</span></div></td></tr>
                        {catMetrics.map((metric) => (
                           <tr key={metric.name} className="hover:bg-blue-50/50 dark:hover:bg-white/[0.02] group transition-colors">
                              <td className="px-6 py-4 text-sm font-medium sticky left-0 bg-white dark:bg-[#070b14] group-hover:bg-blue-50/50 dark:group-hover:bg-[#0b1121] z-10 text-slate-700 dark:text-slate-300 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] transition-colors">{metric.name}</td>
                              {viewMode === 'timeline' ? (
                                <>
                                  {[2025, 2030, 2035, 2040, 2045, 2050].map(y => <td key={y} className="px-6 py-4 text-sm text-center font-mono text-slate-600 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors">{metric.values[y]}</td>)}
                                  <td className="px-6 py-4 text-center sticky right-0 bg-white dark:bg-[#070b14] group-hover:bg-blue-50/50 dark:group-hover:bg-[#0b1121] z-10 shadow-[-1px_0_0_0_#e2e8f0] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] transition-colors">
                                      {(() => { const t = getTrend(metric.values[2025], metric.values[2050], metric.name); return <div className={`inline-flex p-1.5 rounded-lg ${t.bg} ${t.color}`} title="25-Year Trend"><t.icon size={16} strokeWidth={3}/></div>; })()}
                                  </td>
                                </>
                              ) : generatedCompareData.map((cd, i) => <td key={cd.name} className={`px-6 ${i===generatedCompareData.length-1?'pr-12':''} py-4 text-center font-mono font-bold text-slate-700 dark:text-slate-200 ${i===0?'group-hover:text-blue-600 dark:group-hover:text-blue-300':i===1?'group-hover:text-amber-600 dark:group-hover:text-amber-300':'group-hover:text-emerald-600 dark:group-hover:text-emerald-300'} transition-colors w-[22%]`}>{cd.data.find(m=>m.name===metric.name)?.values[compareYear]}</td>)}
                           </tr>
                        ))}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-6 flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400"><Users size={20} /></div>
            Religious Demographics Projections
          </h3>

          {/* Religious Data Table */}
          <div className="bg-white dark:bg-[#070b14]/80 dark:backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-white/10">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-slate-100 dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-5 font-bold sticky left-0 bg-slate-100 dark:bg-[#0f172a] z-20 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] w-1/3 min-w-[320px] text-slate-600 dark:text-slate-300">Metric <span className="normal-case text-xs font-normal opacity-70 ml-1">({generatedData.filter(m => m.category === 'Religion').length} Total)</span></th>
                    {viewMode === 'timeline' ? (
                      <>
                        {[2025, 2030, 2035, 2040, 2045, 2050].map(y => <th key={y} className="px-6 py-5 font-extrabold text-blue-600 dark:text-amber-400 text-center min-w-[110px]">{y}</th>)}
                        <th className="px-6 py-5 font-extrabold text-center sticky right-0 bg-slate-100 dark:bg-[#0f172a] z-20 shadow-[-1px_0_0_0_#e2e8f0] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] text-slate-500 dark:text-slate-400">Trend</th>
                      </>
                    ) : compareStates.map((d, i) => <th key={d} className={`px-6 ${i === compareStates.length-1?'pr-12':''} py-5 font-extrabold text-center w-[22%] ${i===0?'text-blue-600 dark:text-blue-400':i===1?'text-amber-600 dark:text-amber-400':'text-emerald-600 dark:text-emerald-400'}`}>{d}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {[{id: "Religion", icon: Users, color: "text-orange-500 dark:text-orange-400"}].map(cat => {
                    const baseMetrics = viewMode === 'timeline' ? generatedData : generatedCompareData[0]?.data || [];
                    const catMetrics = baseMetrics.filter(m => m.category === cat.id);
                    return (
                      <React.Fragment key={cat.id}>
                        <tr className="bg-slate-50/50 dark:bg-[#111827]"><td colSpan={viewMode === 'timeline'?8:compareStates.length+1} className="px-6 py-4 font-bold sticky left-0 bg-slate-50/95 dark:bg-[#111827] z-10 text-slate-800 dark:text-slate-200 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)]"><div className="flex items-center gap-3"><div className={`p-1.5 rounded-lg bg-white dark:bg-white/5 shadow-sm ${cat.color}`}><cat.icon size={18} /></div> <span className="tracking-widest uppercase text-xs">{cat.id}</span></div></td></tr>
                        {catMetrics.map((metric) => (
                           <tr key={metric.name} className="hover:bg-blue-50/50 dark:hover:bg-white/[0.02] group transition-colors">
                              <td className="px-6 py-4 text-sm font-medium sticky left-0 bg-white dark:bg-[#070b14] group-hover:bg-blue-50/50 dark:group-hover:bg-[#0b1121] z-10 text-slate-700 dark:text-slate-300 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] transition-colors">{metric.name}</td>
                              {viewMode === 'timeline' ? (
                                <>
                                  {[2025, 2030, 2035, 2040, 2045, 2050].map(y => <td key={y} className="px-6 py-4 text-sm text-center font-mono text-slate-600 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors">{metric.values[y]}</td>)}
                                  <td className="px-6 py-4 text-center sticky right-0 bg-white dark:bg-[#070b14] group-hover:bg-blue-50/50 dark:group-hover:bg-[#0b1121] z-10 shadow-[-1px_0_0_0_#e2e8f0] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] transition-colors">
                                      {(() => { const t = getTrend(metric.values[2025], metric.values[2050], metric.name); return <div className={`inline-flex p-1.5 rounded-lg ${t.bg} ${t.color}`} title="25-Year Trend"><t.icon size={16} strokeWidth={3}/></div>; })()}
                                  </td>
                                </>
                              ) : generatedCompareData.map((cd, i) => <td key={cd.name} className={`px-6 ${i===generatedCompareData.length-1?'pr-12':''} py-4 text-center font-mono font-bold text-slate-700 dark:text-slate-200 ${i===0?'group-hover:text-blue-600 dark:group-hover:text-blue-300':i===1?'group-hover:text-amber-600 dark:group-hover:text-amber-300':'group-hover:text-emerald-600 dark:group-hover:text-emerald-300'} transition-colors w-[22%]`}>{cd.data.find(m=>m.name===metric.name)?.values[compareYear]}</td>)}
                           </tr>
                        ))}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}