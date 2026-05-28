'use client'
import { Card, CardLabel } from './ui'

const TONES = [
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'friendly',     label: 'Friendly',     icon: '😊' },
  { id: 'formal',       label: 'Formal',        icon: '🎩' },
  { id: 'casual',       label: 'Casual',        icon: '👋' },
]

export default function Analytics({ history, saved }) {
  const total      = history.length
  const avgQuality = total ? Math.round(history.reduce((a, h) => a + (h.qualityScore || 0), 0) / total) : 0
  const languages  = [...new Set(history.map(h => h.detectedLanguage).filter(Boolean))]
  const tones      = TONES.map(t => ({ ...t, count: history.filter(h => h.tone === t.id).length }))
  const topTone    = [...tones].sort((a, b) => b.count - a.count)[0]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 6, letterSpacing: '-0.3px' }}>Analytics</h2>
      <p style={{ fontSize: 13, color: '#475569', marginBottom: 28 }}>Your session overview</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Replies', value: total,          unit: '',     color: '#6366f1', icon: '✉️' },
          { label: 'Avg Quality',   value: avgQuality,     unit: '%',    color: '#22c55e', icon: '⭐' },
          { label: 'Time Saved',    value: total * 4,      unit: ' min', color: '#06b6d4', icon: '⏱️' },
          { label: 'Saved',         value: saved.length,   unit: '',     color: '#f59e0b', icon: '💾' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0d0d18', border: '1px solid #1e1e2e', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: '-0.5px' }}>{s.value}{s.unit}</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card>
          <CardLabel>Tone Usage</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            {tones.map(t => (
              <div key={t.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.icon} {t.label}</span>
                  <span style={{ fontSize: 12, color: '#475569' }}>{t.count}</span>
                </div>
                <div style={{ height: 4, background: '#1e1e2e', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: total ? `${(t.count / total) * 100}%` : '0%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardLabel>Languages</CardLabel>
          {languages.length === 0
            ? <div style={{ fontSize: 12, color: '#334155', padding: '20px 0', textAlign: 'center' }}>No data yet</div>
            : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {languages.map(l => {
                  const count = history.filter(h => h.detectedLanguage === l).length
                  return (
                    <div key={l} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 9, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>{l}</span>
                      <span style={{ fontSize: 11, color: '#475569' }}>{count}x</span>
                    </div>
                  )
                })}
              </div>
          }
          {total > 0 && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Most used tone</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#a5b4fc' }}>{topTone?.icon} {topTone?.label}</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}