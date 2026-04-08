import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Topbar from './components/layout/Topbar'
import Sidebar from './components/layout/Sidebar'
import CatalogPage from './pages/studio/CatalogPage'
import AgentBuilderPage from './pages/studio/AgentBuilderPage'
import ModelsPage from './pages/studio/ModelsPage'
import GuardrailsPage from './pages/studio/GuardrailsPage'
import PromptsPage from './pages/studio/PromptsPage'
import ToolsPage from './pages/studio/ToolsPage'
import UDFsPage from './pages/studio/UDFsPage'
import MonitoringPage from './pages/studio/MonitoringPage'
import UserModePage from './pages/user/UserModePage'
function App() {
  const [mode, setMode] = useState('studio') // 'studio' | 'user'
  const navigate = useNavigate()
  const location = useLocation()

  const handleModeChange = (newMode) => {
    setMode(newMode)
    if (newMode === 'user') navigate('/user')
    else navigate('/studio/catalog')
  }

  const isUserMode = mode === 'user'

  return (
    <div className="app-layout">
      <Topbar mode={mode} onModeChange={handleModeChange} />
      <div className="app-body">
        {!isUserMode && <Sidebar activeRoute={location.pathname} />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/studio/catalog" replace />} />
            <Route path="/studio/catalog" element={<CatalogPage />} />
            <Route path="/studio/agent/:id?" element={<AgentBuilderPage />} />
            <Route path="/studio/models" element={<ModelsPage />} />
            <Route path="/studio/guardrails" element={<GuardrailsPage />} />
            <Route path="/studio/prompts" element={<PromptsPage />} />
            <Route path="/studio/tools" element={<ToolsPage />} />
            <Route path="/studio/udfs" element={<UDFsPage />} />
            <Route path="/studio/monitoring" element={<MonitoringPage />} />
            <Route path="/user" element={<UserModePage />} />
            <Route path="*" element={<Navigate to="/studio/catalog" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
