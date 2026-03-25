import { useState, useEffect } from 'react'
import { Plus, FileText, Trash2, Search, Edit2, X, Copy } from 'lucide-react'
import { promptsApi } from '../../api'

function PromptModal({ prompt, onClose, onSave }) {
  const [form, setForm] = useState(prompt || { name: '', type: 'system', content: '', version: '1.0', status: 'active' })
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{prompt?.id ? 'Edit Prompt' : 'New Prompt'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div className="form-group" style={{ gridColumn: '1/3' }}><label className="form-label">Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Customer Support System" /></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="system">System</option><option value="user">User</option><option value="assistant">Assistant</option>
              </select></div>
          </div>
          <div className="form-group">
            <label className="form-label">Prompt Content</label>
            <textarea className="form-textarea" rows={10} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="You are a helpful assistant..." style={{ fontFamily: 'var(--font-sans)', fontSize: 14, height: 200 }} />
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div className="form-group" style={{ flex: 1 }}><label className="form-label">Version</label>
              <input className="form-input" value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} /></div>
            <div className="form-group" style={{ flex: 1 }}><label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="active">Active</option><option value="draft">Draft</option>
              </select></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save Prompt</button>
        </div>
      </div>
    </div>
  )
}

export default function PromptsPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  useEffect(() => { promptsApi.list().then(setItems) }, [])

  const handleSave = async (form) => {
    if (modal?.id) { const u = await promptsApi.update(modal.id, form); setItems(p => p.map(i => i.id === modal.id ? u : i)) }
    else { const c = await promptsApi.create(form); setItems(p => [...p, c]) }
    setModal(null)
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="resource-header">
        <div className="resource-icon" style={{ background: 'rgba(6,182,212,0.12)' }}><FileText size={22} color="#22d3ee" /></div>
        <div><h1 className="page-title">Prompts</h1><p className="page-subtitle">Manage reusable prompt templates</p></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <div className="search-bar"><Search size={14} color="var(--text-muted)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts…" /></div>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> New Prompt</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(item => (
          <div key={item.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setModal(item)}>
            <div className="card-header">
              <FileText size={16} color="var(--accent-cyan)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 15 }}>{item.name}</div>
              </div>
              <span className="badge badge-inactive" style={{ fontSize: 11 }}>{item.type}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>v{item.version}</span>
              <span className={`badge ${item.status === 'active' ? 'badge-active' : 'badge-draft'}`}>{item.status}</span>
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(item)}><Edit2 size={14} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { promptsApi.remove(item.id); setItems(p => p.filter(i => i.id !== item.id)) }}><Trash2 size={14} color="var(--accent-rose)" /></button>
              </div>
            </div>
            <div className="card-body" style={{ paddingTop: 12, paddingBottom: 14 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && <PromptModal prompt={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
