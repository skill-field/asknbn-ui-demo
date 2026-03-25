import { useState, useEffect } from 'react'
import { Plus, Brain, Trash2, Search, Edit2, X } from 'lucide-react'
import { modelsApi } from '../../api'

const PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'Custom']

function ModelModal({ model, onClose, onSave }) {
  const [form, setForm] = useState(model || { name: '', provider: 'OpenAI', version: '', contextWindow: 128000, status: 'active' })
  const isEdit = !!model
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit Model' : 'Add Model'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group"><label className="form-label">Display Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. GPT-4o" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group"><label className="form-label">Provider</label>
              <select className="form-select" value={form.provider} onChange={e => setForm(p => ({ ...p, provider: e.target.value }))}>
                {PROVIDERS.map(p => <option key={p}>{p}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Version / ID</label>
              <input className="form-input" value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} placeholder="e.g. gpt-4o" /></div>
          </div>
          <div className="form-group"><label className="form-label">Context Window (tokens)</label>
            <input className="form-input" type="number" value={form.contextWindow} onChange={e => setForm(p => ({ ...p, contextWindow: +e.target.value }))} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save Model</button>
        </div>
      </div>
    </div>
  )
}

export default function ModelsPage() {
  const [models, setModels] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | model object for edit

  useEffect(() => { modelsApi.list().then(setModels) }, [])

  const handleSave = async (form) => {
    if (modal?.id) {
      const updated = await modelsApi.update(modal.id, form)
      setModels(p => p.map(m => m.id === modal.id ? updated : m))
    } else {
      const created = await modelsApi.create(form)
      setModels(p => [...p, created])
    }
    setModal(null)
  }

  const handleDelete = async (id) => {
    await modelsApi.remove(id)
    setModels(p => p.filter(m => m.id !== id))
  }

  const filtered = models.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase()))

  const providerColors = { OpenAI: '#10b981', Anthropic: '#f59e0b', Google: '#3b82f6', Meta: '#8b5cf6', Mistral: '#06b6d4' }

  return (
    <div>
      <div className="resource-header">
        <div className="resource-icon" style={{ background: 'rgba(99,102,241,0.12)' }}><Brain size={22} color="#818cf8" /></div>
        <div><h1 className="page-title">Models</h1><p className="page-subtitle">Configure LLM model providers and versions</p></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <div className="search-bar"><Search size={14} color="var(--text-muted)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models…" /></div>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Model</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Provider</th><th>Version</th><th>Context Window</th><th>Status</th><th style={{ width: 80 }}></th></tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} onClick={() => setModal(m)}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{m.name}</td>
                <td>
                  <span style={{ color: providerColors[m.provider] || 'var(--text-secondary)', fontWeight: 500, fontSize: 13 }}>
                    {m.provider}
                  </span>
                </td>
                <td><span className="font-mono" style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 4 }}>{m.version}</span></td>
                <td>{(m.contextWindow / 1000).toFixed(0)}K tokens</td>
                <td><span className={`badge ${m.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{m.status}</span></td>
                <td>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(m)}><Edit2 size={14} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(m.id)}><Trash2 size={14} color="var(--accent-rose)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <ModelModal model={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
