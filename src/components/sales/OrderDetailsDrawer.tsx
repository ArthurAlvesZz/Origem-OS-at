import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Package, Truck, Printer, Copy, RefreshCcw } from 'lucide-react';
import { Order } from '../../domain/types';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { formatBRL } from '../../lib/format';

interface OrderDetailsDrawerProps {
  order: Order;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function OrderDetailsDrawer({ order, onClose, onEdit, onCancel }: OrderDetailsDrawerProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ x: '100%', opacity: 0.5 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: '100%', opacity: 0.5 }} 
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full md:w-[600px] h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
            <div>
              <h2 className="text-lg font-heading font-semibold text-zinc-50 flex items-center gap-2">
                Pedido {order.id.split('-').pop() || order.id}
                <StatusBadge 
                  status={order.status} 
                  variant={order.status === 'Pago' ? 'success' : order.status === 'Parcial' ? 'warning' : order.status === 'Cancelado' ? 'error' : 'default'} 
                />
              </h2>
              <p className="text-sm text-zinc-400 mt-1">{new Date(order.date).toLocaleString('pt-BR')}</p>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            
            {/* Customer Info */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest mb-3">Cliente</h3>
              <div className="text-zinc-100 text-base">{order.customer}</div>
              <div className="text-zinc-400 text-sm mt-1">Avulso / Consumidor Final</div>
            </section>

            {/* Items */}
            <section>
               <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest mb-3">Itens do Pedido ({order.items})</h3>
               <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800 whitespace-nowrap overflow-x-auto">
                 <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="bg-zinc-950/20 text-xs">
                       <tr>
                          <th className="px-4 py-2">Item</th>
                          <th className="px-4 py-2">Qtd</th>
                          <th className="px-4 py-2 text-right">Total</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td className="px-4 py-3 text-zinc-100">Café Especial {order.id}</td>
                          <td className="px-4 py-3">{order.items} un</td>
                          <td className="px-4 py-3 text-right">{formatBRL(order.total)}</td>
                       </tr>
                    </tbody>
                 </table>
               </div>
            </section>

            {/* Financial Summary */}
            <section className="flex flex-col items-end gap-1 border-t border-zinc-800 pt-4">
               <div className="flex justify-between w-full max-w-xs text-sm text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatBRL(order.total)}</span>
               </div>
               <div className="flex justify-between w-full max-w-xs text-sm text-emerald-500">
                  <span>Descontos</span>
                  <span>- {formatBRL(0)}</span>
               </div>
               <div className="flex justify-between w-full max-w-xs text-lg font-bold text-zinc-100 mt-2">
                  <span>Total</span>
                  <span>{formatBRL(order.total)}</span>
               </div>
            </section>

            {/* Timeline Mock */}
            <section>
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest mb-4">Timeline</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-zinc-900 text-zinc-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <CheckCircle size={14} className="text-emerald-500"/>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-900 p-4 rounded border border-zinc-800 shadow">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-zinc-100">Pedido Criado</div>
                      <time className="text-[10px] uppercase text-zinc-500">{new Date(order.date).toLocaleDateString()}</time>
                    </div>
                    <div className="text-zinc-400 text-xs text-left">Pedido iniciado via PDV.</div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row gap-3">
             <Button variant="outline" className="flex-1" onClick={onCancel}><X size={16} className="mr-2"/> Cancelar Pedido</Button>
             <Button variant="outline" className="flex-1" onClick={onEdit}><RefreshCcw size={16} className="mr-2"/> Editar / Atualizar</Button>
             <Button variant="primary" className="flex-1" onClick={() => window.print()}><Printer size={16} className="mr-2"/> Imprimir</Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
