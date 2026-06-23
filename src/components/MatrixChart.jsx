import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const MatrixChart = ({ data, areaKey }) => {
  const chartData = data.map(item => {
    const targetArea = item[`area${areaKey}`];
    return {
      volume: item.volume,
      'Reservatório Cheio': targetArea.cheio,
      'Reservatório Vazio': targetArea.vazio,
    };
  });

  return (
    <div className="w-full h-full min-h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="volume" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ fontSize: 13 }}
            labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          <Bar dataKey="Reservatório Cheio" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Início Cheio (%)" />
          <Bar dataKey="Reservatório Vazio" fill="#ef4444" radius={[4, 4, 0, 0]} name="Início Vazio (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};