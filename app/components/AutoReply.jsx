'use client'
import { useState, useEffect } from 'react'
import { GRAD, Card, CardLabel, FieldLabel, inputSt, Spinner } from './ui'

const TONES         = [{ id: 'professional', label: 'Professional', icon: '💼' }, { id: 'friendly', label: 'Friendly', icon: '😊' }, { id: 'formal', label: 'Formal', icon: '🎩' }, { id: 'casual', label: 'Casual', icon: '👋' }]
const BUSINESS_TYPES = ['Hair Salon', 'Beauty Salon', 'Nail Studio', 'Massage Studio', 'Online Shop', 'Local Service']
const LANGUAGES     = [{ id: 'auto', label: '🌐 Auto Detect' }, { id: 'en', label: '🇬🇧 English' }, { id: 'de', label: '🇩🇪 Deutsch' }, { id: 'fr', label: '🇫🇷 Français' }, { id: 'es', label: '🇪🇸 Español' }, { id: 'tr', label: '🇹🇷 Türkçe' }]

export default function AutoReply({ user }) {
  const [enabled, setEnabled]           = useState(false)
  const [tone, setTone]                 = useState('professional')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('Hair Salon')
  const [language, setLanguage]         = useState('auto')
  const [signature, setSignature]       = useState('')
  const [saving, setSaving]             = useState(false)
  const [saveSuccess, setSaveSuccess]   = useState(false)
  const [processing, setProcessing]     = useState(false)
  const [processed, setProcessed]       = useState([])
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(true)
  const [stats, setStats]               = useState({ total: 0, sent: 0, skipped: 0 })

  // Load settings on mount
  useEffect(() => {
    if (!user?.email) return
    fetch(`/api/auto-reply/settings?email=${user.email}`)
      .then(r => r.json())
      .then(({ settings }) => {
        if (settings) {
          setEnabled(settings.enabled || false)
          setTone(settings.tone || 'professional')
          setBusinessName(settings.business_name || '')
          setBusinessType(settings.business_type || 'Hair Salon')
          setLanguage(settings.language || 'auto')
          setSignature(settings.signature || '')
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  async function saveSettings() {
    setSaving(true); setSaveSuccess(false); setError('')
    try {
      const res  = await fetch('/api/auto-reply/settings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: user.email, enabled, tone, businessName, businessType, language, signature }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  async function runNow() {
    setProcessing(true); setError(''); setProcessed([])
    try {
      const res  = await fetch('/api/auto-reply/process', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userEmail: user.email, autoSend: true }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setProcessed(data.processed || [])
      setStats({
        total:   data.processed?.length || 0,
        sent:    data.processed?.filter(e => e.sent).length || 0,
        skipped: data.processed?.filter(e => !e.sent).length || 0,
      })
    } catch (e) { setError(e.message) }
    setProcessing(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 10, color: '#475569', fontSize: 13 }}>
        <Spinner /> Loading settings...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px', marginBottom: 4 }}>Auto-Reply</h2>
          <p style={{ fontSize: 13, color: '#475569' }}>Let AI automatically reply to your customer emails</p>
        </div>

        {/* Master Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0d0d1a', border: `1px solid ${enabled ? 'rgba(34,197,94,0.3)' : '#1e2033'}`, borderRadius: 12, padding: '10px 16px' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: enabled ? '#22c55e' : '#475569' }}>
              {enabled ? '🟢 Auto-Reply ON' : '⚫ Auto-Reply OFF'}
            </div>
            <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>
              {enabled ? 'Replying automatically' : 'Manual mode'}
            </div>
          </div>
          <button
            onClick={() => setEnabled(v => !v)}
            style={{ width: 44, height: 24, borderRadius: 12, background: enabled ? 'linear-gradient(135deg,#22c55e,#16a34a)' : '#1e2033', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
          >
            <div style={{ position: 'absolute', top: 3, left: enabled ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Business Settings */}
          <Card>
            <CardLabel>Business Settings</CardLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              <div>
                <FieldLabel>Business Name</FieldLabel>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Maria's Hair Studio" style={inputSt} />
              </div>
              <div>
                <FieldLabel>Business Type</FieldLabel>
                <select value={businessType} onChange={e => setBusinessType(e.target.value)} style={inputSt}>
                  {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </Card>

          {/* Tone + Language */}
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <CardLabel>Reply Tone</CardLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
                  {TONES.map(t => (
                    <button key={t.id} onClick={() => setTone(t.id)} style={{ padding: '8px 4px', borderRadius: 8, border: '1px solid', borderColor: tone === t.id ? '#6366f1' : '#1e2033', background: tone === t.id ? 'rgba(99,102,241,0.1)' : '#0f0f1a', color: tone === t.id ? '#a5b4fc' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: tone === t.id ? 600 : 400, textAlign: 'center', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 16, marginBottom: 3 }}>{t.icon}</div>{t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <CardLabel>Language</CardLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
                  {LANGUAGES.map(l => (
                    <button key={l.id} onClick={() => setLanguage(l.id)} style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid', borderColor: language === l.id ? '#6366f1' : '#1e2033', background: language === l.id ? 'rgba(99,102,241,0.08)' : '#0f0f1a', color: language === l.id ? '#a5b4fc' : '#475569', cursor: 'pointer', fontSize: 12, fontWeight: language === l.id ? 600 : 400, textAlign: 'left', transition: 'all 0.15s' }}>{l.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Signature */}
          <Card>
            <CardLabel>Email Signature</CardLabel>
            <p style={{ fontSize: 12, color: '#475569', margin: '6px 0 10px' }}>Added at the end of every auto-reply</p>
            <textarea
              value={signature}
              onChange={e => setSignature(e.target.value)}
              placeholder={`Best regards,\nMaria\nMaria's Hair Studio\n+49 123 456789`}
              rows={4}
              style={{ width: '100%', background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 9, padding: '10px 13px', color: '#e2e8f0', fontSize: 13, resize: 'none', fontFamily: 'inherit', outline: 'none', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
              onBlur={e => e.target.style.borderColor = '#1e2033'}
            />
          </Card>

          {/* Save Button */}
          <button onClick={saveSettings} disabled={saving} style={{ background: saveSuccess ? 'rgba(34,197,94,0.1)' : GRAD, border: saveSuccess ? '1px solid rgba(34,197,94,0.3)' : 'none', color: saveSuccess ? '#22c55e' : 'white', padding: '12px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: saveSuccess ? 'none' : '0 0 20px rgba(99,102,241,0.2)', transition: 'all 0.2s' }}>
            {saving ? <><Spinner /> Saving...</> : saveSuccess ? '✓ Settings Saved!' : 'Save Settings'}
          </button>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 70 }}>

          {/* Run Now */}
          <div style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.06),rgba(99,102,241,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Run Auto-Reply Now</div>
            <div style={{ fontSize: 12, color: '#475569', marginBottom: 14, lineHeight: 1.5 }}>Check inbox and reply to unread emails immediately</div>
            <button onClick={runNow} disabled={processing} style={{ width: '100%', background: processing ? '#131320' : GRAD, border: 'none', color: processing ? '#475569' : 'white', padding: '10px', borderRadius: 9, cursor: processing ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: processing ? 'none' : '0 0 16px rgba(99,102,241,0.25)', transition: 'all 0.2s' }}>
              {processing ? <><Spinner /> Processing...</> : '⚡ Run Now'}
            </button>
          </div>

          {/* Stats */}
          {stats.total > 0 && (
            <Card>
              <CardLabel>Last Run Results</CardLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <StatItem label="Emails Processed" value={stats.total}   color="#6366f1" />
                <StatItem label="Replies Sent"     value={stats.sent}    color="#22c55e" />
                <StatItem label="Skipped"          value={stats.skipped} color="#475569" />
              </div>
            </Card>
          )}

          {/* How it works */}
          <Card>
            <CardLabel>How it works</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {[
                { n: '1', text: 'AI reads your unread emails' },
                { n: '2', text: 'Generates a professional reply' },
                { n: '3', text: 'Sends it automatically' },
                { n: '4', text: 'Marks email as read' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#6366f1', flexShrink: 0 }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{s.text}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Processed Emails */}
      {processed.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>Processed Emails</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {processed.map((e, i) => (
              <div key={i} style={{ background: '#0d0d1a', border: `1px solid ${e.sent ? 'rgba(34,197,94,0.2)' : '#1e2033'}`, borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{e.from?.split('<')[0]?.trim() || e.from}</span>
                    {e.detectedLanguage && <Tag color="#06b6d4">{e.detectedLanguage}</Tag>}
                    {e.qualityScore && <Tag color={e.qualityScore >= 80 ? '#22c55e' : '#f59e0b'}>{e.qualityScore}%</Tag>}
                  </div>
                  <Tag color={e.sent ? '#22c55e' : '#475569'}>{e.sent ? '✓ Sent' : 'Skipped'}</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>Subject: {e.subject}</div>
                {e.aiReply && (
                  <div style={{ background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 9, padding: '10px 13px', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                    {e.aiReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatItem({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}

function Tag({ children, color }) {
  return <span style={{ fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}30`, padding: '2px 7px', borderRadius: 99, fontWeight: 500 }}>{children}</span>
}