'use client'
import { useState } from 'react'
import { Card, CardLabel, FieldLabel, StatRow, copyBtnSt, actionBtn, primaryBtn, inputSt, Spinner, GRAD } from './ui'
import { UsageBar, LimitReachedModal } from './PlanBadge'

const TONES = [
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'friendly',     label: 'Friendly',     icon: '😊' },
  { id: 'formal',       label: 'Formal',        icon: '🎩' },
  { id: 'casual',       label: 'Casual',        icon: '👋' },
]

const LANGUAGES = [
  { id: 'auto', label: '🌐 Auto' },
  { id: 'en',   label: '🇬🇧 English' },
  { id: 'de',   label: '🇩🇪 Deutsch' },
  { id: 'fr',   label: '🇫🇷 Français' },
  { id: 'es',   label: '🇪🇸 Español' },
  { id: 'tr',   label: '🇹🇷 Türkçe' },
]

const BUSINESS_TYPES = ['Hair Salon', 'Beauty Salon', 'Nail Studio', 'Massage Studio', 'Online Shop', 'Local Service']

const TEMPLATES = [
  { icon: '📅', label: 'Appointment',  text: 'Hi, I would like to book an appointment for next week. What times are available?' },
  { icon: '🔄', label: 'Reschedule',   text: 'Can I reschedule my appointment from Friday to Saturday morning?' },
  { icon: '❌', label: 'Cancellation', text: 'I need to cancel my appointment for tomorrow. Sorry for the short notice.' },
  { icon: '💰', label: 'Pricing',      text: 'How much does a haircut and color treatment cost?' },
  { icon: '🎁', label: 'Gift Card',    text: 'Do you sell gift cards? I want to buy one as a birthday present.' },
  { icon: '⭐', label: 'Complaint',    text: 'I was not satisfied with my last visit. The result was not what I expected.' },
]

export default function Compose({ saved, setSaved, history, setHistory, user, planData, onUpgrade, isMobile }) {
  const [email, setEmail]               = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('Hair Salon')
  const [tone, setTone]                 = useState('friendly')
  const [language, setLanguage]         = useState('auto')
  const [result, setResult]             = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [copied, setCopied]             = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSettings, setShowSettings] = useState(!isMobile)
  const [saveSuccess, setSaveSuccess]   = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)

  const { plan, usage, limit, remaining, isLimitReached, usagePercent, incrementUsage } = planData

  async function generate() {
    if (!email.trim() || loading) return
    if (isLimitReached) { setShowLimitModal(true); return }
    setLoading(true); setResult(null); setError('')
    try {
      const res  = await fetch('/api/reply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, businessName, businessType, tone, language }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      incrementUsage()
      setHistory(prev => [{ email, ...data, tone, time: new Date().toLocaleTimeString(), id: Date.now() }, ...prev].slice(0, 20))
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 2000)
  }

  function saveReply() {
    if (!result) return
    setSaved(prev => [{ email, ...result, tone, time: new Date().toLocaleTimeString(), id: Date.now(), businessName }, ...prev])
    setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 2000)
  }

  const pad = isMobile ? '16px' : '28px 24px'

  return (
    <>
      {showLimitModal && (
        <LimitReachedModal plan={plan} onUpgrade={(id) => { setShowLimitModal(false); onUpgrade(id) }} onClose={() => setShowLimitModal(false)} />
      )}

      <div style={{ maxWidth: isMobile ? '100%' : 1040, margin: '0 auto', padding: pad }}>

        {/* Mobile: collapsible settings */}
        {isMobile && (
          <button onClick={() => setShowSettings(v => !v)} style={{ width: '100%', background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 12, padding: '12px 16px', color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 12 }}>
            <span>⚙️ Settings — {businessName || 'Not set'} · {tone}</span>
            <span style={{ fontSize: 11 }}>{showSettings ? '▲' : '▼'}</span>
          </button>
        )}

        <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: '1fr 270px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 14 }}>

            {/* Usage Bar */}
            <UsageBar plan={plan} usage={usage} limit={limit} usagePercent={usagePercent} onUpgrade={onUpgrade} />

            {/* Settings — collapsible on mobile */}
            {showSettings && (
              <>
                <Card>
                  <CardLabel>Business</CardLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                    <div><FieldLabel>Name</FieldLabel><input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Maria's Studio" style={inputSt} /></div>
                    <div><FieldLabel>Type</FieldLabel><select value={businessType} onChange={e => setBusinessType(e.target.value)} style={inputSt}>{BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                  </div>
                </Card>

                <Card>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <CardLabel>Tone</CardLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginTop: 8 }}>
                        {TONES.map(t => (
                          <button key={t.id} onClick={() => setTone(t.id)} style={{ padding: isMobile ? '10px 4px' : '9px 4px', borderRadius: 8, border: '1px solid', borderColor: tone === t.id ? '#6366f1' : '#1e2033', background: tone === t.id ? 'rgba(99,102,241,0.1)' : '#0f0f1a', color: tone === t.id ? '#a5b4fc' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: tone === t.id ? 600 : 400, textAlign: 'center', transition: 'all 0.15s' }}>
                            <div style={{ fontSize: isMobile ? 18 : 16, marginBottom: 3 }}>{t.icon}</div>{t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <CardLabel>Language</CardLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                        {LANGUAGES.map(l => (
                          <button key={l.id} onClick={() => setLanguage(l.id)} style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid', borderColor: language === l.id ? '#6366f1' : '#1e2033', background: language === l.id ? 'rgba(99,102,241,0.08)' : '#0f0f1a', color: language === l.id ? '#a5b4fc' : '#475569', cursor: 'pointer', fontSize: 12, fontWeight: language === l.id ? 600 : 400, textAlign: 'left', transition: 'all 0.15s' }}>{l.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Email Input */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <CardLabel style={{ margin: 0 }}>Customer Email</CardLabel>
                <button onClick={() => setShowTemplates(v => !v)} style={{ fontSize: 12, color: showTemplates ? '#6366f1' : '#475569', background: showTemplates ? 'rgba(99,102,241,0.08)' : '#0f0f1a', border: '1px solid', borderColor: showTemplates ? 'rgba(99,102,241,0.3)' : '#1e2033', padding: '5px 10px', borderRadius: 7, cursor: 'pointer' }}>
                  📋 Templates
                </button>
              </div>

              {showTemplates && (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 6, marginBottom: 12 }}>
                  {TEMPLATES.map(t => (
                    <button key={t.label} onClick={() => { setEmail(t.text); setShowTemplates(false) }} style={{ background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 9, padding: isMobile ? '12px 8px' : '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2033' }}
                    >
                      <div style={{ fontSize: isMobile ? 18 : 14, marginBottom: 4 }}>{t.icon}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{t.label}</div>
                    </button>
                  ))}
                </div>
              )}

              <textarea
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) generate() }}
                placeholder="Paste the customer email here..."
                rows={isMobile ? 4 : 5}
                style={{ width: '100%', background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 10, padding: '12px 14px', color: '#e2e8f0', fontSize: isMobile ? 16 : 14, resize: 'none', lineHeight: 1.65, fontFamily: 'inherit', outline: 'none', marginBottom: 10 }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
                onBlur={e => e.target.style.borderColor = '#1e2033'}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#334155' }}>{email.length} chars</span>
                <button onClick={isLimitReached ? () => setShowLimitModal(true) : generate} disabled={(!email.trim() || loading) && !isLimitReached}
                  style={{ ...primaryBtn(email.trim() && !loading && !isLimitReached), fontSize: isMobile ? 14 : 13, padding: isMobile ? '12px 24px' : '10px 22px' }}>
                  {loading ? <><Spinner /> Generating...</> : isLimitReached ? '🚫 Limit Reached' : '✨ Generate Reply'}
                </button>
              </div>
            </Card>

            {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 12, padding: '14px 16px', fontSize: 13 }}>⚠️ {error}</div>}

            {/* Result */}
            {result && (
              <div style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.04),rgba(99,102,241,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 18, padding: isMobile ? 18 : 24, animation: 'fadeUp 0.3s ease' }}>

                {result.qualityScore && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid #1e2033' }}>
                    <span style={{ fontSize: 12, color: '#475569' }}>Quality</span>
                    <div style={{ flex: 1, height: 4, background: '#1e2033', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${result.qualityScore}%`, background: result.qualityScore >= 80 ? '#22c55e' : '#f59e0b', borderRadius: 99, transition: 'width 0.6s ease' }} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: result.qualityScore >= 80 ? '#22c55e' : '#f59e0b' }}>{result.qualityScore}%</span>
                  </div>
                )}

                {result.subject && (
                  <div style={{ marginBottom: 14 }}>
                    <FieldLabel>Subject Line</FieldLabel>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 9, padding: '10px 14px' }}>
                      <span style={{ fontSize: 13, color: '#94a3b8', flex: 1, marginRight: 8 }}>{result.subject}</span>
                      <button onClick={() => copy(result.subject, 'subject')} style={copyBtnSt(copied === 'subject')}>{copied === 'subject' ? '✓' : '📋'}</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FieldLabel style={{ margin: 0 }}>Reply</FieldLabel>
                    {result.detectedLanguage && <span style={{ fontSize: 10, color: '#06b6d4', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', padding: '2px 8px', borderRadius: 99 }}>🌐 {result.detectedLanguage}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => copy(result.reply, 'reply')} style={copyBtnSt(copied === 'reply')}>{copied === 'reply' ? '✓ Copied' : '📋 Copy'}</button>
                    <button onClick={() => copy(`Subject: ${result.subject}\n\n${result.reply}`, 'full')} style={copyBtnSt(copied === 'full')}>{copied === 'full' ? '✓' : '📧 Full'}</button>
                    <button onClick={saveReply} style={{ ...copyBtnSt(saveSuccess), color: saveSuccess ? '#22c55e' : '#f59e0b' }}>{saveSuccess ? '✓ Saved!' : '💾 Save'}</button>
                  </div>
                </div>

                <div style={{ background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 12, padding: '16px 18px', fontSize: isMobile ? 15 : 14, color: '#cbd5e1', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{result.reply}</div>

                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button onClick={generate} style={{ ...actionBtn, fontSize: isMobile ? 13 : 12, padding: isMobile ? '10px 16px' : '7px 14px' }}>🔄 Regenerate</button>
                  <button onClick={() => { setEmail(''); setResult(null) }} style={{ ...actionBtn, fontSize: isMobile ? 13 : 12, padding: isMobile ? '10px 16px' : '7px 14px' }}>✉️ New</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — desktop only */}
          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 70 }}>
              <Card>
                <CardLabel>Stats</CardLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  <StatRow label="Replies"     value={history.length}  color="#6366f1" />
                  <StatRow label="Saved"       value={saved.length}    color="#f59e0b" />
                  <StatRow label="Time Saved"  value={`~${history.length * 4}m`} color="#06b6d4" />
                  <StatRow label="Avg Quality" value={history.length ? Math.round(history.reduce((a, h) => a + (h.qualityScore || 0), 0) / history.length) + '%' : '—'} color="#22c55e" />
                </div>
              </Card>
              <Card>
                <CardLabel>Recent</CardLabel>
                {history.length === 0
                  ? <div style={{ fontSize: 12, color: '#334155', textAlign: 'center', padding: '16px 0' }}>No replies yet.</div>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
                      {history.slice(0, 4).map((h, i) => (
                        <div key={i} onClick={() => { setEmail(h.email); setResult(h) }} style={{ background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 9, padding: '9px 11px', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2033' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: '#334155' }}>{h.time}</span>
                            {h.qualityScore && <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>{h.qualityScore}%</span>}
                          </div>
                          <div style={{ fontSize: 11, color: '#475569', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>{h.email}</div>
                        </div>
                      ))}
                    </div>
                }
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}