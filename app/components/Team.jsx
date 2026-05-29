'use client'
import { useState, useEffect } from 'react'
import { GRAD, Card, CardLabel, FieldLabel, inputSt, Spinner } from './ui'

const ROLE_COLORS = {
  owner:  '#f59e0b',
  admin:  '#6366f1',
  member: '#475569',
}

const STATUS_COLORS = {
  active:  '#22c55e',
  pending: '#f59e0b',
}

export default function Team({ user }) {
  const [members, setMembers]       = useState([])
  const [replies, setReplies]       = useState([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [loading, setLoading]       = useState(true)
  const [inviting, setInviting]     = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [activeTab, setActiveTab]   = useState('members')
  const [selectedReply, setSelectedReply] = useState(null)
  const [comment, setComment]       = useState('')
  const [savingComment, setSavingComment] = useState(false)

  useEffect(() => {
    if (user?.email) {
      loadMembers()
      loadReplies()
    }
  }, [user])

  async function loadMembers() {
    setLoading(true)
    try {
      const res  = await fetch(`/api/team?owner=${user.email}`)
      const data = await res.json()
      setMembers(data.members || [])
    } catch {}
    setLoading(false)
  }

  async function loadReplies() {
    try {
      const res  = await fetch(`/api/team/replies?owner=${user.email}`)
      const data = await res.json()
      setReplies(data.replies || [])
    } catch {}
  }

  async function inviteMember() {
    if (!inviteEmail.trim()) return
    setInviting(true); setError(''); setSuccess('')
    try {
      const res  = await fetch('/api/team', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ownerEmail: user.email, memberEmail: inviteEmail.trim(), role: inviteRole }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSuccess(`Invite sent to ${inviteEmail}`)
      setInviteEmail('')
      loadMembers()
    } catch (e) { setError(e.message) }
    setInviting(false)
  }

  async function removeMember(memberEmail) {
    if (!confirm(`Remove ${memberEmail} from your team?`)) return
    try {
      await fetch('/api/team', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ownerEmail: user.email, memberEmail }),
      })
      loadMembers()
    } catch {}
  }

  async function updateReplyStatus(id, status) {
    try {
      await fetch('/api/team/replies', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, status }),
      })
      loadReplies()
      if (selectedReply?.id === id) setSelectedReply(prev => ({ ...prev, status }))
    } catch {}
  }

  async function saveComment(id) {
    if (!comment.trim()) return
    setSavingComment(true)
    try {
      await fetch('/api/team/replies', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, comment }),
      })
      setComment('')
      loadReplies()
      setSelectedReply(prev => ({ ...prev, comment }))
    } catch {}
    setSavingComment(false)
  }

  const pendingCount  = replies.filter(r => r.status === 'pending').length
  const approvedCount = replies.filter(r => r.status === 'approved').length

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px', marginBottom: 4 }}>Team</h2>
        <p style={{ fontSize: 13, color: '#475569' }}>Manage your team and review shared replies</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'members', label: `👥 Members (${members.length})` },
          { id: 'inbox',   label: `📬 Shared Inbox${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 16px', borderRadius: 7, border: 'none', background: activeTab === t.id ? 'rgba(99,102,241,0.15)' : 'transparent', color: activeTab === t.id ? '#a5b4fc' : '#475569', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MEMBERS TAB ── */}
      {activeTab === 'members' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

          {/* Member List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Owner Card */}
            <div style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.06),rgba(99,102,241,0.06))', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                  {user?.email?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{user?.email}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Account owner</div>
                </div>
              </div>
              <RoleBadge role="owner" />
            </div>

            {/* Members */}
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '20px 0', color: '#475569', fontSize: 13 }}>
                <Spinner /> Loading members...
              </div>
            ) : members.length === 0 ? (
              <div style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 14, padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#475569', marginBottom: 6 }}>No team members yet</div>
                <div style={{ fontSize: 12, color: '#334155' }}>Invite your team using the form →</div>
              </div>
            ) : (
              members.map(m => (
                <div key={m.id} style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2033'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#131320', border: '1px solid #1e2033', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 700, fontSize: 13 }}>
                      {m.member_email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{m.member_email}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                        <span style={{ fontSize: 10, color: STATUS_COLORS[m.status] || '#475569', fontWeight: 500 }}>
                          {m.status === 'pending' ? '⏳ Pending' : '✓ Active'}
                        </span>
                        <span style={{ fontSize: 10, color: '#334155' }}>·</span>
                        <span style={{ fontSize: 10, color: '#334155' }}>
                          {new Date(m.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <RoleBadge role={m.role} />
                    <button onClick={() => removeMember(m.member_email)} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 16, padding: '2px 4px', lineHeight: 1, transition: 'color 0.15s' }}
                      onMouseEnter={e => e.target.style.color = '#f87171'}
                      onMouseLeave={e => e.target.style.color = '#334155'}
                      title="Remove member"
                    >✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Invite Form */}
          <div style={{ position: 'sticky', top: 70, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card>
              <CardLabel>Invite Team Member</CardLabel>

              {error   && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',   color: '#f87171', borderRadius: 8, padding: '10px 13px', fontSize: 12, marginTop: 10 }}>⚠️ {error}</div>}
              {success && <div style={{ background: 'rgba(34,197,94,0.07)',  border: '1px solid rgba(34,197,94,0.2)',  color: '#22c55e', borderRadius: 8, padding: '10px 13px', fontSize: 12, marginTop: 10 }}>✓ {success}</div>}

              <div style={{ marginTop: 14 }}>
                <FieldLabel>Email Address</FieldLabel>
                <input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && inviteMember()}
                  placeholder="colleague@example.com"
                  type="email"
                  style={inputSt}
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <FieldLabel>Role</FieldLabel>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['member', 'admin'].map(r => (
                    <button key={r} onClick={() => setInviteRole(r)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid', borderColor: inviteRole === r ? '#6366f1' : '#1e2033', background: inviteRole === r ? 'rgba(99,102,241,0.1)' : '#0f0f1a', color: inviteRole === r ? '#a5b4fc' : '#475569', cursor: 'pointer', fontSize: 12, fontWeight: inviteRole === r ? 600 : 400, textAlign: 'center', textTransform: 'capitalize', transition: 'all 0.15s' }}>
                      {r === 'admin' ? '🛡️ Admin' : '👤 Member'}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#334155', marginTop: 6, lineHeight: 1.5 }}>
                  {inviteRole === 'admin' ? 'Admin can invite members and see all replies.' : 'Member can compose replies and use shared inbox.'}
                </div>
              </div>

              <button onClick={inviteMember} disabled={!inviteEmail.trim() || inviting} style={{ width: '100%', background: inviteEmail.trim() && !inviting ? GRAD : '#131320', border: 'none', color: inviteEmail.trim() && !inviting ? 'white' : '#475569', padding: '11px', borderRadius: 10, cursor: inviteEmail.trim() && !inviting ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: 13, marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: inviteEmail.trim() && !inviting ? '0 0 16px rgba(99,102,241,0.2)' : 'none', transition: 'all 0.2s' }}>
                {inviting ? <><Spinner /> Sending...</> : '✉️ Send Invite'}
              </button>
            </Card>

            {/* Team Stats */}
            <Card>
              <CardLabel>Team Stats</CardLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {[
                  { label: 'Total Members',    value: members.length + 1,                                    color: '#6366f1' },
                  { label: 'Active',           value: members.filter(m => m.status === 'active').length + 1, color: '#22c55e' },
                  { label: 'Pending Invites',  value: members.filter(m => m.status === 'pending').length,    color: '#f59e0b' },
                  { label: 'Shared Replies',   value: replies.length,                                         color: '#06b6d4' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#475569' }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── SHARED INBOX TAB ── */}
      {activeTab === 'inbox' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedReply ? '1fr 1fr' : '1fr', gap: 20, alignItems: 'start' }}>

          {/* Reply List */}
          <div>
            {/* Filter Row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { label: `All (${replies.length})`,          filter: null        },
                { label: `Pending (${pendingCount})`,        filter: 'pending'   },
                { label: `Approved (${approvedCount})`,      filter: 'approved'  },
              ].map(f => (
                <button key={f.label} style={{ fontSize: 12, color: '#475569', background: '#0d0d1a', border: '1px solid #1e2033', padding: '6px 12px', borderRadius: 99, cursor: 'pointer' }}>
                  {f.label}
                </button>
              ))}
            </div>

            {replies.length === 0 ? (
              <div style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 16, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#475569', marginBottom: 6 }}>No shared replies yet</div>
                <div style={{ fontSize: 12, color: '#334155' }}>Replies saved by team members appear here</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {replies.map(r => (
                  <div key={r.id} onClick={() => setSelectedReply(selected => selected?.id === r.id ? null : r)} style={{ background: selectedReply?.id === r.id ? 'rgba(99,102,241,0.06)' : '#0d0d1a', border: `1px solid ${selectedReply?.id === r.id ? 'rgba(99,102,241,0.3)' : '#1e2033'}`, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (selectedReply?.id !== r.id) e.currentTarget.style.borderColor = '#6366f1' }}
                    onMouseLeave={e => { if (selectedReply?.id !== r.id) e.currentTarget.style.borderColor = '#1e2033' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
                        <StatusBadge status={r.status} />
                        {r.language && <Tag color="#06b6d4">{r.language}</Tag>}
                        {r.quality_score && <Tag color={r.quality_score >= 80 ? '#22c55e' : '#f59e0b'}>{r.quality_score}%</Tag>}
                      </div>
                      <span style={{ fontSize: 10, color: '#334155', whiteSpace: 'nowrap', marginLeft: 8 }}>
                        {new Date(r.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.subject || 'No subject'}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>
                      by {r.author_email?.split('@')[0]} · to {r.customer_email || 'customer'}
                    </div>
                    {r.comment && (
                      <div style={{ fontSize: 11, color: '#6366f1', marginTop: 6, background: 'rgba(99,102,241,0.06)', padding: '4px 8px', borderRadius: 6 }}>
                        💬 {r.comment.substring(0, 60)}{r.comment.length > 60 ? '…' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reply Detail Panel */}
          {selectedReply && (
            <div style={{ position: 'sticky', top: 70, background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 18, padding: 22, animation: 'fadeUp 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #1e2033' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{selectedReply.subject}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>by {selectedReply.author_email}</div>
                </div>
                <button onClick={() => setSelectedReply(null)} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 18 }}>✕</button>
              </div>

              {/* Quality + Language */}
              <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
                <StatusBadge status={selectedReply.status} />
                {selectedReply.language && <Tag color="#06b6d4">🌐 {selectedReply.language}</Tag>}
                {selectedReply.quality_score && <Tag color={selectedReply.quality_score >= 80 ? '#22c55e' : '#f59e0b'}>⭐ {selectedReply.quality_score}%</Tag>}
                {selectedReply.tone && <Tag color="#475569">{selectedReply.tone}</Tag>}
              </div>

              {/* Reply text */}
              <div style={{ background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
                {selectedReply.reply}
              </div>

              {/* Comment */}
              <div style={{ marginBottom: 14 }}>
                <FieldLabel>Team Comment</FieldLabel>
                <textarea
                  value={comment || selectedReply.comment || ''}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Leave a note for your team..."
                  rows={2}
                  style={{ ...inputSt, resize: 'none', marginTop: 6, lineHeight: 1.5 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
                  onBlur={e => e.target.style.borderColor = '#1e2033'}
                />
                <button onClick={() => saveComment(selectedReply.id)} disabled={savingComment} style={{ marginTop: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                  {savingComment ? 'Saving…' : '💬 Save Comment'}
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => updateReplyStatus(selectedReply.id, 'approved')} style={{ flex: 1, background: selectedReply.status === 'approved' ? 'rgba(34,197,94,0.15)' : '#131320', border: `1px solid ${selectedReply.status === 'approved' ? 'rgba(34,197,94,0.3)' : '#1e2033'}`, color: selectedReply.status === 'approved' ? '#22c55e' : '#475569', padding: '9px', borderRadius: 9, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}>
                  ✓ Approve
                </button>
                <button onClick={() => updateReplyStatus(selectedReply.id, 'rejected')} style={{ flex: 1, background: selectedReply.status === 'rejected' ? 'rgba(239,68,68,0.1)' : '#131320', border: `1px solid ${selectedReply.status === 'rejected' ? 'rgba(239,68,68,0.2)' : '#1e2033'}`, color: selectedReply.status === 'rejected' ? '#f87171' : '#475569', padding: '9px', borderRadius: 9, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}>
                  ✕ Reject
                </button>
                <button onClick={() => navigator.clipboard.writeText(selectedReply.reply)} style={{ background: '#131320', border: '1px solid #1e2033', color: '#475569', padding: '9px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 13 }}>
                  📋
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Small Components ─────────────────────────────────────────────────────

function RoleBadge({ role }) {
  const color = ROLE_COLORS[role] || '#475569'
  return (
    <span style={{ fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}30`, padding: '3px 9px', borderRadius: 99, fontWeight: 600, textTransform: 'capitalize' }}>
      {role === 'owner' ? '👑 Owner' : role === 'admin' ? '🛡️ Admin' : '👤 Member'}
    </span>
  )
}

function StatusBadge({ status }) {
  const color = status === 'approved' ? '#22c55e' : status === 'rejected' ? '#f87171' : status === 'pending' ? '#f59e0b' : '#475569'
  return (
    <span style={{ fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}30`, padding: '3px 9px', borderRadius: 99, fontWeight: 600, textTransform: 'capitalize' }}>
      {status === 'pending' ? '⏳ Pending' : status === 'approved' ? '✓ Approved' : status === 'rejected' ? '✕ Rejected' : status}
    </span>
  )
}


function Tag({ children, color }) {
  return <span style={{ fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}30`, padding: '2px 7px', borderRadius: 99, fontWeight: 500 }}>{children}</span>
}