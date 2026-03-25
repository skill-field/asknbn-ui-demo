import { useState } from 'react'
import { X } from 'lucide-react'

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-3.5-sonnet', 'gemini-1.5-pro', 'llama-3.1-70b']
const ICONS = ['default', 'support', 'sales', 'legal', 'code']

export default function CreateChatbotModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', description: '', model: 'gpt-4o', icon: 'default', tags: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Create New Chatbot</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                id="bot-name-input"
                className="form-input"
                required
                placeholder="e.g. Customer Support Bot"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                id="bot-description-input"
                className="form-input"
                style={{ resize: 'vertical', minHeight: 80, fontFamily: 'var(--font-sans)', fontSize: 14 }}
                placeholder="What does this chatbot do?"
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Model</label>
                <select
                  id="bot-model-select"
                  className="form-select"
                  value={form.model}
                  onChange={e => setForm(p => ({ ...p, model: e.target.value }))}
                >
                  {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <select
                  id="bot-icon-select"
                  className="form-select"
                  value={form.icon}
                  onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                >
                  {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                id="bot-tags-input"
                className="form-input"
                placeholder="e.g. support, customer, sales"
                value={form.tags}
                onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
            <button id="bot-create-submit" className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create & Configure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
