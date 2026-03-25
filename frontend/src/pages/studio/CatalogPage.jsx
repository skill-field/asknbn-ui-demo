import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Bot, Cpu, MoreVertical, Pencil, Trash2, Play } from 'lucide-react'
import { chatbotsApi } from '../../api'
import CreateChatbotModal from '../../components/modals/CreateChatbotModal'

const ICONS = {
  support: '🎧', sales: '💼', legal: '⚖️', code: '💻', default: '🤖',
}

export default function CatalogPage() {
  const [bots, setBots] = useState([])
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    chatbotsApi.list().then(setBots).finally(() => setLoading(false))
  }, [])

  const filtered = bots.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (data) => {
    const bot = await chatbotsApi.create(data)
    setBots(prev => [...prev, bot])
    setShowCreate(false)
    navigate(`/studio/agent/${bot.id}`)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    await chatbotsApi.remove(id)
    setBots(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Chatbot Catalog</h1>
          <p className="page-subtitle">Manage and deploy your AI chatbot agents</p>
        </div>
        <div className="flex gap-2">
          <div className="search-bar">
            <Search size={15} color="var(--text-muted)" />
            <input
              id="catalog-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search chatbots…"
            />
          </div>
          <button id="create-chatbot-btn" className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Chatbot
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Agents', value: bots.length, icon: '🤖', cls: 'indigo' },
          { label: 'Active', value: bots.filter(b => b.status === 'active').length, icon: '🟢', cls: 'emerald' },
          { label: 'Drafts', value: bots.filter(b => b.status === 'draft').length, icon: '✏️', cls: 'amber' },
          { label: 'Models Used', value: new Set(bots.map(b => b.model)).size, icon: '🧠', cls: 'cyan' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="stat-card">
            <div className={`stat-icon ${cls}`}>
              <Bot size={22} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="empty-state"><div className="spinner" /></div>
      ) : (
        <div className="catalog-grid">
          {/* Create Card */}
          <div className="create-card" id="create-chatbot-card" onClick={() => setShowCreate(true)}>
            <div className="create-card-icon">
              <Plus size={24} color="var(--accent-primary)" />
            </div>
            <div className="create-card-label">Create New Chatbot</div>
            <div className="create-card-sub">Build a new AI agent from scratch</div>
          </div>

          {filtered.map(bot => (
            <div
              key={bot.id}
              id={`chatbot-card-${bot.id}`}
              className="chatbot-card"
              onClick={() => navigate(`/studio/agent/${bot.id}`)}
            >
              <div className="chatbot-card-header">
                <div className="chatbot-icon">{ICONS[bot.icon] || '🤖'}</div>
                <span className={`badge ${bot.status === 'active' ? 'badge-active' : 'badge-draft'}`}>
                  {bot.status}
                </span>
              </div>

              <div className="chatbot-name">{bot.name}</div>
              <div className="chatbot-description">{bot.description}</div>

              <div className="chatbot-meta">
                <span className="chatbot-model-badge">
                  <Cpu size={11} /> {bot.model}
                </span>
              </div>

              {bot.tags && (
                <div className="chatbot-tags">
                  {bot.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="chatbot-card-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={(e) => { e.stopPropagation(); navigate(`/studio/agent/${bot.id}`) }}
                >
                  <Pencil size={13} /> Edit
                </button>
                <button className="btn btn-secondary btn-sm" onClick={e => e.stopPropagation()}>
                  <Play size={13} /> Deploy
                </button>
                <button
                  className="btn btn-ghost btn-icon btn-sm"
                  style={{ marginLeft: 'auto' }}
                  onClick={(e) => handleDelete(e, bot.id)}
                >
                  <Trash2 size={14} color="var(--accent-rose)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateChatbotModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  )
}
