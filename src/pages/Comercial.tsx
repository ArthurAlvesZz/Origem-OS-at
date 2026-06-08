import { formatBRL } from '../lib/format';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Plus, Search, Filter, ShoppingBag, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NewSaleDrawer } from '../components/sales/NewSaleDrawer';
import { useRepositories } from '../repositories/RepositoryProvider';
import { Order } from '../domain/types';
import { Pagination } from '../components/ui/Pagination';
import { OrderDetailsDrawer } from '../components/sales/OrderDetailsDrawer';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { exportToCSV } from '../lib/export';
import { Skeleton } from '../components/ui/Skeleton';

export function Comercial() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [periodFilter, setPeriodFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { orderRepo } = useRepositories();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setLoading(true);
    orderRepo.getOrders().then(res => {
        setOrders(res);
        setLoading(false);
    });
  }, [orderRepo, refreshKey]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#nova-venda') {
        setIsDrawerOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    handleHashChange(); // Check on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSaleComplete = () => {
    setIsDrawerOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const filteredOrders = orders.filter(o => {
     const textMatch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       o.id.toLowerCase().includes(searchTerm.toLowerCase());
     const statusMatch = statusFilter === 'Todos' || o.status === statusFilter;
     
     // basic mock period
     let periodMatch = true;
     if (periodFilter === 'Hoje') {
        periodMatch = new Date(o.date).toDateString() === new Date().toDateString();
     }
     
     // mock type match
     const isB2b = o.customer !== 'Cliente Avulso (PDV)' && o.customer !== 'Consumidor Final';
     const typeMatch = typeFilter === 'Todos' || (typeFilter === 'B2B' && isB2b) || (typeFilter === 'B2C' && !isB2b);

     return textMatch && statusMatch && periodMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const hoje = new Date().toDateString();
  const ordersHoje = orders.filter(o => new Date(o.date).toDateString() === hoje);
  const totalHoje = ordersHoje.reduce((acc, curr) => acc + curr.total, 0);
  const ticketsHoje = ordersHoje.length;
  const ticketMedioHoje = ticketsHoje > 0 ? totalHoje / ticketsHoje : 0;
  const ticketMaxHoje = ticketsHoje > 0 ? Math.max(...ordersHoje.map(o => o.total)) : 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, periodFilter, typeFilter]);

  if (loading) {
     return (
       <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-[500px] w-full" />
       </div>
     );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500" key={refreshKey}>
      <PageHeader 
        title="Comercial & PDV" 
        description="Gestão de vendas, controle de caixa e histórico de pedidos B2B/B2C." 
        action={
          <Button onClick={() => setIsDrawerOpen(true)} variant="primary" size="lg">
            <ShoppingBag size={18} /> Nova Venda
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Vendido Hoje</div>
          <div className="text-2xl font-heading font-semibold text-zinc-50">{formatBRL(totalHoje)}</div>
        </Card>
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Tickets Hoje</div>
          <div className="text-2xl font-heading font-semibold text-zinc-50">{ticketsHoje}</div>
        </Card>
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Ticket Médio</div>
          <div className="text-2xl font-heading font-semibold text-zinc-50">{formatBRL(ticketMedioHoje)}</div>
        </Card>
        <Card className="p-5 flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Ticket Máximo</div>
          <div className="text-2xl font-heading font-semibold text-zinc-50">{formatBRL(ticketMaxHoje)}</div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-10 w-full sm:w-auto">
        <div className="flex-1 w-full max-w-xl">
          <Input 
            icon={<Search size={18} className="text-zinc-500" />}
            placeholder="Buscar pedido, cliente ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-zinc-900 border border-zinc-800 text-sm rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-amber-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="Todos">Status (Todos)</option>
          <option value="Pago">Pago</option>
          <option value="Pendente">Pendente</option>
          <option value="Preparando">Preparando</option>
          <option value="Entregue">Entregue</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        <select 
          className="bg-zinc-900 border border-zinc-800 text-sm rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-amber-500"
          value={periodFilter}
          onChange={e => setPeriodFilter(e.target.value)}
        >
          <option value="Todos">Período (Todos)</option>
          <option value="Hoje">Hoje</option>
        </select>
        <select 
          className="bg-zinc-900 border border-zinc-800 text-sm rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-amber-500"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="Todos">Tipo (Todos)</option>
          <option value="B2B">B2B (Atacado)</option>
          <option value="B2C">B2C (Varejo)</option>
        </select>
        <Button variant="outline" className="gap-2 sm:w-auto w-full justify-center" onClick={() => exportToCSV(filteredOrders, 'pedidos', [
          { key: 'id', label: 'ID do Pedido' },
          { key: 'createdAt', label: 'Data' },
          { key: 'customer', label: 'Cliente' },
          { key: 'total', label: 'Total (Centavos)' },
          { key: 'status', label: 'Status' }
        ])}>
          <Download size={16} className="text-zinc-500" /> Exportar CSV
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Pedido</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4 font-medium pl-8">Status Comercial</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-zinc-100 group-hover:text-amber-500 transition-colors uppercase cursor-pointer" onClick={() => setSelectedOrder(order)}>{order.id.split('-').pop() || order.id}</span>
                  </td>
                  <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-medium text-zinc-100">{order.customer}</td>
                  <td className="px-6 py-4 text-emerald-500 font-medium text-right">{formatBRL(order.total)}</td>
                  <td className="px-6 py-4 pl-8">
                    <StatusBadge 
                      status={order.status} 
                      variant={order.status === 'Pago' ? 'success' : order.status === 'Parcial' ? 'warning' : order.status === 'Cancelado' ? 'error' : 'default'} 
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                       <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded transition-colors" title="Ver Detalhes">
                         <Eye size={16} />
                       </button>
                       <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-zinc-800 rounded transition-colors" title="Editar">
                         <Edit size={16} />
                       </button>
                       <button onClick={() => { if(confirm('Tem certeza que deseja cancelar este pedido?')) { orderRepo.updateOrderStatus(order.id, 'Cancelado').then(() => setRefreshKey(k=>k+1)) } }} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded transition-colors" title="Cancelar Pedido">
                         <Trash2 size={16} />
                       </button>
                     </div>
                  </td>
                </tr>
              ))}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-0 border-none">
                    <div className="py-16 flex items-center justify-center">
                    <EmptyState
                      icon={<ShoppingBag size={32} className="text-zinc-600" />}
                      title="Nenhuma venda registrada"
                      description="Nenhum pedido encontrado. Clique no botão Nova Venda acima para começar a registrar."
                    />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredOrders.length > 0 && (
           <Pagination 
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={setCurrentPage}
             itemsPerPage={itemsPerPage}
             totalItems={filteredOrders.length}
           />
        )}
      </Card>

      {isDrawerOpen && (
        <NewSaleDrawer 
          onClose={() => setIsDrawerOpen(false)} 
          onComplete={handleSaleComplete} 
        />
      )}

      {selectedOrder && (
        <OrderDetailsDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onEdit={() => {/* TODO */}}
          onCancel={() => {
             if(confirm('Cancelar pedido?')) {
                orderRepo.updateOrderStatus(selectedOrder.id, 'Cancelado').then(() => {
                   setRefreshKey(k=>k+1);
                   setSelectedOrder(null);
                });
             }
          }}
        />
      )}
    </div>
  );
}
