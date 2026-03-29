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
                className="max-w-6xl mx-auto space-y-10"
              >
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Enterprise Content Pipeline</h1>
                    <p className="text-slate-400 text-lg">Multi-agent orchestration for brand-aligned content scale.</p>
                  </div>
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="group flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    New Workflow
                  </button>
                </div>

                {/* Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Active Pipeline", value: pipelines.length || "0", icon: Activity, color: "text-indigo-400", bg: "bg-indigo-400/10" },
                    { label: "Governance Score", value: "98.2", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "Total Reach", value: "4.2M", icon: Globe2, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Resource ROI", value: "x4.2", icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/10" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-[2rem] hover:bg-slate-900/60 transition-colors backdrop-blur-sm group">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon size={24} />
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Pipeline List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Active Workflows</h3>
                    <div className="flex items-center space-x-2 text-xs text-indigo-400 font-bold px-3 py-1 bg-indigo-400/10 rounded-full">
                       <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
                       <span>REAL-TIME UPDATE</span>
                    </div>
                  </div>
                  
                  {pipelines.length === 0 ? (
                    <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                       <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mb-4">
                          <Layers size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-slate-400">No active workflows</h3>
                       <p className="text-slate-600 mt-2 max-w-xs">Start a new workflow to see the multi-agent orchestration in action.</p>
                    </div>
                  ) : (
                    pipelines.map((pipe) => (
                      <motion.div 
                        layout
                        key={pipe.id} 
                        className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-6 flex space-x-2">
                           <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${pipe.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'} border border-current opacity-30`}>
                             {pipe.status}
                           </div>
                           <button className="text-slate-600 hover:text-white transition-colors">
                             <MoreVertical size={18} />
                           </button>
                        </div>

                        <div className="flex items-start mb-8">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 mr-5`}>
                            <FileEdit size={28} />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors duration-300">{pipe.title}</h4>
                            <div className="flex items-center text-sm text-slate-500 space-x-4 mt-1">
                              <span className="flex items-center"><Clock size={14} className="mr-1.5" /> Created {new Date(pipe.created_at).toLocaleTimeString()}</span>
                              <span className="flex items-center"><Globe2 size={14} className="mr-1.5" /> {pipe.target_locales.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Multi-Agent Steps Visualization */}
                        <div className="relative isolate">
                          {/* Connection Line */}
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10"></div>
                          
                          <div className="grid grid-cols-4 gap-6 relative z-10">
                            {pipe.steps.map((step: any, idx: number) => {
                              const isCompleted = step.status === 'completed' || step.status === 'manual_review';
                              const isRunning = step.status === 'running';
                              
                              return (
                                <div key={step.step_id} className="flex flex-col items-center">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                                    isCompleted ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' :
                                    isRunning ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.2)] animate-pulse scale-110' :
                                    'bg-slate-950 border-slate-800 text-slate-600'
                                  }`}>
                                    {isCompleted ? <CheckCircle2 size={24} /> : 
                                     isRunning ? <Activity size={24} /> : 
                                     idx === 0 ? <Plus size={24} /> : 
                                     idx === 1 ? <ShieldCheck size={24} /> :
                                     idx === 2 ? <Languages size={24} /> :
                                     <ArrowRight size={24} />}
                                  </div>
                                  <div className="mt-3 text-center">
                                    <p className={`text-xs font-bold uppercase tracking-tight ${isCompleted ? 'text-white' : isRunning ? 'text-indigo-400' : 'text-slate-500'}`}>
                                      {step.agent_name.split(' ')[0]}
                                    </p>
                                    <p className="text-[10px] text-slate-600 font-medium">
                                      {isCompleted ? 'Finished' : isRunning ? 'Processing...' : 'Waitlist'}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Summary info if completed */}
                        {pipe.status === 'completed' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-8 pt-6 border-t border-slate-800/50 grid grid-cols-2 gap-6"
                          >
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Content Preview</h5>
                              <p className="text-xs text-slate-400 line-clamp-2">
                                {pipe.current_draft?.LinkedIn || "Pending extraction..."}
                              </p>
                            </div>
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 flex justify-between items-center">
                              <div>
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Compliance</h5>
                                <p className="text-sm font-bold text-emerald-400 italic">Score: {pipe.compliance_report?.scores?.LinkedIn}%</p>
                              </div>
                              <button className="text-indigo-400 hover:text-white text-xs font-bold px-4 py-2 bg-indigo-500/10 rounded-lg transition-colors border border-indigo-500/20">
                                REVIEW ASSETS
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
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                <div className="p-8 bg-slate-900/50 rounded-full border border-slate-800">
                  <BarChart3 size={64} className="text-slate-700" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-300">Insights Dashboard</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mt-2">Connecting to enterprise datasets... This module will show cross-channel engagement and ROI metrics.</p>
                </div>
              </div>
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
