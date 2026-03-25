import { useState, useEffect } from 'react'
import { Plus, Wrench, Trash2, Search, Edit2, X } from 'lucide-react'
import { toolsApi } from '../../api'

const TYPE_STYLES = {
  builtin: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
  custom: { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
  integration: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
}

function ToolModal({ tool, onClose, onSave }) {
  const [form, setForm] = useState(tool || { name: '', type: 'custom', description: '', schema: '{\n  "type": "object",\n  "properties": {}\n}', status: 'active' })
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{tool?.id ? 'Edit Tool' : 'New Tool'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14 }}>
            <div className="form-group"><label className="form-label">Tool Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Web Search" /></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="builtin">Built-in</option><option value="custom">Custom</option><option value="integration">Integration</option>
              </select></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label>
            <input className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">JSON Schema</label>
            <textarea className="form-textarea" rows={8} value={form.schema} onChange={e => setForm(p => ({ ...p, schema: e.target.value }))} style={{ height: 160 }} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save Tool</button>
        </div>
      </div>
    </div>
  )
}

export default function ToolsPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  useEffect(() => { toolsApi.list().then(setItems) }, [])

  const handleSave = async (form) => {
    if (modal?.id) { const u = await toolsApi.update(modal.id, form); setItems(p => p.map(i => i.id === modal.id ? u : i)) }
    else { const c = await toolsApi.create(form); setItems(p => [...p, c]) }
    setModal(null)
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="resource-header">
        <div className="resource-icon" style={{ background: 'rgba(16,185,129,0.12)' }}><Wrench size={22} color="#34d399" /></div>
        <div><h1 className="page-title">Tools</h1><p className="page-subtitle">Configure external tools and integrations for agents</p></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <div className="search-bar"><Search size={14} color="var(--text-muted)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools…" /></div>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> New Tool</button>
        </div>
      </div>
      <div className="catalog-grid">
        {filtered.map(item => (
          <div key={item.id} className="chatbot-card" onClick={() => setModal(item)}>
            <div className="chatbot-card-header">
              <div className="chatbot-icon" style={{ background: TYPE_STYLES[item.type]?.bg }}>
                <Wrench size={20} color={TYPE_STYLES[item.type]?.color} />
              </div>
              <span className={`badge ${item.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{item.status}</span>
            </div>
            <div className="chatbot-name">{item.name}</div>
            <div className="chatbot-description">{item.description}</div>
            <div className="chatbot-meta">
              <span className="tag" style={{ background: TYPE_STYLES[item.type]?.bg, color: TYPE_STYLES[item.type]?.color, borderColor: 'transparent' }}>{item.type}</span>
            </div>
            <div className="chatbot-card-actions">
              <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); setModal(item) }}><Edit2 size={13} /> Edit</button>
              <button className="btn btn-ghost btn-icon btn-sm" style={{ marginLeft: 'auto' }} onClick={e => { e.stopPropagation(); toolsApi.remove(item.id); setItems(p => p.filter(i => i.id !== item.id)) }}>
                <Trash2 size={14} color="var(--accent-rose)" />
              </button>
            </div>
          </div>
        ))}
        <div className="create-card" onClick={() => setModal(true)}>
          <div className="create-card-icon"><Plus size={24} color="var(--accent-primary)" /></div>
          <div className="create-card-label">Add New Tool</div>
          <div className="create-card-sub">Connect APIs, functions, or integrations</div>
        </div>
      </div>
      {modal && <ToolModal tool={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
