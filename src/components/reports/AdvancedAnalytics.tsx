import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Users, ArrowRight, Zap, Skull, TrendingUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatBRL } from '../../lib/format';

export function AdvancedAnalytics() {
  // Mock data for Funnel
  const funnelData = [
    { name: 'Visitantes Menu', value: 1250 },
    { name: 'Carrinho Iniciado', value: 450 },
    { name: 'Checkout Acessado', value: 280 },
    { name: 'Venda Concluída', value: 110 }
  ];

  // Mock data for RFM Segmentation
  const rfmData = [
    { name: 'Champions', value: 15, fill: '#10B981' },
    { name: 'Loyal', value: 35, fill: '#C59868' },
    { name: 'At Risk', value: 25, fill: '#F59E0B' },
    { name: 'Lost', value: 25, fill: '#EF4444' }
  ];

  // Mock Cohort Data (Retention matrix)
  const cohortMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top row: Funnel and RFM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Funil de Conversão */}
         <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
               <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
                  <Target size={16} className="text-amber-500" />
                  Funil de Conversão (B2C)
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4 pt-2">
                 {funnelData.map((step, idx) => {
                   const max = funnelData[0].value;
                   const pct = Math.round((step.value / max) * 100);
                   const isLast = idx === funnelData.length - 1;
                   return (
                     <div key={idx} className="relative">
                        <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-1">
                           <span>{step.name}</span>
                           <span>{step.value} <span className="text-zinc-500 font-normal">({pct}%)</span></span>
                        </div>
                        <div className="h-4 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                           <div 
                             className={`h-full ${isLast ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                             style={{ width: `${pct}%` }} 
                           />
                        </div>
                        {!isLast && <div className="absolute -bottom-4 left-4 text-zinc-600"><ChevronDown size={14} /></div>}
                     </div>
                   );
                 })}
               </div>
            </CardContent>
         </Card>

         {/* Segmentação RFM */}
         <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
               <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
                  <Users size={16} className="text-amber-500" />
                  Segmentação RFM (Base B2B)
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="h-[200px] mt-2">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={rfmData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#27272a" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} width={80} />
                     <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} />
                     <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {rfmData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Cohort Matrix */}
      <Card className="bg-zinc-900 border-zinc-800">
         <CardHeader>
            <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
               <TrendingUp size={16} className="text-amber-500" />
               Cohort Analysis (Retenção Mês a Mês)
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr>
                     <th className="py-2 px-3 text-[10px] uppercase font-bold text-zinc-500">Mês Aquisição</th>
                     <th className="py-2 px-3 text-[10px] uppercase font-bold text-zinc-500">Mês 0</th>
                     <th className="py-2 px-3 text-[10px] uppercase font-bold text-zinc-500">Mês 1</th>
                     <th className="py-2 px-3 text-[10px] uppercase font-bold text-zinc-500">Mês 2</th>
                     <th className="py-2 px-3 text-[10px] uppercase font-bold text-zinc-500">Mês 3</th>
                     <th className="py-2 px-3 text-[10px] uppercase font-bold text-zinc-500">Mês 4</th>
                     <th className="py-2 px-3 text-[10px] uppercase font-bold text-zinc-500">Mês 5</th>
                   </tr>
                 </thead>
                 <tbody className="text-xs">
                    {cohortMonths.map((month, i) => {
                       const base = 100;
                       return (
                          <tr key={month} className="border-t border-zinc-800 hover:bg-zinc-800/30">
                             <td className="py-2 px-3 font-semibold text-zinc-300">{month} 2023</td>
                             <td className="py-2 px-3">
                                <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-mono block text-center">100%</span>
                             </td>
                             {Array.from({length: 5}).map((_, j) => {
                                if (i + j >= 5) return <td key={j} className="py-2 px-3 text-center text-zinc-700">-</td>;
                                const val = Math.max(30, 100 - (j+1) * 15 - Math.random() * 10);
                                const pct = val.toFixed(0);
                                const opacity = val / 100;
                                return (
                                   <td key={j} className="py-2 px-3">
                                      <span className="text-zinc-950 px-2 py-0.5 rounded font-mono block text-center" style={{ backgroundColor: `rgba(197, 152, 104, ${opacity})` }}>
                                         {pct}%
                                      </span>
                                   </td>
                                )
                             })}
                          </tr>
                       )
                    })}
                 </tbody>
               </table>
            </div>
         </CardContent>
      </Card>

      {/* LTV & Churn Pred */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3 border-b border-zinc-800/50">
               <CardTitle className="text-sm text-zinc-300">LTV por Cliente (Média 12m)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-center">
               <div className="text-3xl font-heading font-bold text-emerald-400">{formatBRL(4850)}</div>
               <p className="text-xs text-zinc-500 mt-2">Custo de Aquisição (CAC): {formatBRL(350)}</p>
               <div className="mt-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-medium text-emerald-500">
                  Razão LTV/CAC: 13.8x (Excelente)
               </div>
            </CardContent>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3 border-b border-zinc-800/50">
               <CardTitle className="text-sm text-zinc-300">Churn Prediction (Machine Learning)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-center">
               <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                     <Skull size={20} />
                  </div>
                  <div className="text-left">
                     <span className="block text-2xl font-bold font-heading text-red-500">4.2%</span>
                     <span className="text-xs text-zinc-500 uppercase font-semibold">Risco no próximo trimestre</span>
                  </div>
               </div>
               <div className="mt-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs tracking-wide text-red-400 font-medium">
                  Modelo sinaliza 4 clientes exigindo ação imediata no CRM.
               </div>
            </CardContent>
         </Card>
      </div>

    </div>
  );
}
