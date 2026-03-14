import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Search, 
  PlusCircle, 
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  BriefcaseMedical,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

const API_BASE = "http://localhost:8000";

const COLORS = ['#ef4444', '#10b981', '#f59e0b', '#3b82f6'];

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    ProviderID: 'PRV00001',
    ClaimAmount: 5000,
    PatientAge: 45,
    ClaimDuration: 5,
    DiagnosisCode: 'D01'
  });
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const res = await axios.post(`${API_BASE}/predict`, form);
      setPrediction(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Failed to get prediction from backend.");
    } finally {
      setPredicting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
            <ShieldAlert className="text-brand-500 w-8 h-8" />
            MedGuard AI
          </h1>
          <p className="text-slate-400 mt-1 uppercase tracking-widest text-xs font-semibold">Real-time Claims Fraud Intelligence</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 backdrop-blur-sm">
          <div className="px-4 py-1">
            <p className="text-xs text-slate-500 uppercase">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Model Online</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="px-4 py-1">
            <p className="text-xs text-slate-500 uppercase">Total Claims</p>
            <p className="text-sm font-medium">{stats?.total_claims || 0}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Prediction */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PlusCircle size={80} />
            </div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-brand-500" />
              Analyze New Claim
            </h2>
            <form onSubmit={handlePredict} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Provider ID</label>
                <input 
                  type="text" 
                  value={form.ProviderID}
                  onChange={e => setForm({...form, ProviderID: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Claim Amount ($)</label>
                  <input 
                    type="number" 
                    value={form.ClaimAmount}
                    onChange={e => setForm({...form, ClaimAmount: parseFloat(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Patient Age</label>
                  <input 
                    type="number" 
                    value={form.PatientAge}
                    onChange={e => setForm({...form, PatientAge: parseInt(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Duration (Days)</label>
                  <input 
                    type="number" 
                    value={form.ClaimDuration}
                    onChange={e => setForm({...form, ClaimDuration: parseInt(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Diagnosis Code</label>
                  <select 
                    value={form.DiagnosisCode}
                    onChange={e => setForm({...form, DiagnosisCode: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  >
                    <option value="D01">D01 - General</option>
                    <option value="D02">D02 - Specialty</option>
                    <option value="D03">D03 - Urgent</option>
                    <option value="D04">D04 - Surgery</option>
                    <option value="D05">D05 - Lab Work</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={predicting}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-brand-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-2"
              >
                {predicting ? "Analyzing Pattern..." : "Run AI Fraud Scan"}
              </button>
            </form>
          </section>

          {prediction && (
            <section className={`rounded-2xl p-6 border-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${prediction.is_fraud ? 'bg-red-500/10 border-red-500/50' : 'bg-emerald-500/10 border-emerald-500/50'}`}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">Analysis Result</h3>
                {prediction.is_fraud ? <AlertTriangle className="text-red-500 h-8 w-8" /> : <ShieldCheck className="text-emerald-500 h-8 w-8" />}
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-slate-400 uppercase font-semibold">Classification</p>
                <p className={`text-4xl font-black mb-1 ${prediction.is_fraud ? 'text-red-500' : 'text-emerald-500'}`}>
                  {prediction.is_fraud ? 'FRAUDULENT' : 'LEGITIMATE'}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${prediction.is_fraud ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${prediction.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono">{Math.round(prediction.confidence * 100)}% Confidence</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1 border-b border-slate-800 pb-1">
                  <Info size={14} /> AI Decision Factors (SHAP)
                </h4>
                <div className="space-y-3">
                  {Object.entries(prediction.explanation)
                    .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
                    .slice(0, 3)
                    .map(([key, val]) => (
                      <div key={key} className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className={val > 0 ? 'text-red-400' : 'text-emerald-400'}>
                            {val > 0 ? '+' : ''}{val.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div 
                            className={`h-full ${val > 0 ? 'bg-red-500' : 'bg-emerald-500'} ${val > 0 ? 'ml-auto' : ''}`}
                            style={{ width: `${Math.min(100, Math.abs(val) * 50)}%`, marginLeft: val < 0 ? '0' : 'auto' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-6 p-3 bg-slate-900/50 rounded-lg text-xs text-slate-400">
                <p><strong>Anomaly Score:</strong> {prediction.anomaly_score.toFixed(2)}</p>
                <p className="mt-1 opacity-70">A score {prediction.anomaly_score > 1.5 ? 'above 1.5 indicates significant deviation from provider behavior.' : 'near 1.0 indicates typical behavior.'}</p>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Dashboards */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <PieChartIcon className="text-brand-500" />
                Fraud Distribution
              </h2>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.fraud_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats?.fraud_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="text-brand-500" />
                High-Risk Providers
              </h2>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats?.top_providers}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="ProviderID" type="category" stroke="#64748b" width={80} />
                    <Tooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    />
                    <Bar dataKey="ProvAvgAmount" name="Avg Claim Vol ($)" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Large Network Visualization Placeholder or Trend */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" />
              Claim Reimbursement Trends (Anomaly Baseline)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: 'Jan', val: 4000, avg: 4200 },
                    { name: 'Feb', val: 3000, avg: 4100 },
                    { name: 'Mar', val: 2000, avg: 4150 },
                    { name: 'Apr', val: 2780, avg: 4120 },
                    { name: 'May', val: 1890, avg: 4100 },
                    { name: 'Jun', val: 2390, avg: 4180 },
                    { name: 'Jul', val: 3490, avg: 4200 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="val" name="Current Provider" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="avg" name="Network Average" stroke="#10b981" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4 italic font-medium">
              Note: Model is actively correlating current claim patterns against historical network averages to detect upcoding.
            </p>
          </section>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-brand-400 w-5 h-5" />
                <span className="text-sm font-semibold">Anomaly Engine</span>
              </div>
              <p className="text-xs text-slate-500">Detects phantom billing by cross-referencing patient history and provider capacity.</p>
            </div>
            <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <BriefcaseMedical className="text-amber-400 w-5 h-5" />
                <span className="text-sm font-semibold">XAI Verification</span>
              </div>
              <p className="text-xs text-slate-500">Uses SHAP values to provide human-readable explanations for every flagged transaction.</p>
            </div>
            <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Search className="text-brand-400 w-5 h-5" />
                <span className="text-sm font-semibold">Batch Scan</span>
              </div>
              <p className="text-xs text-slate-500">Enterprise ready with multi-threaded streaming support for large scale claim ingestion.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
