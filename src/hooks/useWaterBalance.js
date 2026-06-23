import { useMemo } from 'react';

export const useWaterBalance = (precipitationData, options) => {
  const { area, reservoirCapacity, demand, initialFull, runoffCoef = 0.95 } = options;

  return useMemo(() => {
    if (!precipitationData || precipitationData.length === 0) {
      return { 
        simulationMatrix: [], 
        summary: { totalFailures: 0, totalVolumeFailed: 0, failureRate: '0.00' } 
      };
    }

    // Inicialização da condição de partida (Equação de contorno)
    let currentVolume = initialFull ? reservoirCapacity : 0;
    let totalFailures = 0;
    let totalVolumeFailed = 0;

    const simulationMatrix = precipitationData.map((row) => {
      // 1. EQUAÇÃO 3.1: Cálculo do volume captado
      const vCaptado = row.precipitation * area * runoffCoef;
      const previousVolume = currentVolume;

      // 2. EQUAÇÕES 3.4 e 3.5: Verificação de Falhas
      let failure = false;
      let volumeFailed = 0;
      let abastecimento = demand;

      if (previousVolume < demand) {
        failure = true;
        volumeFailed = demand - previousVolume; // Déficit ou volume falhado
        abastecimento = previousVolume;        // Abastece apenas o que tinha disponível
        totalFailures++;
        totalVolumeFailed += volumeFailed;
      }

      // 3. EQUAÇÃO 3.3: Balanço Hídrico Final com limitação de V_max (Transbordo/Spillage)
      // V_t = min( V_max , max(0, V_t-1 - D_t) + V_captado,t )
      const volumePosDemanda = Math.max(0, previousVolume - demand);
      let nextVolume = Math.min(reservoirCapacity, volumePosDemanda + vCaptado);

      currentVolume = nextVolume;

      return {
        date: row.date,
        precipitation: row.precipitation,
        rainVolume: vCaptado,
        previousVolume,
        currentVolume: nextVolume,
        failure,
        volumeFailed,
        abastecimento
      };
    });

    const failureRate = (totalFailures / precipitationData.length) * 100;

    return {
      simulationMatrix,
      summary: {
        totalFailures,
        totalVolumeFailed: Math.round(totalVolumeFailed),
        failureRate: failureRate.toFixed(2)
      }
    };
  }, [precipitationData, area, reservoirCapacity, demand, initialFull, runoffCoef]);
};