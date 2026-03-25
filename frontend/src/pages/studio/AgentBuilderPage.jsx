import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Brain, Wrench, GitBranch, FileText, ArrowDownToLine,
  ArrowUpFromLine, Plus, Trash2, Save, ChevronRight,
  GripVertical, Settings, Play, X
} from 'lucide-react'
import { chatbotsApi, modelsApi, toolsApi, promptsApi } from '../../api'

const NODE_TYPES = {
  llm:       { label: 'LLM Call',   icon: Brain,           cls: 'llm',       color: '#818cf8' },
  tool:      { label: 'Tool',       icon: Wrench,          cls: 'tool',      color: '#34d399' },
  condition: { label: 'Condition',  icon: GitBranch,       cls: 'condition', color: '#fbbf24' },
  prompt:    { label: 'Prompt',     icon: FileText,        cls: 'prompt',    color: '#22d3ee' },
  input:     { label: 'Input',      icon: ArrowUpFromLine, cls: 'input',     color: '#fb7185' },
  output:    { label: 'Output',     icon: ArrowDownToLine, cls: 'output',    color: '#c084fc' },
}

function SortableNode({ node, onDelete, onSelect, selected }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const typeInfo = NODE_TYPES[node.type] || NODE_TYPES.llm
  const Icon = typeInfo.icon

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`pipeline-node ${isDragging ? 'dragging' : ''} ${node.type === 'condition' ? 'condition-node' : ''} ${selected ? 'over' : ''}`}
        onClick={() => onSelect(node)}
      >
        <div className="pipeline-node-header">
          <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex' }}>
            <GripVertical size={16} />
          </div>
          <div className={`pipeline-node-type-badge node-palette-icon ${typeInfo.cls}`}>
            <Icon size={14} />
          </div>
          <span className="pipeline-node-title">{node.label || typeInfo.label}</span>
          <div className="pipeline-node-actions">
            <button className="btn btn-ghost btn-icon" style={{ padding: 4 }} onClick={e => { e.stopPropagation(); onSelect(node) }}>
              <Settings size={13} color="var(--text-muted)" />
            </button>
            <button className="btn btn-ghost btn-icon" style={{ padding: 4 }} onClick={e => { e.stopPropagation(); onDelete(node.id) }}>
              <Trash2 size={13} color="var(--accent-rose)" />
            </button>
          </div>
        </div>

        <div className="pipeline-node-body">
          {node.type === 'llm' && (
            <>
              <div className="pipeline-node-prop">
                <span className="pipeline-node-prop-label">Model</span>
                <span className="pipeline-node-prop-value">{node.config?.model || 'gpt-4o'}</span>
              </div>
              <div className="pipeline-node-prop">
                <span className="pipeline-node-prop-label">Temperature</span>
                <span className="pipeline-node-prop-value">{node.config?.temperature ?? 0.7}</span>
              </div>
            </>
          )}
          {node.type === 'tool' && (
            <div className="pipeline-node-prop">
              <span className="pipeline-node-prop-label">Tool</span>
              <span className="pipeline-node-prop-value">{node.config?.tool || 'None'}</span>
            </div>
          )}
          {node.type === 'condition' && (
            <>
              <div className="pipeline-node-prop">
                <span className="pipeline-node-prop-label">Expression</span>
                <span className="pipeline-node-prop-value">{node.config?.expression || 'if true'}</span>
              </div>
              <div className="condition-branches">
                <div className="condition-branch branch-true">
                  <div className="condition-branch-label">TRUE</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{node.config?.truePath || '→ Next'}</div>
                </div>
                <div className="condition-branch branch-false">
                  <div className="condition-branch-label">FALSE</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{node.config?.falsePath || '→ End'}</div>
                </div>
              </div>
            </>
          )}
          {node.type === 'prompt' && (
            <div className="pipeline-node-prop">
              <span className="pipeline-node-prop-label">Prompt</span>
              <span className="pipeline-node-prop-value" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.config?.prompt || 'System prompt'}</span>
            </div>
          )}
          {(node.type === 'input' || node.type === 'output') && (
            <div className="pipeline-node-prop">
              <span className="pipeline-node-prop-label">Schema</span>
              <span className="pipeline-node-prop-value">text</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PropertiesPanel({ node, models, tools, prompts, onUpdate, onClose }) {
  if (!node) return (
    <div className="agent-properties-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <Settings size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
        <div style={{ fontSize: 13 }}>Select a node to configure</div>
      </div>
    </div>
  )

  const typeInfo = NODE_TYPES[node.type]
  const Icon = typeInfo.icon

  return (
    <div className="agent-properties-panel">
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`node-palette-icon ${typeInfo.cls}`} style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{typeInfo.label} Config</span>
        </div>
        <button className="btn btn-ghost btn-icon" style={{ padding: 4 }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Node Label</label>
          <input className="form-input" value={node.label || ''} onChange={e => onUpdate({ label: e.target.value })} placeholder={typeInfo.label} />
        </div>

        {node.type === 'llm' && (
          <>
            <div className="form-group">
              <label className="form-label">Model</label>
              <select className="form-select" value={node.config?.model || 'gpt-4o'} onChange={e => onUpdate({ config: { ...node.config, model: e.target.value } })}>
                {models.map(m => <option key={m.id} value={m.version}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Temperature ({node.config?.temperature ?? 0.7})</label>
              <input type="range" min={0} max={2} step={0.1} value={node.config?.temperature ?? 0.7}
                onChange={e => onUpdate({ config: { ...node.config, temperature: parseFloat(e.target.value) } })}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Tokens</label>
              <input className="form-input" type="number" value={node.config?.maxTokens || 2048}
                onChange={e => onUpdate({ config: { ...node.config, maxTokens: parseInt(e.target.value) } })} />
            </div>
          </>
        )}

        {node.type === 'tool' && (
          <div className="form-group">
            <label className="form-label">Tool</label>
            <select className="form-select" value={node.config?.tool || ''} onChange={e => onUpdate({ config: { ...node.config, tool: e.target.value } })}>
              <option value="">-- Select Tool --</option>
              {tools.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        )}

        {node.type === 'condition' && (
          <>
            <div className="form-group">
              <label className="form-label">Condition Expression</label>
              <input className="form-input font-mono" value={node.config?.expression || ''}
                onChange={e => onUpdate({ config: { ...node.config, expression: e.target.value } })}
                placeholder="e.g. sentiment > 0.5" />
            </div>
            <div className="form-group">
              <label className="form-label">If True → Go to</label>
              <input className="form-input" value={node.config?.truePath || ''} onChange={e => onUpdate({ config: { ...node.config, truePath: e.target.value } })} placeholder="next" />
            </div>
            <div className="form-group">
              <label className="form-label">If False → Go to</label>
              <input className="form-input" value={node.config?.falsePath || ''} onChange={e => onUpdate({ config: { ...node.config, falsePath: e.target.value } })} placeholder="end" />
            </div>
          </>
        )}

        {node.type === 'prompt' && (
          <div className="form-group">
            <label className="form-label">Prompt Template</label>
            <select className="form-select" value={node.config?.promptId || ''} onChange={e => onUpdate({ config: { ...node.config, promptId: e.target.value } })}>
              <option value="">-- Select Prompt --</option>
              {prompts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgentBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bot, setBot] = useState(null)
  const [nodes, setNodes] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [models, setModels] = useState([])
  const [tools, setTools] = useState([])
  const [prompts, setPrompts] = useState([])
  const [saving, setSaving] = useState(false)
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    if (id) chatbotsApi.get(id).then(b => { setBot(b); setNodes(b.pipeline || []) })
    modelsApi.list().then(setModels)
    toolsApi.list().then(setTools)
    promptsApi.list().then(setPrompts)
  }, [id])

  const addNode = (type) => {
    const typeInfo = NODE_TYPES[type]
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      label: typeInfo.label,
      config: type === 'llm' ? { model: 'gpt-4o', temperature: 0.7, maxTokens: 2048 } : {},
    }
    setNodes(prev => [...prev, newNode])
  }

  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    if (selectedNode?.id === nodeId) setSelectedNode(null)
  }

  const updateSelectedNode = (updates) => {
    setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, ...updates } : n))
    setSelectedNode(prev => ({ ...prev, ...updates }))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    if (active.id !== over?.id) {
      setNodes(prev => {
        const oi = prev.findIndex(n => n.id === active.id)
        const ni = prev.findIndex(n => n.id === over.id)
        return arrayMove(prev, oi, ni)
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await chatbotsApi.update(id, { pipeline: nodes })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/studio/catalog')}>
            ← Back
          </button>
          <ChevronRight size={14} color="var(--text-muted)" />
          <h1 className="page-title" style={{ fontSize: 20 }}>
            {bot?.name || 'Agent Builder'}
          </h1>
          {bot && <span className={`badge ${bot.status === 'active' ? 'badge-active' : 'badge-draft'}`}>{bot.status}</span>}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm"><Play size={14} /> Test</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Save size={14} />}
            Save Pipeline
          </button>
        </div>
      </div>

      <div className="agent-builder-layout">
        {/* Left Palette */}
        <div className="agent-builder-panel">
          <div className="agent-builder-panel-title">Node Types</div>
          {Object.entries(NODE_TYPES).map(([type, info]) => {
            const Icon = info.icon
            return (
              <div key={type} className="node-palette-item" onClick={() => addNode(type)}>
                <div className={`node-palette-icon ${info.cls}`}>
                  <Icon size={15} />
                </div>
                <span className="node-palette-label">{info.label}</span>
                <Plus size={13} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
              </div>
            )
          })}

          <div style={{ height: 1, background: 'var(--border)', margin: '12px 8px' }} />
          <div className="agent-builder-panel-title">Quick Add</div>
          <div style={{ padding: '0 8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => { addNode('input'); addNode('llm'); addNode('output') }}>
              <Plus size={13} /> Basic LLM Chain
            </button>
            <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => { addNode('input'); addNode('prompt'); addNode('llm'); addNode('condition'); addNode('output') }}>
              <Plus size={13} /> Conditional Flow
            </button>
            <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => { addNode('input'); addNode('tool'); addNode('llm'); addNode('output') }}>
              <Plus size={13} /> Tool-Augmented
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="agent-canvas" onClick={() => setSelectedNode(null)}>
          {nodes.length === 0 ? (
            <div className="canvas-empty-state">
              <div className="canvas-empty-icon"><Brain size={28} /></div>
              <div className="canvas-empty-text">Click a node type or drag from the palette to start building</div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={e => setActiveId(e.active.id)}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={nodes.map(n => n.id)} strategy={verticalListSortingStrategy}>
                <div className="pipeline-nodes-container" onClick={e => e.stopPropagation()}>
                  {nodes.map((node, idx) => (
                    <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {idx > 0 && <div className="pipeline-connector" />}
                      <SortableNode
                        node={node}
                        onDelete={deleteNode}
                        onSelect={n => { setSelectedNode(n); }}
                        selected={selectedNode?.id === node.id}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Right Properties */}
        <PropertiesPanel
          node={selectedNode}
          models={models}
          tools={tools}
          prompts={prompts}
          onUpdate={updateSelectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  )
}
