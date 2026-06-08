import React, { useState } from 'react';
import { Store, ChevronDown, Check, Building2, Layers, Factory } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStoreContext } from '../../contexts/StoreContext';

export function StoreSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeStoreId: selectedUnit, setActiveStoreId: setSelectedUnit } = useStoreContext();

  const units = [
    { id: 'consolidado', name: 'Visão Consolidada', icon: Layers, type: 'all' },
    { id: 'matriz', name: 'Matriz - Torrefação', icon: Factory, type: 'hq' },
    { id: 'filial_1', name: 'Filial Centro (Cafeteria)', icon: Store, type: 'store' },
    { id: 'filial_2', name: 'Filial Shopping', icon: Store, type: 'store' },
  ];

  const current = units.find(u => u.id === selectedUnit) || units[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all text-sm group"
      >
        <current.icon size={14} className="text-amber-500" />
        <span className="font-semibold text-zinc-100 hidden sm:inline">{current.name}</span>
        <span className="font-semibold text-zinc-100 sm:hidden">Global</span>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col p-1"
          >
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800/50 mb-1">
              Multi-Unidade
            </div>
            {units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => { setSelectedUnit(unit.id); setIsOpen(false); }}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors w-full text-left ${
                  selectedUnit === unit.id 
                    ? 'bg-amber-500/10 text-amber-500 font-medium' 
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <unit.icon size={14} className={selectedUnit === unit.id ? 'text-amber-500' : 'text-zinc-500'} />
                  <span className="truncate">{unit.name}</span>
                </div>
                {selectedUnit === unit.id && <Check size={14} />}
              </button>
            ))}
            <div className="border-t border-zinc-800 mt-1 pt-1">
               <button disabled className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 w-full transition-colors opacity-50 cursor-not-allowed">
                  <Building2 size={12} /> Gerenciar Filiais
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
