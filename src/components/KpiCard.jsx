import React from 'react';

export const KpiCard = ({ title, value, subtext, type = 'default' }) => {
  const borderColors = {
    default: 'border-slate-800 bg-slate-900',
    blue: 'border-blue-500/30 bg-gradient-to-b from-slate-900 to-blue-950/40',
    red: 'border-red-500/30 bg-gradient-to-b from-slate-900 to-red-950/40',
    emerald: 'border-emerald-500/30 bg-gradient-to-b from-slate-900 to-emerald-950/40'
  };

  const textColors = {
    default: 'text-white',
    blue: 'text-blue-400',
    red: 'text-red-400',
    emerald: 'text-emerald-400'
  };

  return (
    <div className={`border p-5 rounded-xl shadow-lg transition-all hover:scale-[1.02] ${borderColors[type]}`}>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
      <p className={`text-2xl font-black mt-1.5 ${textColors[type]}`}>{value}</p>
      {subtext && <span className="text-[11px] text-slate-500 block mt-1 planetary-sub" >{subtext}</span>}
    </div>
  );
};