'use client'
import { useState } from 'react'
import { Card, CardLabel, FieldLabel, inputSt, GRAD } from './ui'

const TONES         = [{ id: 'professional', label: 'Professional', icon: '💼' }, { id: 'friendly', label: 'Friendly', icon: '😊' }, { id: 'formal', label: 'Formal', icon: '🎩' }, { id: 'casual', label: 'Casual', icon: '👋' }]
const BUSINESS_TYPES = ['Hair Salon', 'Beauty Salon', 'Nail Studio', 'Massage Studio', 'Online Shop', 'Local Service']

export default function Settings({ user, onLogout }) {
  const [name, setName]   = useState('')
  const [type, setType]   = useState('Hair Salon')
  const [tone, setTone]   = useState('friendly')
  const [saved, setSavedLocal] = useState(false)

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '28px 24px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 6, letterSpacing: '-0.3px' }}>Settings</h2>
      <p style={{ fontSize: 13, color: '#475569', marginBottom: 28 }}>Manage your account and preferences</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Account Info */}
        {user && (
          <Card>
            <CardLabel>Account</CardLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18, boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}>
                {user.email?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{user.email}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Free Plan · {new Date(user.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </Card>
        )}

        {/* Business */}
        <Card>
          <CardLabel>Default Business</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <div><FieldLabel>Name</FieldLabel><input value={name} onChange={e => setName(e.target.value)} placeholder="Maria's Hair Studio" style={inputSt} /></div>
            <div><FieldLabel>Type</FieldLabel>
              <select value={type} onChange={e => setType(e.target.value)} style={inputSt}>
                {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </Card>

        {/* Tone */}
        <Card>
          <CardLabel>Default Tone</CardLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 12 }}>
            {TONES.map(t => (
              <button key={t.id} onClick={() => setTone(t.id)} style={{ padding: '10px 6px', borderRadius: 9, border: '1px solid', borderColor: tone === t.id ? '#6366f1' : '#1e2033', background: tone === t.id ? 'rgba(99,102,241,0.1)' : '#0f0f1a', color: tone === t.id ? '#a5b4fc' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: tone === t.id ? 600 : 400, textAlign: 'center', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>{t.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Plan */}
        <Card>
          <CardLabel>Current Plan</CardLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Free Plan</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>50 replies / month</div>
            </div>
            <button style={{ background: GRAD, border: 'none', color: 'white', padding: '8px 18px', borderRadius: 9, cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: '0 0 16px rgba(99,102,241,0.25)' }}>
              Upgrade →
            </button>
          </div>
        </Card>

        {/* About */}
        <Card>
          <CardLabel>About</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {[['Version', 'v9'], ['Model', 'Claude Sonnet 4'], ['Auth', 'Supabase'], ['Status', '✅ Active']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#475569' }}>{k}</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <button onClick={() => { setSavedLocal(true); setTimeout(() => setSavedLocal(false), 2000) }} style={{ background: saved ? 'rgba(34,197,94,0.1)' : GRAD, border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', color: saved ? '#22c55e' : 'white', padding: '12px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>

        {user && (
          <button onClick={onLogout} style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171', padding: '11px', borderRadius: 10, cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
            Sign Out
          </button>
        )}
      </div>
    </div>
  )
}