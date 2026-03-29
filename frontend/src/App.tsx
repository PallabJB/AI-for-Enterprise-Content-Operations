import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileEdit, 
  ShieldCheck, 
  Globe2, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight,
  Settings,
  Bell,
  Search,
  Zap,
  Clock,
  LayoutDashboard,
  Layers,
  X,
  Languages,
  MoreVertical,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from './api';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreating, setIsCreating] = useState(false);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New Workflow State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedChannels, setSelectedChannels] = useState(['LinkedIn', 'Twitter']);
  const [selectedLocales, setSelectedLocales] = useState(['EN-US', 'ES-ES']);

  const channelsList = ['LinkedIn', 'Twitter', 'CMS', 'Email'];
  const localesList = ['EN-US', 'ES-ES', 'FR-FR', 'DE-DE'];

  const fetchPipelines = async () => {
    try {
      const res = await api.getPipelines();
      setPipelines(res.data);
    } catch (e) {
      console.error("Failed to fetch pipelines", e);
    }
  };

  useEffect(() => {
    fetchPipelines();
    const interval = setInterval(fetchPipelines, 3000); // Polling for demo
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.createPipeline(newTitle, newContent, selectedChannels, selectedLocales);
      setIsCreating(false);
      setNewTitle('');
      setNewContent('');
      fetchPipelines();
    } catch (e) {
      alert("Failed to start workflow");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (item: string, list: string[], setList: any) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col p-6 space-y-8 bg-slate-950/20 backdrop-blur-xl">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/30">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white italic">OPERATIONS</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Workflow Agent</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('intelligence')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'intelligence' ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Content Intel</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all opacity-50 cursor-not-allowed">
            <ShieldCheck size={20} />
            <span className="font-medium">Brand Guard</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Cycle Reduction</p>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: "84%" }}
                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              ></motion.div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">84% faster than manual</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none"></div>

        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 backdrop-blur-lg sticky top-0 z-10">
          <div className="flex items-center w-96 bg-slate-900/50 rounded-xl px-4 py-2 border border-slate-800/50 focus-within:border-indigo-500/50 transition-all group">
            <Search size={16} className="text-slate-500 group-focus-within:text-indigo-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search content workflows..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>GLOBAL STATUS: ACTIVE</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-bold text-indigo-400 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin&background=0D1117&color=6366F1" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 relative scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full space-y-10 px-4"
              >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-1">
                    <h1 className="text-5xl font-extrabold text-white tracking-tighter italic gradient-text">OPERATIONS CENTER</h1>
                    <p className="text-slate-400 text-lg">Autonomous multi-agent orchestration for enterprise-scale content.</p>
                  </div>
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="group flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-3xl font-black shadow-2xl shadow-indigo-600/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
                  >
                    <Plus size={24} className="mr-3 group-hover:rotate-90 transition-transform duration-300" />
                    INITIALIZE SWARM
                  </button>
                </div>

                {/* Performance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: "Active Pipelines", value: pipelines.length || "0", icon: Activity, color: "text-indigo-400", bg: "bg-indigo-400/10", desc: "Real-time task swarms" },
                    { label: "Compliance Index", value: "98.2%", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", desc: "Automated brand safety" },
                    { label: "Global Reach", value: "4.2M", icon: Globe2, color: "text-blue-400", bg: "bg-blue-400/10", desc: "Cross-locale impressions" },
                    { label: "Cycle Reduction", value: "x8.4", icon: Clock, color: "text-purple-400", bg: "bg-purple-400/10", desc: "Efficiency multiplier" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2.5rem] hover:bg-slate-900/60 transition-all backdrop-blur-md group hover:border-indigo-500/30">
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <stat.icon size={28} />
                      </div>
                      <p className="text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-[10px] text-slate-600 mt-2 font-medium">{stat.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Pipeline List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Operational Pipeline</h3>
                    <div className="flex items-center space-x-2 text-xs text-indigo-400 font-bold px-4 py-2 bg-indigo-400/5 rounded-full border border-indigo-400/10">
                       <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
                       <span>SWARM ACTIVE</span>
                    </div>
                  </div>
                  
                  {pipelines.length === 0 ? (
                    <div className="bg-slate-900/10 border-2 border-dashed border-slate-800/50 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                       <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mb-6 shadow-inner">
                          <Layers size={40} />
                       </div>
                       <h3 className="text-2xl font-bold text-slate-400 italic tracking-tight">System Idle</h3>
                       <p className="text-slate-600 mt-2 max-w-sm mx-auto font-medium">Connect internal knowledge assets to begin autonomous multi-channel generation.</p>
                    </div>
                  ) : (
                    pipelines.map((pipe) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={pipe.id} 
                        className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-[3rem] hover:border-indigo-500/40 transition-all group relative overflow-hidden backdrop-blur-xl"
                      >
                        {/* Status chip */}
                        <div className="absolute top-8 right-8 flex space-x-3 items-center">
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${pipe.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20'} border`}>
                             {pipe.status}
                           </div>
                           <button className="text-slate-600 hover:text-white transition-colors bg-slate-950/50 p-2 rounded-xl">
                             <MoreVertical size={20} />
                           </button>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                          <div className="flex items-start">
                            <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-indigo-600/10 text-indigo-400 mr-8 shadow-xl border border-indigo-500/20">
                              <FileEdit size={36} />
                            </div>
                            <div>
                              <h4 className="font-black text-2xl text-white group-hover:text-indigo-400 transition-colors duration-300 italic tracking-tight uppercase">{pipe.title}</h4>
                              <div className="flex flex-wrap items-center text-xs text-slate-500 space-x-6 mt-3 font-bold tracking-wider uppercase">
                                <span className="flex items-center"><Clock size={16} className="mr-2 text-indigo-500/50" /> {new Date(pipe.created_at).toLocaleTimeString()}</span>
                                <span className="flex items-center"><Globe2 size={16} className="mr-2 text-indigo-500/50" /> {pipe.target_locales.join(' ')}</span>
                                <span className="flex items-center"><Send size={16} className="mr-2 text-indigo-500/50" /> {pipe.target_channels.join(', ')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Steps Visualization */}
                          <div className="flex-1 max-w-2xl relative">
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800/50 -translate-y-1/2 -z-10"></div>
                            <div className="grid grid-cols-4 gap-12 relative z-10 p-2">
                              {pipe.steps.map((step: any, idx: number) => {
                                const isCompleted = step.status === 'completed' || step.status === 'manual_review';
                                const isRunning = step.status === 'running';
                                return (
                                  <div key={step.step_id} className="flex flex-col items-center group/step">
                                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 border-2 ${
                                      isCompleted ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)]' :
                                      isRunning ? 'bg-slate-950 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.2)] animate-pulse scale-110' :
                                      'bg-slate-950 border-slate-800 text-slate-700'
                                    }`}>
                                      {isCompleted ? <CheckCircle2 size={24} /> : 
                                       isRunning ? <Activity size={24} className="animate-spin duration-[3000ms]" /> : 
                                       idx === 0 ? <Plus size={24} /> : 
                                       idx === 1 ? <ShieldCheck size={24} /> :
                                       idx === 2 ? <Languages size={24} /> :
                                       <CheckCircle2 size={24} />}
                                    </div>
                                    <div className="mt-4 text-center">
                                      <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-white' : isRunning ? 'text-indigo-400' : 'text-slate-700'}`}>
                                        {step.agent_name.split(' ')[0]}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Summary Section */}
                        {pipe.status === 'completed' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-10 pt-10 border-t border-slate-800/50 grid grid-cols-1 md:grid-cols-3 gap-8"
                          >
                            <div className="md:col-span-2 bg-slate-950/40 p-6 rounded-3xl border border-slate-800/50 hover:bg-slate-950/60 transition-colors">
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center">
                                <FileEdit size={14} className="mr-2 text-indigo-500" />
                                GENERATED CONTENT PREVIEW
                              </h5>
                              <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                                "{pipe.current_draft?.LinkedIn || "Finalizing knowledge extraction..."}"
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-slate-950/40 to-indigo-950/20 p-6 rounded-3xl border border-indigo-500/10 flex flex-col justify-between group-hover:border-indigo-500/30 transition-all">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 flex items-center">
                                    <ShieldCheck size={14} className="mr-2 text-emerald-500" />
                                    SAFETY COMPLIANCE
                                  </h5>
                                  <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-black text-white tracking-tighter">{pipe.compliance_report?.scores?.LinkedIn || 100}%</span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase">SAFE</span>
                                  </div>
                                </div>
                              </div>
                              <button className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all transform hover:scale-[1.02]">
                                REVIEW & PUBLISH
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full h-full space-y-10 px-4"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-1">
                    <h1 className="text-5xl font-extrabold text-white tracking-tighter italic gradient-text">CONTENT INTELLIGENCE</h1>
                    <p className="text-slate-400 text-lg">Real-time performance analytics across the automated swarm lifecycle.</p>
                  </div>
                </div>

                {/* Big Stats Chart Mock */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 bg-slate-900/40 border-2 border-slate-800/40 p-10 rounded-[4rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 flex flex-col items-end">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-right">TOTAL IMPRESSIONS</p>
                      <p className="text-5xl font-black text-white tracking-tighter">4.24M</p>
                      <div className="flex items-center text-emerald-500 mt-2 font-black text-sm">
                        <Activity size={16} className="mr-2" />
                        +18.4% WoW
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-white tracking-tight mb-12 italic uppercase">Channel Growth Distribution</h3>
                    
                    <div className="h-64 flex items-end justify-between space-x-4">
                      {[40, 25, 60, 45, 90, 55, 100, 80, 65, 45, 75, 50, 85].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                          className={`flex-1 rounded-2xl transition-all duration-500 shadow-2xl ${
                            i === 6 ? 'bg-indigo-500 shadow-indigo-500/40 scale-110' : 'bg-slate-800 group-hover:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-10">
                    <div className="flex-1 bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between group">
                       <div className="flex justify-between items-start">
                          <h4 className="font-black text-white italic tracking-widest text-lg">ROI SCORE</h4>
                          <Zap size={24} className="text-emerald-300" />
                       </div>
                       <div>
                          <p className="text-6xl font-black text-white tracking-tighter mb-2 italic">x12.4</p>
                          <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Revenue Impact Per Token</p>
                       </div>
                    </div>
                    <div className="flex-1 bg-slate-900/40 border-2 border-slate-800/40 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between overflow-hidden relative">
                       <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                       <div className="flex justify-between items-start relative z-10">
                          <h4 className="font-black text-slate-400 italic tracking-widest text-lg">CYCLE HEALTH</h4>
                          <Clock size={24} className="text-indigo-400" />
                       </div>
                       <div className="relative z-10">
                          <p className="text-5xl font-black text-white tracking-tighter mb-2 italic">98.4%</p>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "98.4%" }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                              className="h-full bg-indigo-500 shadow-lg shadow-indigo-500/40"
                            />
                          </div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">Efficiency Consistency</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Regional Map Placeholder Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[4rem] group hover:border-indigo-500/30 transition-all backdrop-blur-md">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Localization Efficiency</h4>
                      <div className="space-y-6">
                        {[
                          { lang: "Spanish (ES-ES)", value: 98, color: "bg-orange-500" },
                          { lang: "French (FR-FR)", value: 96, color: "bg-blue-500" },
                          { lang: "German (DE-DE)", value: 92, color: "bg-yellow-500" },
                          { lang: "English (UK-EN)", value: 99, color: "bg-red-500" },
                        ].map((item, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                              <span className="text-slate-400">{item.lang}</span>
                              <span className="text-white">{item.value}%</span>
                            </div>
                            <div className="h-3 bg-slate-950/50 rounded-xl overflow-hidden p-[2px]">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${item.value}%` }} 
                                 className={`h-full ${item.color} rounded-sm opacity-80 shadow-lg`}
                               />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[4rem] flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition-all backdrop-blur-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-transparent"></div>
                      <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-slate-800 mb-6 shadow-2xl relative z-10">
                        <Globe2 size={48} className="text-indigo-400" />
                      </div>
                      <h4 className="text-2xl font-black text-white italic tracking-tight mb-2 relative z-10">Global Distribution Map</h4>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-widest relative z-10">Visualizing 4,240,000 Nodes Globally</p>
                      <button className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all relative z-10 border border-slate-700">
                        EXPAND WORLD VIEW
                      </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* New Workflow Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsCreating(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight italic">Initialize Agentic Pipeline</h2>
                  <p className="text-indigo-100/70 text-sm mt-1">Configure your multi-agent workflow for content generation.</p>
                </div>
                {!loading && (
                    <button onClick={() => setIsCreating(false)} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20">
                      <X size={24} />
                    </button>
                )}
              </div>
              
              <div className="p-10 grid grid-cols-5 gap-10">
                <div className="col-span-3 space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Campaign Identity</label>
                    <input 
                      disabled={loading}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      type="text" 
                      placeholder="e.g. Project Aurora: Infrastructure Expansion" 
                      className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-[1.25rem] px-6 py-4 outline-none focus:border-indigo-500 transition-all font-medium placeholder:text-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                        <span>Source Intelligence / Knowledge</span>
                        <span className="text-indigo-400">PDF / Link / Doc</span>
                    </label>
                    <textarea 
                      disabled={loading}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Paste internal reports, technical specs, or meeting notes..." 
                      rows={8}
                      className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-[1.25rem] px-6 py-4 outline-none focus:border-indigo-500 transition-all resize-none font-medium placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Channels</label>
                    <div className="flex flex-wrap gap-2.5">
                      {channelsList.map(ch => (
                        <button 
                          key={ch} 
                          disabled={loading}
                          onClick={() => toggleItem(ch, selectedChannels, setSelectedChannels)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            selectedChannels.includes(ch) 
                             ? 'bg-indigo-600 border-indigo-400 text-white' 
                             : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                           }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regional Locales</label>
                    <div className="flex flex-wrap gap-2.5">
                      {localesList.map(locale => (
                        <button 
                          key={locale} 
                          disabled={loading}
                          onClick={() => toggleItem(locale, selectedLocales, setSelectedLocales)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            selectedLocales.includes(locale) 
                             ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/20' 
                             : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                           }`}
                        >
                          {locale}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-[2rem] space-y-4">
                     <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Agent Swarm Assigned</p>
                     <div className="space-y-3">
                        {['Knowledge Analyst', 'Global Copywriter', 'Governance Guard', 'Channel Publisher'].map(a => (
                            <div key={a} className="flex items-center space-x-3">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-xs font-medium text-slate-300">{a}</span>
                            </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-10 pt-0 flex justify-end">
                <button 
                  disabled={loading || !newTitle || !newContent}
                  onClick={handleCreate}
                  className={`flex items-center space-x-3 px-10 py-5 rounded-3xl font-black text-lg transition-all shadow-2xl relative overflow-hidden group ${
                    loading || !newTitle || !newContent ? 'bg-slate-800 text-slate-600 grayscale' : 'bg-white text-slate-950 hover:bg-slate-100 hover:scale-[1.02]'
                  }`}
                >
                  {loading ? (
                      <>
                        <Activity className="animate-spin" size={24} />
                        <span>ORCHESTRATING...</span>
                      </>
                  ) : (
                      <>
                        <span>START SWARM</span>
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
