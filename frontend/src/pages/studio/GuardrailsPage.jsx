import { useState, useEffect } from 'react'
import { Plus, ShieldCheck, Trash2, Search, Edit2, X } from 'lucide-react'
import { guardrailsApi } from '../../api'

function GuardrailModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || { name: '', type: 'input', description: '', action: 'warn', status: 'active' })
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{item?.id ? 'Edit Guardrail' : 'New Guardrail'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group"><label className="form-label">Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. PII Detector" /></div>
          <div className="form-group"><label className="form-label">Description</label>
            <input className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="input">Input</option><option value="output">Output</option><option value="both">Both</option>
              </select></div>
            <div className="form-group"><label className="form-label">Action</label>
              <select className="form-select" value={form.action} onChange={e => setForm(p => ({ ...p, action: e.target.value }))}>
                <option value="block">Block</option><option value="mask">Mask</option><option value="warn">Warn</option><option value="truncate">Truncate</option>
              </select></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save Guardrail</button>
        </div>
      </div>
    </div>
  )
}

const ACTION_COLORS = { block: 'var(--accent-rose)', mask: 'var(--accent-amber)', warn: 'var(--accent-cyan)', truncate: 'var(--accent-secondary)' }

export default function GuardrailsPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  useEffect(() => { guardrailsApi.list().then(setItems) }, [])

  const handleSave = async (form) => {
    if (modal?.id) { const u = await guardrailsApi.update(modal.id, form); setItems(p => p.map(i => i.id === modal.id ? u : i)) }
    else { const c = await guardrailsApi.create(form); setItems(p => [...p, c]) }
    setModal(null)
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="resource-header">
        <div className="resource-icon" style={{ background: 'rgba(16,185,129,0.12)' }}><ShieldCheck size={22} color="#34d399" /></div>
        <div><h1 className="page-title">Guardrails</h1><p className="page-subtitle">Define safety and content policies for your bots</p></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <div className="search-bar"><Search size={14} color="var(--text-muted)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guardrails…" /></div>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> New Guardrail</button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Description</th><th>Type</th><th>Action</th><th>Status</th><th style={{ width: 80 }}></th></tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} onClick={() => setModal(item)}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</td>
                <td style={{ maxWidth: 280 }}>{item.description}</td>
                <td><span className="badge badge-inactive">{item.type}</span></td>
                <td><span style={{ color: ACTION_COLORS[item.action], fontSize: 12, fontWeight: 600 }}>{item.action?.toUpperCase()}</span></td>
                <td><span className={`badge ${item.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{item.status}</span></td>
                <td>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(item)}><Edit2 size={14} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { guardrailsApi.remove(item.id); setItems(p => p.filter(i => i.id !== item.id)) }}><Trash2 size={14} color="var(--accent-rose)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <GuardrailModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
