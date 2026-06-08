import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Download, Calculator, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatBRL } from '../../lib/format';

interface DRECategory {
  id: string;
  name: string;
  value: number;
  type: 'revenue' | 'expense' | 'result';
  isBold?: boolean;
  subcategories?: { name: string; value: number }[];
}

export function DynamicDRE() {
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const toggleCat = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const dreData: DRECategory[] = [
    { 
       id: 'rec_bruta', name: 'Receita Operacional Bruta', value: 125000, type: 'revenue', isBold: true,
       subcategories: [
          { name: 'Venda de Produtos (B2C)', value: 85000 },
          { name: 'Pedidos B2B', value: 30000 },
          { name: 'Consignação Faturada', value: 10000 },
       ]
    },
    { 
       id: 'deducoes', name: 'Deduções da Receita Bruta', value: -12500, type: 'expense',
       subcategories: [
          { name: 'Devoluções/Cancelamentos', value: -2500 },
          { name: 'Impostos (Simples Nacional)', value: -10000 },
       ]
    },
    { id: 'rec_liquida', name: 'Receita Operacional Líquida', value: 112500, type: 'result', isBold: true },
    { 
       id: 'cmv', name: 'Custos dos Produtos (CMV)', value: -38000, type: 'expense',
       subcategories: [
          { name: 'Café Verde (Insumo)', value: -20000 },
          { name: 'Embalagens', value: -5000 },
          { name: 'Insumos Terceiros (Leite etc)', value: -13000 },
       ]
    },
    { id: 'lucro_bruto', name: 'Lucro Bruto', value: 74500, type: 'result', isBold: true },
    { 
       id: 'desp_op', name: 'Despesas Operacionais', value: -42000, type: 'expense',
       subcategories: [
          { name: 'Folha de Pagamento', value: -25000 },
          { name: 'Aluguel & Condomínio', value: -8000 },
          { name: 'Sistemas & Software', value: -1500 },
          { name: 'Marketing & Ads', value: -3500 },
          { name: 'Energia / Água / Net', value: -4000 },
       ]
    },
    { id: 'ebitda', name: 'EBITDA (LAJIDA)', value: 32500, type: 'result', isBold: true },
    { 
       id: 'depre', name: 'Depreciação', value: -2000, type: 'expense',
       subcategories: [ { name: 'Máquinas de Espresso', value: -2000 } ]
    },
    { id: 'lucro_liquido', name: 'Lucro Líquido do Exercício', value: 30500, type: 'result', isBold: true },
  ];

  const margins = [
    { name: 'Café Especial 250g', margin: 68 },
    { name: 'Espresso Simples', margin: 85 },
    { name: 'Cheesecake', margin: 42 },
    { name: 'Torra B2B (Kg)', margin: 35 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/50">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-zinc-100">
              <Calculator size={16} className="text-amber-500" />
              DRE Dinâmico & Analítico
            </CardTitle>
            <p className="text-sm text-zinc-400 mt-1">Navegue pelas subcategorias e entenda exatamente onde o dinheiro está.</p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <Download size={14} /> Exportar DRE
          </Button>
        </CardHeader>
        <CardContent className="pt-0 px-0">
           <div className="overflow-x-auto">
              <table className="w-full text-sm">
                 <tbody>
                    {dreData.map(cat => {
                       const isExpanded = expandedCats[cat.id];
                       const hasSub = cat.subcategories && cat.subcategories.length > 0;
                       
                       let textColor = 'text-zinc-300';
                       if (cat.type === 'result') textColor = 'text-amber-500';
                       if (cat.id === 'lucro_liquido') textColor = 'text-emerald-500';

                       return (
                          <React.Fragment key={cat.id}>
                             <tr className={`border-b border-zinc-800/50 ${cat.isBold ? 'bg-zinc-900/80 font-semibold' : 'bg-zinc-900'} hover:bg-zinc-800/50 transition-colors cursor-pointer`}
                                 onClick={() => hasSub && toggleCat(cat.id)}>
                                <td className={`p-4 ${textColor} flex items-center gap-2`}>
                                   {hasSub ? (isExpanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />) : <div className="w-3.5"/>}
                                   {cat.name}
                                </td>
                                <td className={`p-4 text-right font-mono ${cat.value < 0 ? 'text-red-400' : textColor}`}>
                                   {formatBRL(cat.value)}
                                </td>
                             </tr>
                             {isExpanded && cat.subcategories?.map((sub, idx) => (
                                <tr key={idx} className="bg-zinc-950/50 border-b border-zinc-800/30 text-xs">
                                   <td className="py-2.5 px-4 pl-10 text-zinc-400 border-l-2 border-zinc-700 ml-4">
                                      {sub.name}
                                   </td>
                                   <td className="py-2.5 px-4 text-right font-mono text-zinc-500">
                                      {formatBRL(sub.value)}
                                   </td>
                                </tr>
                             ))}
                          </React.Fragment>
                       )
                    })}
                 </tbody>
              </table>
           </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
         <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3 border-b border-zinc-800/50">
               <CardTitle className="text-sm flex items-center gap-2 text-zinc-100">
                  <BarChart3 size={16} className="text-emerald-500" />
                  Margem por Produto
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
               {margins.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                     <div className="flex justify-between text-xs font-medium">
                        <span className="text-zinc-300">{m.name}</span>
                        <span className={m.margin > 50 ? 'text-emerald-400' : 'text-amber-500'}>{m.margin}%</span>
                     </div>
                     <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                        <div className={`h-full ${m.margin > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${m.margin}%` }} />
                     </div>
                  </div>
               ))}
               <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-amber-500">Ver análise completa</Button>
               </div>
            </CardContent>
         </Card>

         <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <TrendingUp size={64} />
            </div>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm text-zinc-100">Inteligência Financeira</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-xs text-zinc-400 leading-relaxed mb-4">A margem bruta média caiu 2% neste mês. O fator principal foi o aumento de 15% no custo do Insumo (Leite). Sugerimos repassar 5% no cardápio na próxima semana para manter a lucratividade desejada.</p>
               <Button size="sm" className="w-full text-xs font-semibold">Simular Repasse</Button>
            </CardContent>
         </Card>
      </div>

    </div>
  );
}
