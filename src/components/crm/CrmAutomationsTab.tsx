import React, { useState, useEffect } from 'react';
import { Zap, Plus, Workflow, ArrowRight, Save, Clock, MessageCircle, Package, UserCheck, BellRing, Settings2 } from 'lucide-react';
import { CrmAutomationRecord } from '../../repositories/interfaces/ICrmRepository';
import { ICrmRepository } from '../../repositories/interfaces/ICrmRepository';
import { Button } from '../ui/Button';

export function CrmAutomationsTab({ crmRepo }: { crmRepo: ICrmRepository }) {
     const [automations, setAutomations] = useState<CrmAutomationRecord[]>([]);
     const [newAutoName, setNewAutoName] = useState('');
     const [editingAutomation, setEditingAutomation] = useState<string | null>(null);

     const loadData = async () => {
         const a = await crmRepo.getAutomations();
         setAutomations(a);
     };

     useEffect(() => { loadData(); }, [crmRepo]);

     const handleCreateAutomation = async () => {
         if (!newAutoName) return;
         try {
             await crmRepo.createAutomation({ name: newAutoName, trigger: 'Novo Lead B2B', actionsJson: '[]', active: true });
             setNewAutoName('');
             loadData();
         } catch(e) {}
     };

     const renderAutomationBuilder = (automation: CrmAutomationRecord) => {
        return (
           <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Workflow size={200} />
               </div>
               
               <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                     <button onClick={() => setEditingAutomation(null)} className="text-zinc-500 hover:text-zinc-100 flex items-center gap-1 text-xs uppercase tracking-wider font-bold">
                        &larr; Voltar
                     </button>
                     <h3 className="text-lg font-heading font-semibold text-zinc-100">{automation.name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">Status</span>
                        <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${automation.active ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-800'}`}>
                           <div className={`w-4 h-4 rounded-full shadow-sm bg-emerald-500 transform ${automation.active ? 'translate-x-5' : 'bg-zinc-500'}`} />
                        </div>
                     </div>
                     <Button size="sm" className="bg-amber-500 text-zinc-950 font-semibold gap-2">
                        <Save size={14} /> Salvar Fluxo
                     </Button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                  <div className="col-span-1 border-r border-zinc-800 pr-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                     <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-2">Triggers (Gatilhos)</div>
                     
                     <div className="bg-zinc-900 border border-zinc-700/50 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-amber-500/50 transition-colors">
                        <Package size={16} className="text-amber-500"/>
                        <span className="text-xs font-medium text-zinc-300">Estoque Crítico</span>
                     </div>
                     <div className="bg-zinc-900 border border-zinc-700/50 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-amber-500/50 transition-colors">
                        <UserCheck size={16} className="text-amber-500"/>
                        <span className="text-xs font-medium text-zinc-300">Novo Lead Entrou</span>
                     </div>
                     <div className="bg-zinc-900 border border-zinc-700/50 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-amber-500/50 transition-colors">
                        <Clock size={16} className="text-amber-500"/>
                        <span className="text-xs font-medium text-zinc-300">Boleto Vencido</span>
                     </div>

                     <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-2 mt-6">Actions (Ações)</div>
                     
                     <div className="bg-zinc-900 border border-zinc-700/50 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-blue-500/50 transition-colors border-dashed">
                        <MessageCircle size={16} className="text-blue-500"/>
                        <span className="text-xs font-medium text-zinc-300">Msg WhatsApp</span>
                     </div>
                     <div className="bg-zinc-900 border border-zinc-700/50 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition-colors border-dashed">
                        <Settings2 size={16} className="text-emerald-500"/>
                        <span className="text-xs font-medium text-zinc-300">Mudar Fase Funil</span>
                     </div>
                     <div className="bg-zinc-900 border border-zinc-700/50 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-purple-500/50 transition-colors border-dashed">
                        <BellRing size={16} className="text-purple-500"/>
                        <span className="text-xs font-medium text-zinc-300">Alerta p/ Vendedor</span>
                     </div>
                  </div>

                  <div className="col-span-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-8 flex flex-col items-center justify-start min-h-[400px]">
                     
                     {/* Workflow visualizer */}
                     <div className="flex flex-col items-center">
                        <div className="bg-zinc-950 border border-amber-500/50 px-6 py-3 rounded-xl shadow-lg flex flex-col items-center relative group min-w-[250px]">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">Gatilho (IF)</span>
                           <span className="text-sm font-semibold text-zinc-100">{automation.trigger}</span>
                           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Settings2 size={12} className="text-zinc-500 cursor-pointer hover:text-zinc-300" />
                           </div>
                        </div>

                        <div className="h-10 w-px bg-zinc-700 my-1"></div>
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center -my-2 z-10 text-[10px] font-bold text-zinc-500">AND</div>
                        <div className="h-10 w-px bg-zinc-700 my-1"></div>

                        <div className="bg-zinc-950 border border-blue-500/30 px-6 py-3 rounded-xl shadow-lg flex flex-col items-center relative group min-w-[250px]">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Condição (WAIT)</span>
                           <span className="text-sm font-semibold text-zinc-100">Aguardar 3 dias</span>
                        </div>

                        <div className="h-10 w-px bg-zinc-700 my-1 relative">
                           <ArrowRight size={14} className="absolute bottom-0 text-zinc-500 transform translate-y-1/2 -ml-1 border-white" style={{ writingMode: 'vertical-lr' }} />
                        </div>

                        <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-xl shadow-lg flex flex-col items-center relative group min-w-[250px] cursor-pointer hover:bg-emerald-500/20 transition-colors">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Ação (THEN)</span>
                           <span className="text-sm font-semibold text-emerald-100 text-center">Enviar "Follow-up Inativos" (WhatsApp)</span>
                           <p className="text-[10px] text-zinc-400 mt-1 italic font-mono">"{'{'}nome_cliente{'}'}, sentimos sua falta..."</p>
                        </div>

                        <div className="h-10 w-px bg-zinc-700 my-1 border-dashed relative"></div>

                        <button className="w-10 h-10 rounded-full border border-dashed border-zinc-600 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-500 transition-colors">
                           <Plus size={16} />
                        </button>
                     </div>

                  </div>
               </div>
           </div>
        );
     };

     if (editingAutomation) {
        const auto = automations.find(a => a.id === editingAutomation);
        if (auto) return renderAutomationBuilder(auto);
     }

     return (
         <div className="space-y-6">
             <div className="flex items-center gap-2 mb-6 text-zinc-300 text-sm">
                <Zap size={16} className="text-amber-500" />
                <p>Crie regras operacionais (Triggers e Actions) que funcionam no background.</p>
             </div>

             <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                 <input 
                     className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 flex-1 focus:border-amber-500 outline-none transition-colors w-full" 
                     placeholder="Nome do novo fluxo (ex: Follow-up 3 dias)..." 
                     value={newAutoName}
                     onChange={e => setNewAutoName(e.target.value)}
                 />
                 <Button onClick={handleCreateAutomation} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-6 py-3 h-auto font-bold uppercase tracking-widest text-[11px] w-full sm:w-auto shadow-[0_0_15px_rgba(197,152,104,0.2)]">
                     <Plus size={14} className="mr-2 inline" /> Criar Macro
                 </Button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                 {automations.map(a => (
                     <div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm hover:border-zinc-700 transition-colors flex flex-col">
                         <div className="flex justify-between items-start mb-4">
                             <h3 className="font-heading font-semibold text-zinc-100 pr-4 leading-tight">{a.name}</h3>
                             <div className={`w-8 h-4 rounded-full flex items-center px-0.5 justify-end shrink-0 ${a.active ? 'bg-emerald-500/20' : 'bg-zinc-800/50'}`}>
                                <div className={`w-3 h-3 rounded-full shadow-sm ${a.active ? 'bg-emerald-500' : 'bg-zinc-600'}`}></div>
                             </div>
                         </div>
                         <div className="bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 mb-4 inline-block self-start">
                             <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-2 font-mono">
                                 <Zap size={12} /> {a.trigger}
                             </div>
                         </div>
                         
                         <p className="text-xs text-zinc-500 mb-6 flex-1">Fluxo configurado com 2 etapas. Dispara ações automaticamente ao dectar o gatilho.</p>
                         
                         <div className="border-t border-zinc-800 pt-4">
                             <Button onClick={() => setEditingAutomation(a.id)} variant="outline" className="w-full text-xs hover:text-amber-500 flex items-center justify-between group">
                                <span>Editar Workflow</span>
                                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                             </Button>
                         </div>
                     </div>
                 ))}
             </div>
             {automations.length === 0 && (
                <div className="text-center bg-zinc-900/50 border border-zinc-800/50 rounded-xl py-16 text-sm">
                   <Workflow size={32} className="mx-auto text-zinc-700 mb-4" />
                   <p className="text-zinc-400">Nenhum fluxo automático cadastrado</p>
                   <p className="text-xs text-zinc-500 mt-2">Comece criando gatilhos para economizar horas da operação.</p>
                </div>
             )}
         </div>
     );
}
