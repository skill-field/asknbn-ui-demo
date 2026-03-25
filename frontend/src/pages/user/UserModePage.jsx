import { useState, useEffect, useRef } from 'react'
import { Send, Bot, ChevronDown, Plus, Zap } from 'lucide-react'
import { chatbotsApi } from '../../api'

const WELCOME = `Hello! I'm your AI assistant. How can I help you today? You can ask me anything, and I'll do my best to provide helpful, accurate responses.`

const MOCK_RESPONSES = [
  "I'd be happy to help with that! Let me think through this step by step.",
  "Great question! Here's what I know about that topic...",
  "That's an interesting request. Based on my training, I can tell you that...",
  "I understand you're looking for information on this. Here's a comprehensive answer:",
  "Let me break that down for you in a clear and structured way:",
]

export default function UserModePage() {
  const [bots, setBots] = useState([])
  const [selectedBot, setSelectedBot] = useState(null)
  const [messages, setMessages] = useState([{ id: 1, role: 'assistant', content: WELCOME }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [showBotSelect, setShowBotSelect] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    chatbotsApi.list().then(list => {
      setBots(list)
      if (list.length > 0) setSelectedBot(list[0])
    })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || thinking) return
    const userMsg = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))
    const reply = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }])
    setThinking(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const ICONS = { support: '🎧', sales: '💼', legal: '⚖️', code: '💻', default: '🤖' }

  return (
    <div className="user-mode-layout" style={{ margin: '-28px -32px' }}>
      {/* Sidebar of sessions */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div style={{ position: 'relative' }}>
            <button
              id="bot-selector-btn"
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', cursor: 'pointer', color: 'var(--text-primary)' }}
              onClick={() => setShowBotSelect(p => !p)}
            >
              <span style={{ fontSize: 18 }}>{ICONS[selectedBot?.icon] || '🤖'}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedBot?.name || 'Select Bot'}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedBot?.model}</div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>
            {showBotSelect && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginTop: 4, zIndex: 100, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                {bots.map(b => (
                  <div key={b.id} style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => { setSelectedBot(b); setShowBotSelect(false); setMessages([{ id: 1, role: 'assistant', content: WELCOME }]) }}>
                    <span>{ICONS[b.icon] || '🤖'}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.model}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '8px 12px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Conversations</span>
          <button className="btn btn-ghost btn-icon" style={{ padding: 4 }} onClick={() => setMessages([{ id: 1, role: 'assistant', content: WELCOME }])}>
            <Plus size={14} />
          </button>
        </div>

        <div className="chat-list">
          <div className="chat-item active">
            <div className="chat-item-name">New conversation</div>
            <div className="chat-item-preview">Just started</div>
          </div>
          {['Previous chat', 'Support session', 'General queries'].map((name, i) => (
            <div key={i} className="chat-item">
              <div className="chat-item-name">{name}</div>
              <div className="chat-item-preview">Click to continue...</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="chat-main">
        <div className="chat-header">
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedBot?.name || 'AI Assistant'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="dot dot-green" />
              Online · {selectedBot?.model || 'gpt-4o'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span className="badge badge-active" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={10} /> Active
            </span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message-bubble ${msg.role === 'user' ? 'user' : ''}`}>
              <div className="message-avatar" style={msg.role === 'user' ? { background: 'var(--bg-tertiary)', border: '1px solid var(--border)', fontSize: 12 } : {}}>
                {msg.role === 'user' ? 'US' : <Bot size={16} color="white" />}
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {thinking && (
            <div className="message-bubble">
              <div className="message-avatar"><Bot size={16} color="white" /></div>
              <div className="message-content" style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0.1, 0.25, 0.4].map((d, i) => (
                  <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)', animation: `pulse-glow 1.2s ${d}s ease infinite`, display: 'inline-block' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              id="chat-message-input"
              className="chat-input-box"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${selectedBot?.name || 'AI Assistant'}…`}
            />
            <button id="chat-send-btn" className="chat-send-btn" onClick={sendMessage} disabled={!input.trim() || thinking}>
              <Send size={16} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
