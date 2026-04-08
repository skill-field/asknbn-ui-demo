import { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell,
  PieChart, Pie
} from 'recharts';
import { Activity, Users, Database, DollarSign } from 'lucide-react';

const tokenUsageData = [
  { time: '00:00', tokens: 1200 },
  { time: '04:00', tokens: 2100 },
  { time: '08:00', tokens: 800 },
  { time: '12:00', tokens: 4900 },
  { time: '16:00', tokens: 3600 },
  { time: '20:00', tokens: 2800 },
  { time: '23:59', tokens: 1900 },
];

const modelCostData = [
  { name: 'Gemini 1.5 Pro', cost: 420, color: '#3b82f6' },
  { name: 'Gemini 1.5 Flash', cost: 180, color: '#8b5cf6' },
  { name: 'Claude 3 Opus', cost: 350, color: '#ec4899' },
  { name: 'GPT-4o', cost: 290, color: '#10b981' },
];

const userActivityData = [
  { day: 'Mon', requests: 400 },
  { day: 'Tue', requests: 300 },
  { day: 'Wed', requests: 550 },
  { day: 'Thu', requests: 450 },
  { day: 'Fri', requests: 700 },
  { day: 'Sat', requests: 200 },
  { day: 'Sun', requests: 150 },
];

export default function MonitoringPage() {
  const [timeRange, setTimeRange] = useState('24h');

  // Colors adapted for dark mode
  const textColor = '#94a3b8'; // slate-400
  const gridColor = '#334155'; // slate-700
  
  return (
    <div className="page-container monitoring-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Monitoring</h1>
          <p className="page-subtitle">Real-time metrics, costs, and audit logs.</p>
        </div>
        <div className="time-range-controls">
          <button className={`btn gap-2 ${timeRange === '24h' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTimeRange('24h')}>24h</button>
          <button className={`btn gap-2 ${timeRange === '7d' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTimeRange('7d')}>7d</button>
          <button className={`btn gap-2 ${timeRange === '30d' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTimeRange('30d')}>30d</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrapper blue"><Activity size={20} /></div>
          <div className="metric-info">
            <div className="metric-label">Token Usage</div>
            <div className="metric-value">17.3K</div>
            <div className="metric-trend positive">+12% vs last {timeRange}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper green"><DollarSign size={20} /></div>
          <div className="metric-info">
            <div className="metric-label">Estimated Cost</div>
            <div className="metric-value">$1,240.00</div>
            <div className="metric-trend negative">-5% vs last {timeRange}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper purple"><Users size={20} /></div>
          <div className="metric-info">
            <div className="metric-label">Active Users</div>
            <div className="metric-value">842</div>
            <div className="metric-trend positive">+18% vs last {timeRange}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper amber"><Database size={20} /></div>
          <div className="metric-info">
            <div className="metric-label">Total Requests</div>
            <div className="metric-value">2,750</div>
            <div className="metric-trend positive">+8% vs last {timeRange}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid-main">
        {/* Token Usage Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Token Usage Over Time</h3>
          </div>
          <div className="chart-container-large">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenUsageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="time" stroke={textColor} tick={{fill: textColor}} axisLine={false} tickLine={false} />
                <YAxis stroke={textColor} tick={{fill: textColor}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="tokens" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom charts grid */}
        <div className="charts-grid-secondary">
          
          {/* User Activity */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>User Requests</h3>
            </div>
            <div className="chart-container-small">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="day" stroke={textColor} tick={{fill: textColor}} axisLine={false} tickLine={false} />
                  <YAxis stroke={textColor} tick={{fill: textColor}} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: '#334155'}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  />
                  <Bar dataKey="requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Costs Breakdown */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Model Cost Breakdown</h3>
            </div>
            <div className="chart-container-small">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelCostData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="cost"
                    stroke="none"
                  >
                    {modelCostData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    formatter={(value) => `$${value}`}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
