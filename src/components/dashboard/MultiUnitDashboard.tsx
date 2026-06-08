import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Store, TrendingUp, TrendingDown, ArrowRightLeft, Trophy, BarChart2 } from 'lucide-react';
import { formatBRL } from '../../lib/format';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function MultiUnitDashboard() {
   const data = [
      { name: 'Matriz (Torrefação)', vendas: 125000, meta: 120000, nps: 88, status: 'up' },
      { name: 'Filial Centro', vendas: 85000, meta: 80000, nps: 92, status: 'up' },
      { name: 'Filial Shopping', vendas: 45000, meta: 60000, nps: 78, status: 'down' },
   ];

   return (
      <div className="space-y-6 mb-8 animate-in fade-in duration-500">
         <div className="flex items-center gap-2 mb-2">
            <Store size={20} className="text-amber-500" />
            <h2 className="text-lg font-heading font-semibold text-zinc-100">Inteligência Multi-Unidade</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                     <BarChart2 size={16} className="text-emerald-500" />
                     Comparativo Lado a Lado (Faturamento vs Meta)
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="h-[250px] mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} tickFormatter={(v) => `R$${v/1000}k`} />
                           <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} formatter={(val: any) => formatBRL(val)} />
                           <Bar dataKey="vendas" name="Vendas Atuais" fill="#C59868" radius={[4, 4, 0, 0]} barSize={32} />
                           <Bar dataKey="meta" name="Meta Mês" fill="#27272a" stroke="#528F65" strokeWidth={1} radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-6">
               <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                        <Trophy size={16} className="text-amber-500" />
                        Ranking de Performance
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                     <div className="space-y-4">
                        {data.sort((a,b) => b.vendas - a.vendas).map((store, i) => (
                           <div key={i} className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
                              <div className="flex items-center gap-3">
                                 <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${i===0 ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                                    {i+1}
                                 </div>
                                 <span className="text-xs font-medium text-zinc-100">{store.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-mono font-medium text-zinc-400">{formatBRL(store.vendas)}</span>
                                 {store.status === 'up' ? <TrendingUp size={14} className="text-emerald-500"/> : <TrendingDown size={14} className="text-red-500"/>}
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                  <CardContent className="p-4 flex gap-4">
                     <div className="shrink-0 p-2 bg-amber-500/20 rounded-lg text-amber-500 h-fit">
                        <ArrowRightLeft size={20} />
                     </div>
                     <div>
                        <h4 className="text-sm font-semibold text-zinc-100 mb-1">Transferência Sugerida</h4>
                        <p className="text-xs text-zinc-400 mb-3">A Filial Shopping está com baixo giro de Café Especial (Excesso). A Filial Centro tem ruptura iminente.</p>
                        <button className="text-xs font-semibold bg-zinc-900 text-amber-500 px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors w-full border border-amber-500/30">
                           Transferir 12 un (Shopping &rarr; Centro)
                        </button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
