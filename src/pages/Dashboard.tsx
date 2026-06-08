import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, PackageX, Clock, AlertCircle, ChevronRight, FileText, Factory, Loader2, Rocket, Settings, Store, CheckCircle2, TrendingUp, MessageSquare, DollarSign, Calendar, ListTodo, Plus, BrainCircuit } from 'lucide-react';
import { MetricCard } from '../components/ui/MetricCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { useRepositories } from '../repositories/RepositoryProvider';
import { DashboardSummary, DashboardAlert, DashboardActivity, DashboardInsight, Order } from '../domain/types';
import { BusinessIntelligenceEngine } from '../components/dashboard/BusinessIntelligenceEngine';
import { MultiUnitDashboard } from '../components/dashboard/MultiUnitDashboard';
import { BRAND } from '../lib/brand';
import { formatBRL, formatNumber } from '../lib/format';
import { EmptyState } from '../components/ui/EmptyState';

export function Dashboard() {
  const { dashboardRepo, settingsRepo, orderRepo, crmRepo } = useRepositories();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [insights, setInsights] = useState<DashboardInsight[]>([]);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [periodDays, setPeriodDays] = useState<number>(7);

  useEffect(() => {
    loadData();
  }, [dashboardRepo, settingsRepo, orderRepo, crmRepo, periodDays]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, alts, ins, profile, orders, leads] = await Promise.all([
        dashboardRepo.getSummary({ periodDays }),
        dashboardRepo.getAlerts(),
        dashboardRepo.getInsights ? dashboardRepo.getInsights() : Promise.resolve([]),
        settingsRepo.getProfile(),
        orderRepo.getOrders(),
        Promise.resolve([])
      ]);
      setSummary(sum);
      setAlerts(alts);
      setInsights(ins);
      setRecentOrders(orders);
      setRecentLeads(leads);
      
      if (!profile.name || profile.name === 'Minha Empresa' || profile.name === BRAND.tenantName) {
         setIsOnboarding(true);
      } else {
         setIsOnboarding(false);
      }

      // Generate chart data from real orders based on selected period limits
      const lastDays = Array.from({length: periodDays}).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (periodDays - 1 - i));
        return {
          name: d.getDate().toString() + '/' + (d.getMonth() + 1),
          recebido: 0,
          previsto: 0,
          dateString: d.toDateString()
        };
      });

      orders.forEach(o => {
        const orderDate = new Date(o.date).toDateString();
        const day = lastDays.find(d => d.dateString === orderDate);
        if (day) {
          day.recebido += o.total;
          day.previsto += o.total * 1.1; // simulated projection
        }
      });
      setRevenueData(lastDays);

      
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onNavigateAndDispatch = (page: string, payload?: any) => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  const completeStep = (step: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: step }));
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-8 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
             <Skeleton className="h-9 w-24" />
             <Skeleton className="h-9 w-24" />
             <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
           <Skeleton className="h-72 lg:col-span-2 w-full" />
           <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <Card className="max-w-lg mx-auto mt-20 border-red-500/20 bg-red-500/5 text-center">
        <CardContent className="pt-10 pb-8 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-500 mb-2">Erro ao carregar Dashboard</h3>
          <p className="text-zinc-400 mb-6">{error || 'Verifique sua conexão ou configuração.'}</p>
          <Button variant="danger" onClick={loadData}>Tentar Novamente</Button>
        </CardContent>
      </Card>
    );
  }

  if (isOnboarding) {
     return (
       <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 mt-10">
         <Card className="p-8 text-center shadow-xl border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(197,152,104,0.1)] relative z-10">
               <Rocket size={32} />
            </div>
            <h2 className="text-3xl font-heading font-semibold text-zinc-50 mb-3 relative z-10">Bem-vindo ao {BRAND.name}!</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 relative z-10">O seu Command Center está quase pronto. Finalize as configurações básicas para decolar.</p>

            <div className="flex flex-col gap-3 text-left relative z-10">
               <div role="button" tabIndex={0} onClick={() => completeStep('config')} onKeyDown={(e) => e.key === 'Enter' && completeStep('config')} className="bg-zinc-950/80 backdrop-blur border border-zinc-800 p-4 rounded-xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all flex items-center gap-4 group cursor-pointer">
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-colors">
                     <Settings size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-zinc-50 mb-0.5 group-hover:text-amber-400 transition-colors">Perfil da Empresa</h4>
                    <p className="text-xs text-zinc-400">Nome, CNPJ e logo oficial.</p>
                  </div>
                  <ChevronRight size={18} className="text-zinc-600 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
               </div>
               
               <div role="button" tabIndex={0} onClick={() => completeStep('catalogo')} onKeyDown={(e) => e.key === 'Enter' && completeStep('catalogo')} className="bg-zinc-950/80 backdrop-blur border border-zinc-800 p-4 rounded-xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all flex items-center gap-4 group cursor-pointer">
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-colors">
                     <PackageX size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-zinc-50 mb-0.5 group-hover:text-amber-400 transition-colors">Primeiro Produto</h4>
                    <p className="text-xs text-zinc-400">Cadastre o seu carro-chefe.</p>
                  </div>
                  <ChevronRight size={18} className="text-zinc-600 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
               </div>
               
               <div role="button" tabIndex={0} onClick={() => completeStep('digital_menu')} onKeyDown={(e) => e.key === 'Enter' && completeStep('digital_menu')} className="bg-zinc-950/80 backdrop-blur border border-zinc-800 p-4 rounded-xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all flex items-center gap-4 group cursor-pointer">
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-colors">
                     <Store size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-zinc-50 mb-0.5 group-hover:text-amber-400 transition-colors">Cardápio Digital</h4>
                    <p className="text-xs text-zinc-400">Prepare sua vitrine para clientes.</p>
                  </div>
                  <ChevronRight size={18} className="text-zinc-600 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
               </div>
            </div>
            
            <div className="mt-8 relative z-10">
               <Button variant="ghost" onClick={() => setIsOnboarding(false)} className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors p-2 h-auto">Pular onboarding e ir para o Dashboard</Button>
            </div>
         </Card>
       </div>
     );
  }

  // Quick Action Buttons
  const quickActions = [
    { label: 'Novo Pedido', icon: Store, action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'comercial' })) },
    { label: 'Despesa', icon: DollarSign, action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'financeiro' })) },
    { label: 'Estoque', icon: PackageX, action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'estoque' })) },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 p-4 md:p-8 pt-10 md:pt-12 animate-in fade-in duration-500">
      
      {/* Dynamic Greeting */}
      <PageHeader 
        title="Command Center"
        description="Resumo diário da sua operação, saúde financeira e próximos passos."
        action={
          <div className="flex gap-3">
             <select 
               className="bg-zinc-900 border border-zinc-800 text-sm rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-amber-500"
               value={periodDays}
               onChange={e => setPeriodDays(Number(e.target.value))}
             >
               <option value={1}>Hoje</option>
               <option value={7}>Últimos 7 dias</option>
               <option value={30}>Últimos 30 dias</option>
               <option value={90}>Personalizado (90 dias)</option>
             </select>
            {quickActions.map((action, idx) => (
               <Button key={idx} variant="outline" size="sm" onClick={action.action} className="gap-2">
                  <action.icon size={16} />
                  <span className="hidden sm:inline">{action.label}</span>
               </Button>
            ))}
          </div>
        }
      />

      <MultiUnitDashboard />

      {/* Metric Cards - Command Center Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard 
          title="Faturamento"
          value={formatBRL(summary.faturamentoMes)}
          trend="+12% vs anterior"
          trendUp={true}
          subtitle={`Meta: ${formatBRL(summary.metaFaturamento)}`}
        />

        <MetricCard 
          title="Margem Bruta"
          value={`${summary.margemBruta.toFixed(1)}%`}
          trend="-2% vs anterior"
          trendUp={false}
          subtitle="Projeção Atual"
        />

        <MetricCard 
          title="Contas a Receber"
          value={<span className="text-amber-500">{formatBRL(summary.contasReceber)}</span>}
          trend="+5% vs anterior"
          trendUp={true}
          subtitle="Ativos Vencendo"
        />

        <Card className="p-5 flex flex-col justify-between group hover:border-red-500/30 cursor-pointer overflow-hidden relative" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'estoque' }))}>
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all group-hover:scale-110">
            <PackageX size={80} />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Estoque Crítico</div>
            <div className="text-2xl lg:text-3xl font-heading font-semibold text-zinc-50 tracking-tight transition-transform group-hover:scale-[1.02] origin-left">
              {summary.estoqueCritico} <span className="text-base text-zinc-500 font-normal">itens</span>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800">
              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${summary.estoqueCritico > 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                {summary.estoqueCritico > 0 ? (
                  <><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Alerta</>
                ) : (
                  <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Estável</>
                )}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: Main Flow & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">Fluxo de Caixa <TrendingUp size={16} className="text-zinc-500"/></CardTitle>
                <p className="text-sm text-zinc-400 mt-1">Recebido x Previsto (Mês Atual)</p>
              </div>
            </CardHeader>
            <CardContent>
              {revenueData.every(d => d.recebido === 0 && d.previsto === 0) ? (
                 <div className="h-72 w-full mt-4 flex items-center justify-center text-sm text-zinc-500">
                    Sem dados suficientes no período.
                 </div>
              ) : (
                <div className="h-72 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#71717A' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#71717A' }}
                        tickFormatter={(val) => `R$ ${val/1000}k`}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(244, 244, 245, 0.05)' }}
                        contentStyle={{ backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid #27272a', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                        labelStyle={{ fontWeight: 600, color: '#fafafa', marginBottom: '4px' }}
                        itemStyle={{ color: '#a1a1aa' }}
                      />
                      <Bar dataKey="recebido" name="Recebido" fill="#C59868" radius={[4, 4, 0, 0]} barSize={24} />
                      <Bar dataKey="previsto" name="Previsto a Receber" fill="#27272a" stroke="#100C08" strokeWidth={1} radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-2 text-base text-zinc-100"><MessageSquare size={16} className="text-amber-500" /> Conversas & Vendas</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-zinc-400">Total de Leads Ativos</span>
                       <span className="font-mono text-zinc-100">{recentLeads.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-zinc-400">Pedidos Fechados</span>
                       <span className="font-mono font-medium text-amber-500">{recentOrders.filter(o => o.status === 'Pago' || o.status === 'Preparando').length}</span>
                    </div>
                    <div className="pt-4 mt-2 border-t border-zinc-800">
                       <Button variant="ghost" size="sm" className="w-full text-xs text-amber-500" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'crm' }))}>Ir para o CRM Completo &rarr;</Button>
                    </div>
                 </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-2 text-base text-zinc-100"><ListTodo size={16} className="text-amber-500" /> Ordens Mais Recentes</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                    {recentOrders.slice(0, 2).map((order) => (
                      <div key={order.id} className="flex items-center justify-between text-sm">
                         <span className="text-zinc-400 truncate pr-2 capitalize">{order.customer.split(' ')[0]} - {formatBRL(order.total)}</span>
                         <span className={`text-[10px] uppercase tracking-wider px-2 flex-shrink-0 py-0.5 rounded border font-bold ${
                            order.status === 'Novo' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            order.status === 'Atrasado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-zinc-800 text-zinc-400 border-zinc-700'
                         }`}>{order.status}</span>
                      </div>
                    ))}
                    {recentOrders.length === 0 && (
                      <p className="text-sm text-zinc-500 text-center py-2">Sem pedidos recentes.</p>
                    )}
                    <div className="pt-4 mt-2 border-t border-zinc-800">
                       <Button variant="ghost" size="sm" className="w-full text-xs text-amber-500" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'comercial' }))}>Ver todos os pedidos &rarr;</Button>
                    </div>
                 </div>
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Col 3: Action Center & Alerts */}
        <div className="space-y-6">
          <BusinessIntelligenceEngine onNavigate={onNavigateAndDispatch} summary={summary} />
        </div>

      </div>
    </div>
  );
}
