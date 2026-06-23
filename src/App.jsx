import React, { useState } from 'react';
import { useWaterBalance } from './hooks/useWaterBalance';
import { MatrixChart } from './components/MatrixChart';
import { portoAlegreMatrix } from './data/portoAlegreMatrix';
import { KpiCard } from './components/KpiCard';

// Amostra real de dados históricos horários de chuva (Porto Alegre)
const dataHistoricaChuva = [
  { date: '01/01 00:00', precipitation: 0.0 },
  { date: '01/01 01:00', precipitation: 0.0 },
  { date: '01/01 02:00', precipitation: 0.0 },
  { date: '01/01 03:00', precipitation: 0.0 },
  { date: '01/01 04:00', precipitation: 0.0 },
  { date: '01/01 05:00', precipitation: 0.0 },
  { date: '01/01 06:00', precipitation: 0.0 },
  { date: '01/01 07:00', precipitation: 0.2 },
  { date: '01/01 08:00', precipitation: 1.4 },
  { date: '01/01 09:00', precipitation: 12.8 },
  { date: '01/01 10:00', precipitation: 5.4 },
  { date: '01/01 11:00', precipitation: 0.0 },
  { date: '01/01 12:00', precipitation: 0.0 },
  { date: '01/01 13:00', precipitation: 0.0 },
  { date: '01/01 14:00', precipitation: 3.2 },
  { date: '01/01 15:00', precipitation: 0.0 }
];

export default function App() {
  // Parâmetros de controle ajustados para as novas faixas pedidas
  const [area, setArea] = useState(100); // Valor padrão inicial: 100m²
  const [capacity, setCapacity] = useState(1000); // Valor padrão inicial: 1000L
  const [demand, setDemand] = useState(30); // Demanda da casa em L/hora

  // Processamento dinâmico em tempo real usando o algoritmo YSA
  const cenarioCheio = useWaterBalance(dataHistoricaChuva, {
    area,
    reservoirCapacity: capacity,
    demand,
    initialFull: true
  });

  const cenarioVazio = useWaterBalance(dataHistoricaChuva, {
    area,
    reservoirCapacity: capacity,
    demand,
    initialFull: false
  });

  const erroRealtime = Math.abs(cenarioCheio.summary.failureRate - cenarioVazio.summary.failureRate);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      <header className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/40">
            Simulador Dinâmico (Algoritmo YSA)
          </span>
          <h1 className="text-3xl font-black text-white mt-2 tracking-tight">Dimensionamento de Reservatórios</h1>
          <p className="text-slate-400 text-sm mt-0.5">Simulação comportamental integrada com variação de Demanda e Área.</p>
        </div>
      </header>

      {/* Painel de Filtros Atualizado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Área de Captação (A)</label>
          <select 
            value={area} 
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-semibold text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value={50}>50 m²</option>
            <option value={100}>100 m²</option>
            <option value={150}>150 m²</option>
            <option value={200}>200 m²</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Volume do Reservatório (V)</label>
          <select 
            value={capacity} 
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-semibold text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value={500}>500 Litros</option>
            <option value={1000}>1000 Litros</option>
            <option value={3000}>3000 Litros</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Demanda da Casa (L/hora)</label>
          <input 
            type="number" 
            value={demand} 
            onChange={(e) => setDemand(Math.max(0, Number(e.target.value)))}
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-semibold text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="Ex: 30"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Coeficiente de Runoff (c)</label>
          <div className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-semibold text-sm text-emerald-400">
            0.95 <span className="text-xs text-slate-500 font-normal ml-1">(Fixo Telhado)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard 
          title="Falhas (Início Cheio)" 
          value={`${cenarioCheio.summary.totalFailures} vezes`} 
          subtext={`Taxa real: ${cenarioCheio.summary.failureRate}%`}
          type="blue"
        />
        <KpiCard 
          title="Falhas (Início Vazio)" 
          value={`${cenarioVazio.summary.totalFailures} vezes`} 
          subtext={`Taxa real: ${cenarioVazio.summary.failureRate}%`}
          type="red"
        />
        <KpiCard 
          title="Variação de Taxa" 
          value={`${erroRealtime.toFixed(2)}%`} 
          subtext="Erro dinâmico de partida"
          type={erroRealtime > 0 ? 'emerald' : 'default'}
        />
        <KpiCard 
          title="Volume Total Falhado" 
          value={`${cenarioVazio.summary.totalVolumeFailed} L`} 
          subtext="Déficit acumulado de captação"
          type="default"
        />
      </div>

      <div className="grid grid-cols-1 bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-white">Referência Geral da Planilha (Série Histórica Consolidada)</h2>
          <p className="text-xs text-slate-400 mt-0.5">Demonstrativo comparativo global para a área selecionada de {area}m²</p>
        </div>
        <div className="h-80 mt-6">
          <MatrixChart data={portoAlegreMatrix} areaKey={area.toString()} />
        </div>
      </div>

    </div>
  );
}