import { useNavigate } from 'react-router-dom'
import { Bot, Zap } from 'lucide-react'

export default function Topbar({ mode, onModeChange }) {
  return (
    <header className="topbar">
      <a href="/studio/catalog" className="topbar-logo">
        <div className="topbar-logo-icon">
          <Zap size={16} color="white" />
        </div>
        <span>Chatbot Studio</span>
      </a>

      <div className="topbar-spacer" />

      <div className="topbar-mode-toggle" role="group" aria-label="Mode">
        <button
          id="mode-studio"
          className={`mode-btn ${mode === 'studio' ? 'active' : ''}`}
          onClick={() => onModeChange('studio')}
        >
          🎛 Studio
        </button>
        <button
          id="mode-user"
          className={`mode-btn ${mode === 'user' ? 'active' : ''}`}
          onClick={() => onModeChange('user')}
        >
          💬 User
        </button>
      </div>

      <div className="topbar-avatar" title="Account">
        US
      </div>
    </header>
  )
}
