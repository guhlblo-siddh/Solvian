'use client'
import { useState, useEffect, useCallback } from 'react'
import { GRAD, Card, CardLabel, primaryBtn, copyBtnSt, Spinner } from './ui'

export default function Gmail({ planData, onUpgrade }) {
  const [connected, setConnected]   = useState(false)
  const [emails, setEmails]         = useState([])
  const [selected, setSelected]     = useState(null)
  const [reply, setReply]           = useState('')
  const [subject, setSubject]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [generating, setGenerating] = useState(false)
  const [sending, setSending]       = useState(false)
  const [error, setError]           = useState('')
  const [sent, setSent]             = useState(false)
  const [fetching, setFetching]     = useState(true)

  // Check connection and load inbox on mount
  useEffect(() => {
    loadInbox()

    // Check URL params for connection status
    const params = new URLSearchParams(window.location.search)
    if (params.get('gmail') === 'connected') {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  async function loadInbox() {
    setFetching(true)
    setError('')
    try {
      const res  = await fetch('/api/gmail/inbox')
      const data = await res.json()

      if (data.connected === false) {
        setConnected(false)
      } else {
        setConnected(true)
        setEmails(data.emails || [])
      }
    } catch {
      setConnected(false)
    }
    setFetching(false)
  }

  async function generateReply(email) {
    if (!email) return
    setGenerating(true)
    setReply('')
    setError('')

    try {
      const res  = await fetch('/api/reply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email:        email.body,
          businessName: '',
          businessType: 'local service',
          tone:         'professional',
          language:     'auto',
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setReply(data.reply)
      setSubject(data.subject || `Re: ${email.subject}`)
    } catch (e) {
      setError(e.message)
    }
    setGenerating(false)
  }

  async function sendReply() {
    if (!selected || !reply.trim()) return
    setSending(true)
    setError('')

    try {
      const res  = await fetch('/api/gmail/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          to:       selected.from,
          subject,
          body:     reply,
          threadId: selected.threadId,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setSent(true)
      setTimeout(() => {
        setSent(false)
        setSelected(null)
        setReply('')
        loadInbox()
      }, 2000)

    } catch (e) {
      setError(e.message)
    }
    setSending(false)
  }

  // Not connected UI
  if (!connected && !fetching) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 24, padding: 48 }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>📬</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.3px' }}>
            Connect your Gmail
          </h2>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, maxWidth: 380, margin: '0 auto 32px' }}>
            Connect your Gmail inbox to read customer emails and send AI-generated replies directly from Solvian.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300, margin: '0 auto 28px' }}>
            {['Read your inbox emails', 'Generate AI replies instantly', 'Send replies with one click', 'Auto-mark as read after sending'].map(f => (
              <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: '#94a3b8', textAlign: 'left' }}>
                <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
          </div>

          <a href="/api/gmail/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'white', border: 'none', color: '#1a1a2e', padding: '12px 28px', borderRadius: 11, cursor: 'pointer', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Connect Gmail
          </a>

          <p style={{ fontSize: 11, color: '#334155', marginTop: 16 }}>
            🔒 Read & send permissions only · Disconnect anytime
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20, alignItems: 'start' }}>

      {/* Inbox */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px' }}>Gmail Inbox</h2>
            <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{emails.length} unread emails</p>
          </div>
          <button onClick={loadInbox} disabled={fetching} style={{ background: '#0d0d1a', border: '1px solid #1e2033', color: '#475569', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            {fetching ? <><Spinner /> Refreshing</> : '🔄 Refresh'}
          </button>
        </div>

        {fetching ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 10, color: '#475569', fontSize: 13 }}>
            <Spinner /> Loading emails...
          </div>
        ) : emails.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#334155' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, color: '#475569', fontWeight: 600 }}>No unread emails</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Your inbox is empty</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {emails.map(email => (
              <div key={email.id} onClick={() => { setSelected(email); generateReply(email); setSent(false) }} style={{ background: selected?.id === email.id ? 'rgba(99,102,241,0.08)' : '#0d0d1a', border: `1px solid ${selected?.id === email.id ? 'rgba(99,102,241,0.35)' : '#1e2033'}`, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (selected?.id !== email.id) { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}}
                onMouseLeave={e => { if (selected?.id !== email.id) { e.currentTarget.style.borderColor = '#1e2033'; e.currentTarget.style.background = '#0d0d1a' }}}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {email.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: GRAD, flexShrink: 0 }} />}
                    <span style={{ fontSize: 13, fontWeight: email.unread ? 700 : 500, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                      {email.from?.split('<')[0]?.trim() || email.from}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#334155', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {new Date(email.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.subject}</div>
                <div style={{ fontSize: 12, color: '#475569', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>{email.snippet}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Panel */}
      {selected && (
        <div style={{ position: 'sticky', top: 70 }}>
          <div style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 18, padding: 22, animation: 'fadeUp 0.2s ease' }}>

            {/* Email Header */}
            <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #1e2033' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{selected.subject}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>from: {selected.from}</div>
                </div>
                <button onClick={() => { setSelected(null); setReply('') }} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
              </div>
            </div>

            {/* Original Email */}
            <div style={{ background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 10, padding: '12px 14px', marginBottom: 16, maxHeight: 140, overflowY: 'auto' }}>
              <div style={{ fontSize: 11, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Original Message</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selected.body?.substring(0, 400)}{selected.body?.length > 400 ? '…' : ''}</div>
            </div>

            {/* Generated Reply */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.7px' }}>AI Reply</div>
                <button onClick={() => generateReply(selected)} disabled={generating} style={{ fontSize: 11, color: '#6366f1', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {generating ? <><Spinner /> Generating</> : '🔄 Regenerate'}
                </button>
              </div>

              {generating ? (
                <div style={{ background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 10, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#475569', fontSize: 13 }}>
                  <Spinner /> Generating AI reply...
                </div>
              ) : (
                <>
                  {/* Subject */}
                  <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Subject..."
                    style={{ width: '100%', background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 8, padding: '8px 12px', color: '#e2e8f0', fontSize: 12, outline: 'none', fontFamily: 'inherit', marginBottom: 8 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
                    onBlur={e => e.target.style.borderColor = '#1e2033'}
                  />
                  {/* Reply body */}
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    rows={6}
                    style={{ width: '100%', background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 10, padding: '12px 14px', color: '#e2e8f0', fontSize: 13, resize: 'none', lineHeight: 1.65, fontFamily: 'inherit', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
                    onBlur={e => e.target.style.borderColor = '#1e2033'}
                  />
                </>
              )}
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '10px 13px', fontSize: 12, marginBottom: 12 }}>⚠️ {error}</div>
            )}

            {sent && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', borderRadius: 8, padding: '10px 13px', fontSize: 13, marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>
                ✓ Reply sent successfully!
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={sendReply}
              disabled={!reply.trim() || sending || generating || sent}
              style={{ width: '100%', background: sent ? 'rgba(34,197,94,0.1)' : reply.trim() && !sending ? GRAD : '#131320', border: sent ? '1px solid rgba(34,197,94,0.3)' : 'none', color: sent ? '#22c55e' : reply.trim() && !sending ? 'white' : '#475569', padding: '11px', borderRadius: 10, cursor: reply.trim() && !sending ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: reply.trim() && !sending && !sent ? '0 0 20px rgba(99,102,241,0.25)' : 'none', transition: 'all 0.2s' }}
            >
              {sending ? <><Spinner /> Sending...</>
               : sent   ? '✓ Sent!'
               : '📤 Send Reply'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}