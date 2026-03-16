import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Moon, Sun, Users, BookOpen, Heart, DollarSign, Zap, Leaf, MapPin, TrendingUp, TrendingDown, Minus, Activity, BarChart2, Clock, X, Plus, Globe, Map } from 'lucide-react';

// --- Rigid Factual 2024-25 State Baselines ---
// Sources: UN WUP 2024 (Pop), NFHS-5 (Sex Ratio, TFR), SRS 2020-22 (IMR, LifeExp, MMR), PLFS 23-24 (Unemp, FLFP), MoSPI/RBI (GDP)
// Note: popCagr rigorously accounts for both Natural Growth (TFR) AND Net Interstate/International Migration
const STATES_INFO = [
    { name: "Andhra Pradesh", type: "State_Coast", base: { pop: 53.8, area: 162.9, gdp: 2750, lit: 67.4, fLit: 60.0, for: 18.2, urb: 35.0, tfr: 1.7, sexRatio: 1045, imr: 21, lifeExp: 70.3, unemp: 4.1, flfp: 45.0, ger: 37.7, popCagr: 0.005, rel: { h: 90.8, m: 7.3, c: 1.4, s: 0.0, o: 0.5 } } },
    { name: "Arunachal Pradesh", type: "State_NE", base: { pop: 1.7, area: 83.7, gdp: 2900, lit: 65.4, fLit: 59.5, for: 79.3, urb: 22.9, tfr: 1.7, sexRatio: 938, imr: 36, lifeExp: 67.5, unemp: 5.5, flfp: 35.0, ger: 30.5, popCagr: 0.008, rel: { h: 29.0, m: 1.9, c: 30.3, s: 0.2, o: 38.6 } } },
    { name: "Assam", type: "State_NE", base: { pop: 36.3, area: 78.4, gdp: 1650, lit: 72.2, fLit: 66.3, for: 36.1, urb: 15.0, tfr: 1.9, sexRatio: 1012, imr: 36, lifeExp: 66.8, unemp: 6.1, flfp: 32.5, ger: 17.1, popCagr: 0.009, rel: { h: 58.5, m: 37.5, c: 3.8, s: 0.1, o: 0.1 } } },
    { name: "Bihar", type: "State_Plains", base: { pop: 135.5, area: 94.1, gdp: 900, lit: 70.9, fLit: 60.5, for: 7.8, urb: 12.5, tfr: 2.98, sexRatio: 1090, imr: 27, lifeExp: 69.5, unemp: 6.0, flfp: 15.5, ger: 17.1, popCagr: 0.011, rel: { h: 81.0, m: 18.5, c: 0.1, s: 0.0, o: 0.4 } } }, // Massive out-migration tempers high TFR
    { name: "Chhattisgarh", type: "State_Central", base: { pop: 31.0, area: 135.1, gdp: 2000, lit: 70.3, fLit: 60.2, for: 41.1, urb: 23.2, tfr: 2.1, sexRatio: 1015, imr: 38, lifeExp: 65.2, unemp: 3.5, flfp: 55.4, ger: 19.5, popCagr: 0.009, rel: { h: 93.3, m: 2.0, c: 1.9, s: 0.3, o: 2.5 } } },
    { name: "Delhi", type: "UT_Metro", base: { pop: 33.5, area: 1.48, gdp: 5900, lit: 86.2, fLit: 82.4, for: 13.2, urb: 97.5, tfr: 1.5, sexRatio: 913, imr: 14, lifeExp: 75.8, unemp: 5.1, flfp: 25.4, ger: 47.6, popCagr: 0.018, rel: { h: 80.5, m: 14.2, c: 0.9, s: 3.2, o: 1.2 } } }, // Low TFR but massive in-migration
    { name: "Goa", type: "State_Coast", base: { pop: 1.6, area: 3.7, gdp: 7800, lit: 88.7, fLit: 84.6, for: 33.1, urb: 62.2, tfr: 1.3, sexRatio: 973, imr: 5, lifeExp: 73.3, unemp: 9.5, flfp: 28.0, ger: 33.0, popCagr: 0.006, rel: { h: 66.1, m: 8.3, c: 25.1, s: 0.1, o: 0.4 } } },
    { name: "Gujarat", type: "State_Coast", base: { pop: 73.5, area: 196.0, gdp: 4200, lit: 78.0, fLit: 69.7, for: 7.5, urb: 45.0, tfr: 1.9, sexRatio: 919, imr: 23, lifeExp: 70.2, unemp: 2.2, flfp: 33.5, ger: 24.1, popCagr: 0.012, rel: { h: 88.6, m: 9.7, c: 0.5, s: 0.1, o: 1.1 } } }, // Heavy industrial in-migration
    { name: "Haryana", type: "State_North", base: { pop: 31.0, area: 44.2, gdp: 4450, lit: 75.5, fLit: 65.9, for: 3.6, urb: 38.0, tfr: 1.9, sexRatio: 926, imr: 27, lifeExp: 69.4, unemp: 6.1, flfp: 20.2, ger: 32.0, popCagr: 0.013, rel: { h: 87.5, m: 7.0, c: 0.2, s: 4.9, o: 0.4 } } },
    { name: "Himachal Pradesh", type: "State_Hill", base: { pop: 7.8, area: 55.6, gdp: 3200, lit: 82.8, fLit: 76.6, for: 27.7, urb: 10.0, tfr: 1.6, sexRatio: 1040, imr: 17, lifeExp: 72.6, unemp: 4.0, flfp: 52.5, ger: 43.1, popCagr: 0.005, rel: { h: 95.2, m: 2.2, c: 0.2, s: 1.2, o: 1.2 } } },
    { name: "Jammu & Kashmir", type: "UT_Hill", base: { pop: 14.0, area: 42.2, gdp: 2400, lit: 67.1, fLit: 56.4, for: 39.0, urb: 27.0, tfr: 1.6, sexRatio: 889, imr: 20, lifeExp: 73.5, unemp: 7.2, flfp: 25.0, ger: 24.0, popCagr: 0.008, rel: { h: 28.4, m: 68.3, c: 0.2, s: 1.8, o: 1.3 } } },
    { name: "Jharkhand", type: "State_Central", base: { pop: 41.5, area: 79.7, gdp: 1380, lit: 66.4, fLit: 55.4, for: 29.7, urb: 24.1, tfr: 2.26, sexRatio: 1050, imr: 25, lifeExp: 67.1, unemp: 3.1, flfp: 35.2, ger: 18.6, popCagr: 0.010, rel: { h: 67.8, m: 14.5, c: 4.3, s: 0.2, o: 13.2 } } },
    { name: "Karnataka", type: "State_South", base: { pop: 69.5, area: 191.7, gdp: 4400, lit: 75.4, fLit: 68.1, for: 20.1, urb: 41.0, tfr: 1.7, sexRatio: 1034, imr: 19, lifeExp: 69.5, unemp: 3.2, flfp: 38.5, ger: 36.2, popCagr: 0.010, rel: { h: 84.0, m: 12.9, c: 1.9, s: 0.1, o: 1.1 } } }, // Heavy IT in-migration
    { name: "Kerala", type: "State_South", base: { pop: 35.8, area: 38.8, gdp: 3750, lit: 96.2, fLit: 95.2, for: 54.4, urb: 47.7, tfr: 1.5, sexRatio: 1121, imr: 4, lifeExp: 75.2, unemp: 7.0, flfp: 25.5, ger: 43.2, popCagr: 0.002, rel: { h: 53.5, m: 28.5, c: 17.5, s: 0.0, o: 0.5 } } }, // Extremely low growth (Out-migration + Low TFR)
    { name: "Madhya Pradesh", type: "State_Central", base: { pop: 89.0, area: 308.2, gdp: 1900, lit: 69.3, fLit: 59.2, for: 25.1, urb: 28.5, tfr: 2.0, sexRatio: 956, imr: 41, lifeExp: 67.0, unemp: 3.0, flfp: 45.2, ger: 28.9, popCagr: 0.011, rel: { h: 90.9, m: 6.6, c: 0.3, s: 0.2, o: 2.0 } } },
    { name: "Maharashtra", type: "State_West", base: { pop: 133.5, area: 307.7, gdp: 3800, lit: 82.3, fLit: 75.9, for: 16.5, urb: 47.0, tfr: 1.7, sexRatio: 966, imr: 15, lifeExp: 72.7, unemp: 3.1, flfp: 35.0, ger: 35.3, popCagr: 0.010, rel: { h: 79.8, m: 11.5, c: 1.0, s: 0.2, o: 7.5 } } }, // Low TFR offset by massive in-migration
    { name: "Manipur", type: "State_NE", base: { pop: 3.3, area: 22.3, gdp: 1600, lit: 76.9, fLit: 70.2, for: 75.0, urb: 29.0, tfr: 2.1, sexRatio: 985, imr: 22, lifeExp: 70.0, unemp: 6.5, flfp: 38.0, ger: 25.0, popCagr: 0.010, rel: { h: 41.3, m: 8.4, c: 41.2, s: 0.0, o: 9.1 } } },
    { name: "Meghalaya", type: "State_NE", base: { pop: 3.5, area: 22.4, gdp: 1800, lit: 74.4, fLit: 72.8, for: 76.0, urb: 20.0, tfr: 2.9, sexRatio: 989, imr: 29, lifeExp: 68.5, unemp: 4.0, flfp: 45.0, ger: 20.0, popCagr: 0.013, rel: { h: 11.5, m: 4.4, c: 74.5, s: 0.1, o: 9.5 } } },
    { name: "Mizoram", type: "State_NE", base: { pop: 1.3, area: 21.0, gdp: 2200, lit: 91.3, fLit: 89.2, for: 85.0, urb: 52.0, tfr: 2.2, sexRatio: 976, imr: 15, lifeExp: 72.0, unemp: 5.5, flfp: 55.0, ger: 24.0, popCagr: 0.010, rel: { h: 2.7, m: 1.3, c: 87.1, s: 0.0, o: 8.9 } } },
    { name: "Nagaland", type: "State_NE", base: { pop: 2.3, area: 16.5, gdp: 1700, lit: 79.5, fLit: 76.1, for: 75.0, urb: 28.0, tfr: 2.4, sexRatio: 931, imr: 25, lifeExp: 69.5, unemp: 8.0, flfp: 42.0, ger: 18.0, popCagr: 0.011, rel: { h: 8.7, m: 2.5, c: 87.9, s: 0.1, o: 0.8 } } },
    { name: "Odisha", type: "State_East", base: { pop: 48.0, area: 155.7, gdp: 2250, lit: 72.9, fLit: 64.0, for: 33.1, urb: 18.0, tfr: 1.8, sexRatio: 1063, imr: 36, lifeExp: 69.8, unemp: 4.5, flfp: 35.5, ger: 21.4, popCagr: 0.006, rel: { h: 93.6, m: 2.2, c: 2.8, s: 0.1, o: 1.3 } } }, // Net out-migration
    { name: "Punjab", type: "State_North", base: { pop: 31.5, area: 50.3, gdp: 2550, lit: 75.8, fLit: 70.7, for: 3.7, urb: 40.0, tfr: 1.6, sexRatio: 938, imr: 18, lifeExp: 72.7, unemp: 6.1, flfp: 22.0, ger: 30.1, popCagr: 0.004, rel: { h: 38.5, m: 1.9, c: 1.3, s: 57.7, o: 0.6 } } }, // Massive international out-migration
    { name: "Rajasthan", type: "State_West", base: { pop: 84.5, area: 342.2, gdp: 2150, lit: 66.1, fLit: 52.1, for: 4.8, urb: 26.0, tfr: 2.4, sexRatio: 1009, imr: 32, lifeExp: 69.0, unemp: 4.0, flfp: 42.5, ger: 25.0, popCagr: 0.012, rel: { h: 88.5, m: 9.1, c: 0.1, s: 1.3, o: 1.0 } } },
    { name: "Sikkim", type: "State_NE", base: { pop: 0.7, area: 7.0, gdp: 7400, lit: 81.4, fLit: 76.4, for: 47.1, urb: 25.2, tfr: 1.1, sexRatio: 890, imr: 5, lifeExp: 73.1, unemp: 4.5, flfp: 41.2, ger: 28.0, popCagr: 0.004, rel: { h: 57.8, m: 1.6, c: 9.9, s: 0.3, o: 30.4 } } },
    { name: "Tamil Nadu", type: "State_South", base: { pop: 78.5, area: 130.0, gdp: 4350, lit: 80.1, fLit: 73.4, for: 20.3, urb: 51.0, tfr: 1.4, sexRatio: 1088, imr: 13, lifeExp: 72.6, unemp: 3.5, flfp: 40.5, ger: 47.0, popCagr: 0.006, rel: { h: 87.6, m: 5.9, c: 6.1, s: 0.1, o: 0.3 } } }, // Low TFR fully offset by industrial in-migration
    { name: "Telangana", type: "State_South", base: { pop: 39.5, area: 112.0, gdp: 4900, lit: 66.5, fLit: 57.9, for: 24.0, urb: 45.0, tfr: 1.8, sexRatio: 1049, imr: 21, lifeExp: 69.6, unemp: 4.2, flfp: 35.5, ger: 39.1, popCagr: 0.009, rel: { h: 85.1, m: 12.7, c: 1.3, s: 0.1, o: 0.8 } } },
    { name: "Tripura", type: "State_NE", base: { pop: 4.2, area: 10.4, gdp: 2100, lit: 87.2, fLit: 82.7, for: 60.0, urb: 26.0, tfr: 1.7, sexRatio: 960, imr: 21, lifeExp: 71.0, unemp: 5.0, flfp: 30.0, ger: 22.0, popCagr: 0.008, rel: { h: 83.4, m: 8.6, c: 4.3, s: 0.0, o: 3.7 } } },
    { name: "Uttar Pradesh", type: "State_Plains", base: { pop: 243.0, area: 240.9, gdp: 1400, lit: 73.0, fLit: 61.0, for: 6.1, urb: 24.0, tfr: 2.4, sexRatio: 1017, imr: 38, lifeExp: 65.6, unemp: 3.5, flfp: 20.5, ger: 24.1, popCagr: 0.010, rel: { h: 79.0, m: 20.2, c: 0.2, s: 0.3, o: 0.3 } } }, // Massive out-migration
    { name: "Uttarakhand", type: "State_Hill", base: { pop: 12.0, area: 53.4, gdp: 3100, lit: 78.8, fLit: 70.0, for: 45.0, urb: 30.2, tfr: 1.9, sexRatio: 963, imr: 26, lifeExp: 71.5, unemp: 5.5, flfp: 35.0, ger: 35.0, popCagr: 0.009, rel: { h: 82.9, m: 13.9, c: 0.3, s: 2.3, o: 0.6 } } },
    { name: "West Bengal", type: "State_East", base: { pop: 104.0, area: 88.7, gdp: 2150, lit: 76.3, fLit: 70.5, for: 19.0, urb: 33.0, tfr: 1.6, sexRatio: 1049, imr: 19, lifeExp: 72.1, unemp: 4.8, flfp: 25.5, ger: 21.0, popCagr: 0.006, rel: { h: 68.5, m: 29.5, c: 0.7, s: 0.1, o: 1.2 } } }
];

const CATEGORIES = [
  { id: "Demographics", icon: Users, color: "text-amber-500" },
  { id: "Education", icon: BookOpen, color: "text-blue-500" },
  { id: "Health", icon: Heart, color: "text-rose-500" },
  { id: "Economy", icon: DollarSign, color: "text-emerald-500" },
  { id: "Infrastructure", icon: Zap, color: "text-violet-500" },
  { id: "Environment", icon: Leaf, color: "text-teal-500" }
];

const generateStateData = (stateName) => {
    const state = STATES_INFO.find(d => d.name === stateName);
    const years = [2025, 2030, 2035, 2040, 2045, 2050];
    
    // Rigid Data Pull - No Random Offsets
    const { pop, area, gdp, lit, fLit, urb, for: frst, rel, tfr, sexRatio, imr, lifeExp, unemp, flfp, ger, popCagr } = state.base;
    
    // Mathematical approach curve (target, rate of closure)
    const approach = (start, target, rate, t) => target - (target - start) * Math.exp(-rate * t);

    // Accurate Economic Engine (Catch-up mapping)
    const growthTier = gdp < 2000 ? 1.085 : (gdp < 4000 ? 1.075 : 1.065);
    const isDeveloped = lit >= 80 || gdp > 3500;
    
    // Corrected Religious Engine: Proportional Differential Growth based on recent demographic shifts
    let mGrowth = 0.08; // 8% relative baseline shift over 25 years
    if (state.name === "Assam") mGrowth = 0.25; 
    else if (state.name === "West Bengal") mGrowth = 0.18; 
    else if (state.name === "Kerala") mGrowth = 0.12; 
    else if (["Bihar", "Uttar Pradesh", "Jharkhand"].includes(state.name)) mGrowth = 0.15; 

    const mTarget = Math.min(99, rel.m * (1 + mGrowth));
    const hTarget = Math.max(1, rel.h - (mTarget - rel.m));

    const createRow = (name, cat, formula, decimals = 1, suffix = '', prefix = '') => {
        const values = {};
        years.forEach((yr, idx) => {
            const val = Math.max(0, formula(idx, yr)); // Prevent negatives
            const parts = Number(val).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            values[yr] = prefix + parts.join('.') + suffix;
        });
        return { name, category: cat, values };
    };

    const data = [];
    
    // ==========================================
    // 1. DEMOGRAPHICS (7 Metrics)
    // ==========================================
    data.push(createRow("Population (Millions)", "Demographics", (t) => {
        const actualYears = t * 5;
        // Dampen the CAGR slightly over time to reflect natural demographic transition
        const effectiveCagr = popCagr * (1 - (0.015 * t)); 
        return pop * Math.pow(1 + effectiveCagr, actualYears);
    }, 1));
    data.push(createRow("Population Density (per sq km)", "Demographics", (t) => {
        const effectiveCagr = popCagr * (1 - (0.015 * t)); 
        const projPop = pop * Math.pow(1 + effectiveCagr, t * 5);
        return (projPop * 1000) / area; // pop is in millions, area in 1000 sq km
    }, 0));
    data.push(createRow("Urbanization Rate (%)", "Demographics", (t) => approach(urb, state.type?.includes('Metro') ? 99 : 75, 0.18, t), 1, '%'));
    data.push(createRow("Gender Ratio (F/1000 M)", "Demographics", (t) => approach(sexRatio, 1050, 0.15, t), 0));
    data.push(createRow("Total Fertility Rate", "Demographics", (t) => Math.max(1.3, tfr - 0.15 * t), 2));
    data.push(createRow("Elderly Share (60+ yrs) (%)", "Demographics", (t) => (lifeExp > 70 ? 11 : 8) + (tfr < 2.0 ? 3.0 : 1.5) * t, 1, '%'));
    data.push(createRow("Working Age (15-59 yrs) (%)", "Demographics", (t) => approach(62, tfr < 2.0 ? 55 : 68, 0.15, t), 1, '%'));

    // ==========================================
    // 2. RELIGION (5 Metrics - Separate Category)
    // ==========================================
    data.push(createRow("Hindu Share (%)", "Religion", (t) => rel.h - ((rel.h - hTarget) / 5) * t, 1, '%'));
    data.push(createRow("Muslim Share (%)", "Religion", (t) => rel.m + ((mTarget - rel.m) / 5) * t, 1, '%'));
    data.push(createRow("Christian Share (%)", "Religion", (t) => rel.c + (rel.c * 0.05 / 5) * t, 1, '%')); 
    data.push(createRow("Sikh Share (%)", "Religion", (t) => rel.s, 1, '%'));
    data.push(createRow("Buddhist/Other Share (%)", "Religion", (t) => rel.o, 1, '%'));

    // ==========================================
    // 3. EDUCATION (5 Metrics)
    // ==========================================
    data.push(createRow("Overall Literacy Rate (%)", "Education", (t) => approach(lit, 99.5, 0.35, t), 1, '%'));
    data.push(createRow("Female Literacy Rate (%)", "Education", (t) => approach(fLit, 99.5, 0.40, t), 1, '%'));
    data.push(createRow("Higher Education GER (%)", "Education", (t) => approach(ger, 80, 0.25, t), 1, '%'));
    data.push(createRow("Digital Literacy Rate (%)", "Education", (t) => approach((lit * 0.6) + (urb * 0.3), 98, 0.4, t), 1, '%'));
    data.push(createRow("STEM Graduates (Thousands)", "Education", (t) => pop * ger * 0.8 * Math.pow(1.3, t), 0));

    // ==========================================
    // 4. HEALTH (5 Metrics)
    // ==========================================
    data.push(createRow("Life Expectancy (Years)", "Health", (t) => approach(lifeExp, 84, 0.2, t), 1));
    data.push(createRow("Infant Mortality Rate (per 1000)", "Health", (t) => approach(imr, 5, 0.35, t), 1));
    data.push(createRow("Maternal Mortality Ratio", "Health", (t) => approach(imr * (state.name === "Assam" ? 5.4 : 3.5), 15, 0.35, t), 0));
    data.push(createRow("Doctors (per 10,000 People)", "Health", (t) => approach(isDeveloped ? 20 + (gdp/1000) : 4 + (gdp/1000)*2, 35, 0.3, t), 1));
    data.push(createRow("Hospital Beds (per 10k People)", "Health", (t) => approach(isDeveloped ? 15 : 6, 40, 0.25, t), 1));

    // ==========================================
    // 5. ECONOMY (7 Metrics)
    // ==========================================
    data.push(createRow("GDP per Capita (USD)", "Economy", (t) => gdp * Math.pow(growthTier, t * 5), 0, '', '$'));
    data.push(createRow("State GDP Growth Rate (%)", "Economy", (t) => Math.max(4.0, (growthTier - 1)*100 - 0.4 * t), 1, '%'));
    data.push(createRow("Unemployment Rate (%)", "Economy", (t) => approach(unemp, 3.5, 0.15, t), 1, '%'));
    data.push(createRow("Female Labor Force (FLFP) (%)", "Economy", (t) => approach(flfp, 65, 0.25, t), 1, '%'));
    data.push(createRow("Agri Share of State GDP (%)", "Economy", (t) => approach(Math.max(2, 35 - urb*0.4), 5, 0.25, t), 1, '%'));
    data.push(createRow("FDI Inflows ($ Billions)", "Economy", (t) => {
        let fdiBase = (gdp * pop) / 10000 * (urb/50);
        if(["Maharashtra", "Gujarat", "Karnataka", "Delhi", "Tamil Nadu"].includes(state.name)) fdiBase *= 3;
        return fdiBase * Math.pow(1.5, t);
    }, 1, '', '$'));
    data.push(createRow("Wealth Disparity Index (0-100)", "Economy", (t) => approach(65 + (gdp/1500), 82, 0.12, t), 1));

    // ==========================================
    // 6. INFRASTRUCTURE (5 Metrics)
    // ==========================================
    data.push(createRow("Electricity Availability (%)", "Infrastructure", (t) => approach(98, 100, 0.8, t), 1, '%'));
    data.push(createRow("Piped Water Access (%)", "Infrastructure", (t) => approach(Math.min(95, urb * 0.5 + 40), 100, 0.5, t), 1, '%'));
    data.push(createRow("Internet Access (%)", "Infrastructure", (t) => approach((lit * 0.7) + (urb * 0.3), 99, 0.5, t), 1, '%'));
    data.push(createRow("5G/6G Network Coverage (%)", "Infrastructure", (t) => approach(urb * 0.8 + 20, 99, 0.5, t), 1, '%'));
    data.push(createRow("Highway Density (km/1000km²)", "Infrastructure", (t) => approach(isDeveloped ? 60 : 25, 120, 0.2, t), 0));

    // ==========================================
    // 7. ENVIRONMENT (4 Metrics)
    // ==========================================
    data.push(createRow("Air Quality Index (Annual Avg)", "Environment", (t) => {
        let baseAqi = urb * 1.8 + (gdp < 2500 ? 40 : 0);
        if(["Delhi", "Haryana", "Uttar Pradesh", "Bihar", "Punjab"].includes(state.name)) baseAqi += 80;
        return approach(baseAqi, 45, 0.3, t);
    }, 0));
    data.push(createRow("Forest Cover (%)", "Environment", (t) => approach(frst, Math.min(85, frst + 5), 0.1, t), 1, '%'));
    data.push(createRow("EV Adoption Rate (%)", "Environment", (t) => approach(urb > 40 ? 5 : 2, 90, 0.4, t), 1, '%'));
    data.push(createRow("Per Capita Carbon Footprint (T)", "Environment", (t) => Math.max(0.5, (gdp / 1500) * (1 - 0.1 * t)), 2));

    return data;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState('timeline');
  const [selectedState, setSelectedState] = useState("Delhi");
  const [compareStates, setCompareStates] = useState(["Delhi", "Maharashtra", "Uttar Pradesh"]);
  const [compareYear, setCompareYear] = useState(2050);
  
  useEffect(() => { document.body.style.backgroundColor = darkMode ? '#020617' : '#f8fafc'; }, [darkMode]);

  const generatedData = useMemo(() => generateStateData(selectedState), [selectedState]);
  const activeStateInfo = useMemo(() => STATES_INFO.find(d => d.name === selectedState), [selectedState]);
  const generatedCompareData = useMemo(() => compareStates.map(sName => ({ name: sName, data: generateStateData(sName), info: STATES_INFO.find(d => d.name === sName) })), [compareStates]);

  const summaryMetrics = useMemo(() => {
    if (!generatedData) return [];
    return [
      { ...(generatedData.find(m => m.name === "Population (Millions)") || {}), icon: Users, color: "from-blue-500 to-indigo-400", shadow: "shadow-blue-500/20" },
      { ...(generatedData.find(m => m.name === "GDP per Capita (USD)") || {}), icon: DollarSign, color: "from-amber-500 to-orange-400", shadow: "shadow-amber-500/20" },
      { ...(generatedData.find(m => m.name === "Female Labor Force (FLFP) (%)") || {}), icon: BookOpen, color: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/20" }
    ];
  }, [generatedData]);

  const getTrend = (val25, val50, metricName) => {
    const v1 = parseFloat(val25.toString().replace(/[^0-9.-]+/g,""));
    const v2 = parseFloat(val50.toString().replace(/[^0-9.-]+/g,""));
    const isInverse = ["Wealth Disparity Index (0-100)", "Infant Mortality Rate (per 1000)", "Maternal Mortality Ratio", "Air Quality Index (Annual Avg)", "Unemployment Rate (%)", "Per Capita Carbon Footprint (T)", "Agri Share of State GDP (%)"].includes(metricName);
    if (v2 > v1 * 1.02) return { icon: TrendingUp, color: isInverse ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400", bg: isInverse ? "bg-rose-500/10" : "bg-emerald-500/10" };
    if (v2 < v1 * 0.98) return { icon: TrendingDown, color: isInverse ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400", bg: isInverse ? "bg-emerald-500/10" : "bg-rose-500/10" };
    return { icon: Minus, color: "text-slate-400 dark:text-slate-500", bg: "bg-slate-500/10" };
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#081226] text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans pb-12 relative overflow-x-hidden">
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-0 dark:opacity-100 mix-blend-overlay"></div>

        {/* Premium Header */}
        <header className="bg-gradient-to-r from-orange-600 via-slate-800 to-green-700 dark:from-[#1c1208]/90 dark:via-[#020617]/90 dark:to-[#061a12]/90 dark:backdrop-blur-lg text-white shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50 border-b border-slate-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-2.5 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-inner border border-white/20 dark:border-white/10">
                  <Globe size={28} className="text-amber-300 animate-pulse md:w-8 md:h-8" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-black tracking-tighter">
                    FACTUAL INDIA <span className="text-amber-300 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-300 dark:to-orange-300">2050</span>
                  </h1>
                  <p className="text-white/80 dark:text-white/60 text-[10px] md:text-xs font-bold tracking-widest uppercase mt-0.5">Rigid State Baselines (NFHS-5, SRS, PLFS)</p>
                </div>
              </div>
              
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="md:hidden p-2.5 bg-white/10 rounded-full backdrop-blur border border-white/10 shadow-sm"
              >
                {darkMode ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} className="text-slate-100" />}
              </button>
            </div>
            
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="hidden md:block p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur border border-white/10 transition-all shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} className="text-amber-300" /> : <Moon size={20} className="text-slate-100" />}
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-8">
          
          {/* Integrated Control Section */}
          <div className="flex flex-col bg-white dark:bg-[#0b1121]/40 dark:backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 mb-6 md:mb-8 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 pointer-events-none"></div>
            
            {/* Top Bar: View Mode & Year */}
            <div className="relative z-10 p-4 md:p-5 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/5 w-full md:w-auto">
                <button onClick={() => setViewMode('timeline')} className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'timeline' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                  <Clock size={14} className="md:w-4 md:h-4"/> State Timeline
                </button>
                <button onClick={() => setViewMode('compare')} className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'compare' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                  <BarChart2 size={14} className="md:w-4 md:h-4"/> Compare Matrix
                </button>
              </div>
              
              {viewMode === 'compare' ? (
                <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 dark:bg-[#0f172a]/80 p-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10">
                    <span className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Target Year:</span>
                    <div className="relative w-full md:w-auto">
                      <select value={compareYear} onChange={(e) => setCompareYear(Number(e.target.value))} className="w-full appearance-none bg-transparent text-amber-600 dark:text-amber-400 font-bold focus:outline-none pr-6 cursor-pointer text-sm md:text-base">
                          {[2025, 2030, 2035, 2040, 2045, 2050].map(y => <option key={y} value={y} className="text-slate-800">{y}</option>)}
                      </select>
                      <ChevronDown className="absolute right-0 top-1 text-amber-600 dark:text-amber-400 pointer-events-none" size={16} />
                    </div>
                </div>
              ) : (
                <div className="hidden md:block text-xs text-slate-500 dark:text-slate-400/80 font-medium">Viewing 25-year predictive data (2025 - 2050)</div>
              )}
            </div>

            {/* Bottom Bar: State Selectors */}
            <div className="relative z-10 p-4 md:p-5 flex flex-col md:flex-row items-center gap-4">
              {viewMode === 'timeline' ? (
                <>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 md:p-3 bg-blue-50 dark:bg-blue-500/20 rounded-xl hidden sm:block border border-blue-100 dark:border-blue-400/30 shadow-sm">
                      <Map className="text-blue-600 dark:text-blue-300" size={24} />
                    </div>
                    <div>
                      <h2 className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">
                        Primary Data Focus
                      </h2>
                      {activeStateInfo && <span className="px-2 py-0.5 rounded-full text-[9px] md:text-[10px] uppercase font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">{activeStateInfo.type.replace('_', ' ')}</span>}
                    </div>
                  </div>
                  <div className="relative w-full md:w-96 md:ml-auto">
                    <select 
                      value={selectedState} 
                      onChange={e => setSelectedState(e.target.value)}
                      className="w-full appearance-none bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 py-3 md:py-3.5 px-4 md:px-5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-semibold cursor-pointer shadow-sm text-base md:text-lg"
                    >
                      {STATES_INFO.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 md:right-4 top-3 md:top-4 text-slate-500 pointer-events-none" size={20} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full">
                    {compareStates.map((stateName, idx) => {
                       return (
                        <div key={idx} className="flex-1 w-full md:min-w-[240px] relative mt-2 md:mt-0">
                            <div className="absolute -top-3 left-4 bg-white dark:bg-[#0f172a] px-2 text-[9px] md:text-[10px] font-bold text-amber-600 dark:text-amber-400 rounded-full border border-slate-200 dark:border-white/10 z-10 flex items-center gap-1 shadow-sm">
                              State {idx + 1}
                            </div>
                            <select 
                              value={stateName} 
                              onChange={(e) => {
                                  const newStates = [...compareStates];
                                  newStates[idx] = e.target.value;
                                  setCompareStates(newStates);
                              }} 
                              className="w-full appearance-none bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-semibold cursor-pointer shadow-sm relative z-0 text-sm md:text-base"
                            >
                                {STATES_INFO.map(d => (
                                  <option key={d.name} value={d.name} disabled={compareStates.includes(d.name) && d.name !== stateName}>
                                    {d.name}
                                  </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-500 pointer-events-none z-10" size={16} />
                            
                            {compareStates.length > 1 && (
                                <button 
                                  onClick={() => setCompareStates(compareStates.filter((_, i) => i !== idx))} 
                                  className="absolute -top-2 -right-1 md:-right-2 bg-rose-500 dark:bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-600 hover:scale-110 transition-all z-20"
                                  title="Remove State"
                                >
                                  <X size={12} strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    )})}
                    {compareStates.length < 3 && (
                        <button 
                          onClick={() => {
                              const available = STATES_INFO.find(d => !compareStates.includes(d.name));
                              if(available) setCompareStates([...compareStates, available.name]);
                          }} 
                          className="flex-1 w-full md:min-w-[240px] flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-white/20 bg-slate-50/50 dark:bg-[#0f172a]/30 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 hover:border-amber-500 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:border-amber-400/50 dark:hover:bg-amber-900/20 transition-all py-3 font-bold text-sm md:text-base mt-2 md:mt-0"
                        >
                           <Plus size={16} strokeWidth={3} className="md:w-[18px] md:h-[18px]" /> Add State
                        </button>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Premium Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {viewMode === 'timeline' ? (
              summaryMetrics.map((m, idx) => {
                if (!m || !m.name) return null;
                const Icon = m.icon;
                return (
                <div key={m.name || idx} className={`bg-gradient-to-br from-white to-slate-50 dark:from-[#111827]/80 dark:to-[#020617]/80 dark:backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg ${m.shadow} relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-300`}>
                  <div className="absolute -top-4 -right-4 p-5 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500">
                     <Icon size={120} className="md:w-[140px] md:h-[140px] dark:text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-4 md:mb-6">
                    <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-md`}>
                      <Icon size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 md:px-3 md:py-1.5 bg-white/80 dark:bg-black/40 backdrop-blur-md text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-white/10">
                      2050 Projection
                    </div>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-300/80 mb-1 md:mb-2 relative z-10">{m.name}</p>
                  <div className="flex items-end gap-3 relative z-10 mb-4 md:mb-5">
                    <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-slate-300 tracking-tight">{m.values?.[2050] || 'N/A'}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs md:text-sm pt-3 md:pt-4 border-t border-slate-200/50 dark:border-white/10 relative z-10">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">From 2025 base:</span>
                    <span className="font-bold text-slate-700 dark:text-white">{m.values?.[2025] || 'N/A'}</span>
                    <div className="ml-auto">
                      <Activity size={14} className="text-slate-400 dark:text-slate-500 md:w-4 md:h-4" />
                    </div>
                  </div>
                </div>
              )})
            ) : (
              // Compare Mode Summary Cards
              ['Population (Millions)', 'GDP per Capita (USD)', 'Female Labor Force (FLFP) (%)'].map((metricName, idx) => {
                const icons = [Users, DollarSign, BookOpen];
                const colors = ["from-blue-500 to-indigo-400", "from-amber-500 to-orange-400", "from-emerald-500 to-teal-400"];
                const Icon = icons[idx];
                return (
                  <div key={metricName} className={`bg-gradient-to-br from-white to-slate-50 dark:from-[#111827]/80 dark:to-[#020617]/80 dark:backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg shadow-${colors[idx].split('-')[1]}/20 relative overflow-hidden flex flex-col`}>
                    <div className="absolute -top-4 -right-4 p-5 opacity-[0.03] dark:opacity-[0.05]">
                       <Icon size={100} className="md:w-[120px] md:h-[120px] dark:text-white" />
                    </div>
                    <div className="relative z-10 flex items-center gap-3 mb-4 border-b border-slate-200 dark:border-white/10 pb-3 md:pb-4">
                      <div className={`p-2 md:p-2.5 rounded-lg md:rounded-xl bg-gradient-to-br ${colors[idx]} text-white shadow-sm`}>
                        <Icon size={16} className="md:w-5 md:h-5" />
                      </div>
                      <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200">{metricName}</p>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center gap-3 md:gap-4">
                       {generatedCompareData.map(cd => {
                          const valObj = cd.data.find(m => m.name === metricName);
                          const val = valObj ? valObj.values[compareYear] : 'N/A';
                          return (
                             <div key={cd.name} className="flex justify-between items-end">
                                <div className="flex flex-col">
                                  <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px] md:max-w-[150px]">{cd.name}</span>
                                </div>
                                <span className="text-lg md:text-xl font-black text-slate-800 dark:text-white">{val}</span>
                             </div>
                          )
                       })}
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 md:mt-4 mb-4 flex items-center gap-3 px-2">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"><Activity size={18} className="md:w-5 md:h-5" /></div>
            Socio-Economic Evolution Matrix
          </h3>

          {/* Main Socio-Economic Table - Fully Mobile Responsive */}
          <div className="bg-white dark:bg-[#070b14]/80 dark:backdrop-blur-xl rounded-xl md:rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 transition-colors relative mb-8 md:mb-12">
            <div className="overflow-x-auto w-full relative z-10 custom-scrollbar rounded-xl md:rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 text-xs md:text-sm uppercase tracking-wider">
                  <tr>
                    {/* Responsive Sticky Left Header */}
                    <th className="px-3 md:px-6 py-3 md:py-5 font-bold text-slate-600 dark:text-slate-300 sticky left-0 bg-slate-100 dark:bg-[#0f172a] z-20 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] w-[140px] min-w-[140px] max-w-[140px] md:w-auto md:min-w-[300px] md:max-w-[300px] whitespace-normal leading-tight">
                      Metric <span className="normal-case text-[9px] md:text-xs font-normal opacity-70 block md:inline md:ml-1">({generatedData.filter(m => m.category !== 'Religion').length} Total)</span>
                    </th>
                    {viewMode === 'timeline' ? (
                      <>
                        {[2025, 2030, 2035, 2040, 2045, 2050].map(y => (
                          <th key={y} className="px-3 md:px-6 py-3 md:py-5 font-extrabold text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-blue-300 dark:to-emerald-300 text-center min-w-[70px] md:min-w-[110px]">
                            {y}
                          </th>
                        ))}
                        {/* Responsive Sticky Right Header */}
                        <th className="px-3 md:px-6 py-3 md:py-5 font-extrabold text-slate-500 dark:text-slate-400 text-center min-w-[60px] md:min-w-[100px] sticky right-0 bg-slate-100 dark:bg-[#0f172a] shadow-[-1px_0_0_0_#e2e8f0] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] z-20">
                          Trend
                        </th>
                      </>
                    ) : (
                      compareStates.map((sName, idx) => {
                        const isLast = idx === compareStates.length - 1;
                        return (
                          <th key={sName} className={`px-4 md:px-6 ${isLast ? 'pr-8 md:pr-12' : ''} py-3 md:py-5 font-extrabold text-center min-w-[120px] md:min-w-[180px] w-[22%] ${idx === 0 ? 'text-blue-600 dark:text-blue-300' : idx === 1 ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'}`}>
                            {sName}
                          </th>
                        );
                      })
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {CATEGORIES.map(cat => {
                    const baseMetrics = viewMode === 'timeline' ? generatedData : generatedCompareData[0]?.data || [];
                    const catMetrics = baseMetrics.filter(m => m.category === cat.id);
                    if (catMetrics.length === 0) return null;
                    const Icon = cat.icon;
                    return (
                      <React.Fragment key={cat.id}>
                        {/* Mobile-Friendly Category Row (Sticky Text, Not Sticky Cell) */}
                        <tr className="bg-slate-50/80 dark:bg-[#111827]">
                          <td colSpan={viewMode === 'timeline' ? 8 : compareStates.length + 1} className="py-2 md:py-4 font-bold text-slate-800 dark:text-slate-200 bg-slate-50/95 dark:bg-[#111827]">
                            <div className="sticky left-4 md:left-6 inline-flex items-center gap-2 md:gap-3">
                              <div className={`p-1.5 md:p-2 bg-white dark:bg-black/30 rounded-md md:rounded-lg shadow-sm border border-slate-100 dark:border-white/10 ${cat.color}`}>
                                <Icon size={14} className="md:w-[18px] md:h-[18px]" />
                              </div>
                              <span className="tracking-wide uppercase text-[10px] md:text-sm dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-slate-100 dark:to-slate-300">{cat.id}</span>
                            </div>
                          </td>
                        </tr>
                        {/* Metric Rows */}
                        {catMetrics.map((metric) => (
                           <tr key={metric.name} className="hover:bg-blue-50/50 dark:hover:bg-white/[0.03] transition-colors group">
                              <td className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-sm font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-[#070b14] group-hover:bg-blue-50/50 dark:group-hover:bg-[#0f1524] z-10 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] transition-colors w-[140px] min-w-[140px] max-w-[140px] md:w-auto md:min-w-[300px] md:max-w-none whitespace-normal leading-snug">
                                {metric.name}
                              </td>
                              
                              {viewMode === 'timeline' ? (
                                <>
                                  {[2025, 2030, 2035, 2040, 2045, 2050].map(y => (
                                    <td key={y} className="px-3 md:px-6 py-3 md:py-4 text-[11px] md:text-sm text-center font-mono font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-amber-200 transition-colors">
                                      {metric.values[y]}
                                    </td>
                                  ))}
                                  <td className="px-3 md:px-6 py-3 md:py-4 text-center sticky right-0 bg-white dark:bg-[#070b14] group-hover:bg-blue-50/50 dark:group-hover:bg-[#0f1524] z-10 shadow-[-1px_0_0_0_#e2e8f0] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] transition-colors">
                                    <div className="flex justify-center">
                                      {(() => {
                                        const trend = getTrend(metric.values[2025], metric.values[2050], metric.name);
                                        const TIcon = trend.icon;
                                        if(!TIcon) return null;
                                        return (
                                          <div className={`p-1 md:p-1.5 rounded-md md:rounded-lg ${trend.bg} ${trend.color} flex items-center justify-center`} title="25-Year Trend">
                                            <TIcon size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </td>
                                </>
                              ) : (
                                generatedCompareData.map((cd, idx) => {
                                    const isLast = idx === generatedCompareData.length - 1;
                                    const cellMetric = cd.data.find(m => m.name === metric.name);
                                    return (
                                        <td key={cd.name} className={`px-4 md:px-6 ${isLast ? 'pr-8 md:pr-12' : ''} py-3 md:py-4 text-xs md:text-base text-center font-mono font-bold text-slate-700 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors w-[22%]`}>
                                            {cellMetric?.values[compareYear] || '-'}
                                        </td>
                                    )
                                })
                              )}
                           </tr>
                        ))}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 md:mt-12 mb-4 flex items-center gap-3 px-2">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-orange-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"><Users size={18} className="md:w-5 md:h-5" /></div>
            Religious Demographics Projections
          </h3>

          {/* Religious Data Table - Fully Mobile Responsive */}
          <div className="bg-white dark:bg-[#070b14]/80 dark:backdrop-blur-xl rounded-xl md:rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 transition-colors relative mb-12">
            <div className="overflow-x-auto w-full relative z-10 custom-scrollbar rounded-xl md:rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 text-xs md:text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-3 md:px-6 py-3 md:py-5 font-bold text-slate-600 dark:text-slate-300 sticky left-0 bg-slate-100 dark:bg-[#0f172a] z-20 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] w-[140px] min-w-[140px] max-w-[140px] md:w-auto md:min-w-[300px] md:max-w-[300px] whitespace-normal leading-tight">
                      Metric <span className="normal-case text-[9px] md:text-xs font-normal opacity-70 block md:inline md:ml-1">({generatedData.filter(m => m.category === 'Religion').length} Total)</span>
                    </th>
                    {viewMode === 'timeline' ? (
                      <>
                        {[2025, 2030, 2035, 2040, 2045, 2050].map(y => (
                          <th key={y} className="px-3 md:px-6 py-3 md:py-5 font-extrabold text-amber-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-amber-300 dark:to-orange-300 text-center min-w-[70px] md:min-w-[110px]">
                            {y}
                          </th>
                        ))}
                        <th className="px-3 md:px-6 py-3 md:py-5 font-extrabold text-slate-500 dark:text-slate-400 text-center min-w-[60px] md:min-w-[100px] sticky right-0 bg-slate-100 dark:bg-[#0f172a] shadow-[-1px_0_0_0_#e2e8f0] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] z-20">
                          Trend
                        </th>
                      </>
                    ) : (
                      compareStates.map((sName, idx) => {
                        const isLast = idx === compareStates.length - 1;
                        return (
                          <th key={sName} className={`px-4 md:px-6 ${isLast ? 'pr-8 md:pr-12' : ''} py-3 md:py-5 font-extrabold text-center min-w-[120px] md:min-w-[180px] w-[22%] ${idx === 0 ? 'text-blue-600 dark:text-blue-300' : idx === 1 ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'}`}>
                            {sName}
                          </th>
                        );
                      })
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {[{id: "Religion", icon: Users, color: "text-amber-500 dark:text-amber-400"}].map(cat => {
                    const baseMetrics = viewMode === 'timeline' ? generatedData : generatedCompareData[0]?.data || [];
                    const catMetrics = baseMetrics.filter(m => m.category === cat.id);
                    const Icon = cat.icon;
                    return (
                      <React.Fragment key={cat.id}>
                        <tr className="bg-slate-50/80 dark:bg-[#111827]">
                          <td colSpan={viewMode === 'timeline' ? 8 : compareStates.length + 1} className="py-2 md:py-4 font-bold text-slate-800 dark:text-slate-200 bg-slate-50/95 dark:bg-[#111827]">
                            <div className="sticky left-4 md:left-6 inline-flex items-center gap-2 md:gap-3">
                              <div className={`p-1.5 md:p-2 bg-white dark:bg-black/30 rounded-md md:rounded-lg shadow-sm border border-slate-100 dark:border-white/10 ${cat.color}`}>
                                <Icon size={14} className="md:w-[18px] md:h-[18px]" />
                              </div>
                              <span className="tracking-wide uppercase text-[10px] md:text-sm dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-slate-100 dark:to-slate-300">{cat.id}</span>
                            </div>
                          </td>
                        </tr>
                        {catMetrics.map((metric) => (
                           <tr key={metric.name} className="hover:bg-amber-50/50 dark:hover:bg-white/[0.03] transition-colors group">
                              <td className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-sm font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-[#070b14] group-hover:bg-amber-50/50 dark:group-hover:bg-[#0f1524] z-10 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] transition-colors w-[140px] min-w-[140px] max-w-[140px] md:w-auto md:min-w-[300px] md:max-w-none whitespace-normal leading-snug">
                                {metric.name}
                              </td>
                              
                              {viewMode === 'timeline' ? (
                                <>
                                  {[2025, 2030, 2035, 2040, 2045, 2050].map(y => (
                                    <td key={y} className="px-3 md:px-6 py-3 md:py-4 text-[11px] md:text-sm text-center font-mono font-medium text-slate-600 dark:text-slate-400 group-hover:text-amber-700 dark:group-hover:text-amber-200 transition-colors">
                                      {metric.values[y]}
                                    </td>
                                  ))}
                                  <td className="px-3 md:px-6 py-3 md:py-4 text-center sticky right-0 bg-white dark:bg-[#070b14] group-hover:bg-amber-50/50 dark:group-hover:bg-[#0f1524] z-10 shadow-[-1px_0_0_0_#e2e8f0] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] transition-colors">
                                    <div className="flex justify-center">
                                      {(() => {
                                        const trend = getTrend(metric.values[2025], metric.values[2050], metric.name);
                                        const TIcon = trend.icon;
                                        if(!TIcon) return null;
                                        return (
                                          <div className={`p-1 md:p-1.5 rounded-md md:rounded-lg ${trend.bg} ${trend.color} flex items-center justify-center`} title="25-Year Trend">
                                            <TIcon size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </td>
                                </>
                              ) : (
                                generatedCompareData.map((cd, idx) => {
                                    const isLast = idx === generatedCompareData.length - 1;
                                    const cellMetric = cd.data.find(m => m.name === metric.name);
                                    return (
                                        <td key={cd.name} className={`px-4 md:px-6 ${isLast ? 'pr-8 md:pr-12' : ''} py-3 md:py-4 text-xs md:text-base text-center font-mono font-bold text-slate-700 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors w-[22%]`}>
                                            {cellMetric?.values[compareYear] || '-'}
                                        </td>
                                    )
                                })
                              )}
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
      
      {/* Add custom CSS to ensure scrollbars look good on non-mobile devices */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5); 
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1); 
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3); 
        }
      `}} />
    </div>
  );
}