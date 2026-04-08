import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid, Bot, Brain, ShieldCheck, FileText,
  Wrench, Code2, Settings, Activity
} from 'lucide-react'

const navItems = [
  { label: 'Catalog', icon: LayoutGrid, path: '/studio/catalog' },
  { label: 'Models', icon: Brain, path: '/studio/models' },
  { label: 'Guardrails', icon: ShieldCheck, path: '/studio/guardrails' },
  { label: 'Prompts', icon: FileText, path: '/studio/prompts' },
  { label: 'Tools', icon: Wrench, path: '/studio/tools' },
  { label: 'UDFs', icon: Code2, path: '/studio/udfs' },
]

export default function Sidebar({ activeRoute }) {
  const navigate = useNavigate()

  return (
    <nav className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Studio</div>
        {navItems.map(({ label, icon: Icon, path }) => (
          <div
            key={path}
            id={`nav-${label.toLowerCase()}`}
            className={`sidebar-nav-item ${activeRoute === path || activeRoute.startsWith(path) ? 'active' : ''}`}
            onClick={() => navigate(path)}
            role="button"
            tabIndex={0}
          >
            <Icon className="nav-icon" size={18} />
            {label}
          </div>
        ))}
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="sidebar-label">System</div>
        <div 
          className={`sidebar-nav-item ${activeRoute === '/studio/monitoring' ? 'active' : ''}`}
          onClick={() => navigate('/studio/monitoring')}
          role="button"
          tabIndex={0}
        >
          <Activity className="nav-icon" size={18} />
          Monitoring
        </div>
        <div className="sidebar-nav-item">
          <Settings className="nav-icon" size={18} />
          Settings
        </div>
      </div>
    </nav>
  )
}
