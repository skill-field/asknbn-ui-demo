import { useState, useEffect } from 'react'
import { Plus, Code2, Trash2, Search, Edit2, X, Play } from 'lucide-react'
import { udfsApi } from '../../api'

const LANG_COLORS = { python: '#3b82f6', javascript: '#f59e0b', typescript: '#06b6d4' }
const LANG_ICONS = { python: '🐍', javascript: '🟨', typescript: '🔷' }

function UDFModal({ udf, onClose, onSave }) {
  const [form, setForm] = useState(udf || { name: '', language: 'python', description: '', code: '# Write your UDF here\ndef my_function(input):\n    return input', status: 'active' })
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-xl" onClick={e => e.stopPropagation()} style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <span className="modal-title">{udf?.id ? 'Edit UDF' : 'New User-Defined Function'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
            <div className="form-group"><label className="form-label">Function Name</label>
              <input className="form-input font-mono" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="my_function" /></div>
            <div className="form-group"><label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ fontFamily: 'var(--font-sans)', fontSize: 14, resize: 'none' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group"><label className="form-label">Language</label>
                <select className="form-select" value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))}>
                  <option value="python">Python</option><option value="javascript">JavaScript</option><option value="typescript">TypeScript</option>
                </select></div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select></div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{form.language}</span>
              <button className="btn btn-secondary btn-sm"><Play size={12} /> Run Test</button>
            </div>
            <textarea
              style={{ flex: 1, background: 'var(--bg-primary)', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', padding: 20, lineHeight: 1.7, resize: 'none' }}
              value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save UDF</button>
        </div>
      </div>
    </div>
  )
}

export default function UDFsPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  useEffect(() => { udfsApi.list().then(setItems) }, [])

  const handleSave = async (form) => {
    if (modal?.id) { const u = await udfsApi.update(modal.id, form); setItems(p => p.map(i => i.id === modal.id ? u : i)) }
    else { const c = await udfsApi.create(form); setItems(p => [...p, c]) }
    setModal(null)
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="resource-header">
        <div className="resource-icon" style={{ background: 'rgba(245,158,11,0.12)' }}><Code2 size={22} color="#fbbf24" /></div>
        <div><h1 className="page-title">UDFs</h1><p className="page-subtitle">User-defined functions for custom data transformations</p></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <div className="search-bar"><Search size={14} color="var(--text-muted)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search UDFs…" /></div>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> New UDF</button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Description</th><th>Language</th><th>Code Preview</th><th>Status</th><th style={{ width: 80 }}></th></tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} onClick={() => setModal(item)}>
                <td>
                  <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 13 }}>{item.name}()</span>
                </td>
                <td style={{ maxWidth: 220 }}>{item.description}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: LANG_COLORS[item.language], fontSize: 13, fontWeight: 500 }}>
                    {LANG_ICONS[item.language]} {item.language}
                  </span>
                </td>
                <td>
                  <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 4, maxWidth: 180, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.code?.split('\n')[0]}
                  </span>
                </td>
                <td><span className={`badge ${item.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{item.status}</span></td>
                <td>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(item)}><Edit2 size={14} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { udfsApi.remove(item.id); setItems(p => p.filter(i => i.id !== item.id)) }}><Trash2 size={14} color="var(--accent-rose)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <UDFModal udf={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
