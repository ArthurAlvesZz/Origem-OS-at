import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, HelpCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatBRL } from '../../lib/format';

export function ScenarioModeling() {
  const [activeScenario, setActiveScenario] = useState<'base' | 'pessimista' | 'otimista'>('base');

  const baseData = [
    { month: 'Jun', value: 45000 },
    { month: 'Jul', value: 48000 },
    { month: 'Ago', value: 52000 },
    { month: 'Set', value: 55000 },
    { month: 'Out', value: 60000 },
    { month: 'Nov', value: 65000 },
  ];

  const pessimistaData = [
    { month: 'Jun', value: 45000 },
    { month: 'Jul', value: 41000 },
    { month: 'Ago', value: 39000 },
    { month: 'Set', value: 38000 },
    { month: 'Out', value: 35000 },
    { month: 'Nov', value: 32000 },
  ];

  const otimistaData = [
    { month: 'Jun', value: 45000 },
    { month: 'Jul', value: 55000 },
    { month: 'Ago', value: 68000 },
    { month: 'Set', value: 85000 },
    { month: 'Out', value: 105000 },
    { month: 'Nov', value: 130000 },
  ];

  const getData = () => {
    switch(activeScenario) {
      case 'otimista': return otimistaData;
      case 'pessimista': return pessimistaData;
      default: return baseData;
    }
  };

  const currentData = getData();
  const lastValue = currentData[currentData.length -1].value;
  const firstValue = currentData[0].value;
  const growth = ((lastValue - firstValue) / firstValue) * 100;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/50">
         <div>
            <CardTitle className="text-base flex items-center gap-2 text-zinc-100">
               <Activity size={16} className="text-amber-500" />
               Modelagem de Cenários (Projeção 6 meses)
            </CardTitle>
            <p className="text-sm text-zinc-400 mt-1">Previsão baseada em custos fixos e taxas de crescimento selecionadas.</p>
         </div>
         <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 mt-4 sm:mt-0">
            <button 
               onClick={() => setActiveScenario('pessimista')}
               className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeScenario === 'pessimista' ? 'bg-red-500/20 text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
               Pessimista (-15% a.m)
            </button>
            <button 
               onClick={() => setActiveScenario('base')}
               className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeScenario === 'base' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
               Base (+10% a.m)
            </button>
            <button 
               onClick={() => setActiveScenario('otimista')}
               className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeScenario === 'otimista' ? 'bg-emerald-500/20 text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
               Otimista (+25% a.m)
            </button>
         </div>
      </CardHeader>
      <CardContent className="pt-6">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorOti" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#C59868" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#C59868" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorPess" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} tickFormatter={(val) => `R$${val/1000}k`} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                     formatter={(value: number) => [formatBRL(value), 'Caixa Projetado']}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="value" 
                     stroke={activeScenario === 'otimista' ? '#10B981' : activeScenario === 'pessimista' ? '#EF4444' : '#C59868'} 
                     fillOpacity={1} 
                     fill={activeScenario === 'otimista' ? 'url(#colorOti)' : activeScenario === 'pessimista' ? 'url(#colorPess)' : 'url(#colorBase)'}
                     strokeWidth={3}
                   />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
            
            <div className="space-y-4 flex flex-col justify-center">
               <div className="bg-zinc-950/50 p-4 border border-zinc-800 rounded-xl">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider mb-1">Caixa ao final do período</div>
                  <div className={`text-2xl font-bold font-heading ${activeScenario === 'otimista' ? 'text-emerald-500' : activeScenario === 'pessimista' ? 'text-red-500' : 'text-zinc-100'}`}>
                     {formatBRL(lastValue)}
                  </div>
                  <div className={`text-xs mt-1 font-medium ${growth >= 0 ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-1`}>
                     {growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                     {growth > 0 ? '+' : ''}{growth.toFixed(1)}% projetado
                  </div>
               </div>

               <div className="bg-zinc-950/50 p-4 border border-zinc-800 rounded-xl">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider mb-2 flex items-center gap-1">
                     <HelpCircle size={12} /> O que isso significa?
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                     {activeScenario === 'base' && 'Cenário provável baseado no histórico dos últimos 3 meses considerando a sazonalidade padrão.'}
                     {activeScenario === 'otimista' && 'Cenário agressivo. Pressupõe sucesso completo nas campanhas de marketing em andamento e aumento da retenção.'}
                     {activeScenario === 'pessimista' && 'Cenário de estresse. Pressupõe queda de vendas por fatores externos, mantendo todos os custos fixos atuais.'}
                  </p>
               </div>
            </div>
         </div>
      </CardContent>
    </Card>
  );
}
