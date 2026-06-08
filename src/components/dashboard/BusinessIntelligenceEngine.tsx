import React from 'react';
import { BrainCircuit, Activity, TrendingDown, TrendingUp, AlertTriangle, ChevronRight, Zap, Target, ShieldAlert, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatBRL } from '../../lib/format';

interface BiEngineProps {
  onNavigate: (page: string, data?: any) => void;
  summary: any;
}

export function BusinessIntelligenceEngine({ onNavigate, summary }: BiEngineProps) {
  if (!summary) {
    return (
      <div className="space-y-6">
         <Card className="border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent relative overflow-hidden">
            <CardContent className="p-6 text-center text-sm text-zinc-500">
               Dados insuficientes para análise
            </CardContent>
         </Card>
      </div>
    );
  }

  // Calculate health score dynamically
  let healthScore = 100;
  const fatDiff = ((summary.faturamentoMes / summary.metaFaturamento) * 100).toFixed(0);
  
  if (summary.faturamentoMes < summary.metaFaturamento) {
    healthScore -= 15;
  }
  if (summary.margemBruta < 40) {
    healthScore -= 10;
  }
  if (summary.estoqueCritico > 0) {
    healthScore -= 10;
  }
  if (summary.consignacoesVencidas > 0) {
    healthScore -= 5;
  }
  
  const healthStatus = healthScore >= 80 ? 'Excelente' : healthScore >= 60 ? 'Atenção' : 'Crítico';
  const healthColor = healthScore >= 80 ? 'text-emerald-500' : healthScore >= 60 ? 'text-amber-500' : 'text-red-500';

  const forecast = summary.faturamentoMes * 1.15; // Simple simulation

  let textStatus = `A operação está performando com ${fatDiff}% da meta. `;
  if (summary.estoqueCritico > 0) {
      textStatus += `Requer atenção: ${summary.estoqueCritico} itens críticos no estoque.`;
  } else {
      textStatus += `Lucratividade saudável.`;
  }

  return (
    <div className="space-y-6">
      {/* Health Score & Forecasting */}
      <Card className="border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BrainCircuit size={18} className="text-amber-500" />
            Intelligence Engine
          </CardTitle>
          <div className="flex items-center gap-2 bg-zinc-950 px-2.5 py-1 rounded-full border border-zinc-800">
             <div className={`w-2 h-2 rounded-full ${healthScore >= 60 ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
             <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Motor Ativo</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center justify-center relative">
               <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                  <circle 
                     cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                     className={healthColor}
                     strokeDasharray={175} 
                     strokeDashoffset={175 - (175 * healthScore) / 100}
                     strokeLinecap="round"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-heading font-bold text-zinc-50">{healthScore}</span>
               </div>
            </div>
            <div>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Health Score</p>
               <h3 className={`text-base font-semibold ${healthColor}`}>{healthStatus}</h3>
               <p className="text-xs text-zinc-400 mt-0.5 max-w-[200px]">{textStatus}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/50">
             <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                   <Target size={14} className="text-blue-400"/>
                   <span className="text-[10px] font-semibold uppercase tracking-wider">Forecast 30d</span>
                </div>
                <div className="text-sm font-semibold text-zinc-100">{formatBRL(forecast)}</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp size={10} /> +8% vs real</div>
             </div>
             
             <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                   <ShieldAlert size={14} className="text-red-400"/>
                   <span className="text-[10px] font-semibold uppercase tracking-wider">Anomalias</span>
                </div>
                <div className="text-sm font-semibold text-zinc-100">{summary.consignacoesVencidas > 0 ? `${summary.consignacoesVencidas} Consignações` : 'Nenhuma'}</div>
                <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">{summary.consignacoesVencidas > 0 ? <><TrendingDown size={10} className="text-red-400" /> Atrasadas</> : 'Estável'}</div>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest px-1">Recomendações</h3>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-amber-500/30 transition-colors group cursor-pointer" onClick={() => onNavigate('estoque')}>
           <div className="flex gap-3">
              <div className="mt-0.5 p-1.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                 <Zap size={14} />
              </div>
              <div>
                 <h4 className="text-sm font-medium text-zinc-100 group-hover:text-amber-500 transition-colors">Aumente o estoque de Café Especial</h4>
                 <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Modelo preditivo indica pico de demanda de 40% na próxima semana devido a sazonalidade. Faltam 15 un para o giro seguro.</p>
              </div>
           </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-red-500/30 transition-colors group cursor-pointer" onClick={() => onNavigate('crm')}>
           <div className="flex gap-3">
              <div className="mt-0.5 p-1.5 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 shrink-0">
                 <AlertTriangle size={14} />
              </div>
              <div>
                 <h4 className="text-sm font-medium text-zinc-100 group-hover:text-red-400 transition-colors">3 clientes B2B em risco de churn</h4>
                 <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Empório Vila, Café Central e Padaria Pão de Ouro não fazem pedidos há mais de 25 dias (média normal: 14 dias).</p>
                 <span className="inline-flex items-center text-[10px] font-bold text-red-400 mt-2 uppercase tracking-wide gap-1">
                    Ativar campanha de retenção <ChevronRight size={10} />
                 </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
