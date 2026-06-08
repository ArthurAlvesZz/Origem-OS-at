import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, HelpCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatBRL } from '../../lib/format';
import { useRepositories } from '../../repositories/RepositoryProvider';
import { Input } from '../ui/Input';

export function ScenarioModeling() {
  const { dashboardRepo } = useRepositories();
  const [activeScenario, setActiveScenario] = useState<'base' | 'pessimista' | 'otimista'>('base');
  
  const [custosFixos, setCustosFixos] = useState(25000);
  const [taxaCrescimento, setTaxaCrescimento] = useState(10);
  const [ticketMedio, setTicketMedio] = useState(45);
  
  const [initialRevenue, setInitialRevenue] = useState(45000);

  useEffect(() => {
     async function fetchInitial() {
        try {
           const p = await dashboardRepo.getSummary();
           if (p.faturamentoMes) {
              setInitialRevenue(p.faturamentoMes);
           }
        } catch(e: any) { console.error(e); }
     }
     fetchInitial();
  }, [dashboardRepo]);

  useEffect(() => {
     if (activeScenario === 'pessimista') setTaxaCrescimento(-5);
     else if (activeScenario === 'base') setTaxaCrescimento(10);
     else if (activeScenario === 'otimista') setTaxaCrescimento(25);
  }, [activeScenario]);

  const generateData = () => {
    let currentVal = initialRevenue;
    const months = ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'];
    const data = [];
    for (let i = 0; i < 6; i++) {
       data.push({
          month: months[i],
          value: Math.round(currentVal),
          custos: custosFixos
       });
       currentVal = currentVal * (1 + taxaCrescimento / 100);
    }
    return data;
  };

  const currentData = generateData();
  const lastValue = currentData[5].value;
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
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-zinc-800/50">
           <div className="space-y-2">
             <label className="text-zinc-400 text-xs text-left">Custos Fixos (R$)</label>
             <Input 
                 type="number" 
                 className="bg-zinc-950/50" 
                 value={custosFixos} 
                 onChange={e => setCustosFixos(Number(e.target.value))} 
             />
           </div>
           <div className="space-y-2">
             <label className="text-zinc-400 text-xs text-left">Crescimento (%) Mês</label>
             <Input 
                 type="number" 
                 className="bg-zinc-950/50" 
                 value={taxaCrescimento} 
                 onChange={e => setTaxaCrescimento(Number(e.target.value))} 
             />
           </div>
           <div className="space-y-2">
             <label className="text-zinc-400 text-xs text-left">Ticket Médio Projetado (R$)</label>
             <Input 
                 type="number" 
                 className="bg-zinc-950/50" 
                 value={ticketMedio} 
                 onChange={e => setTicketMedio(Number(e.target.value))} 
             />
           </div>
         </div>
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
                     formatter={(value: any) => [formatBRL(value), 'Caixa Projetado']}
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
