'use client'
import { useState, useEffect } from 'react'
import { GRAD, Spinner } from './ui'

const PLAN_LIMITS = { free: 10, starter: 50, standard: 500, pro: Infinity }

export default function Dashboard({ user, planData, onUpgrade }) {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!user?.email) return
    fetchStats()
  }, [user])

  async function fetchStats() {
    setLoading(true); setError('')
    try {
      const res  = await fetch(`/api/stats?email=${user.email}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStats(data)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 10, color: '#475569', fontSize: 13 }}>
        <Spinner /> Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 14, padding: 24, fontSize: 14 }}>
          ⚠️ {error}
          <br />
          <button onClick={fetchStats} style={{ marginTop: 12, background: GRAD, border: 'none', color: 'white', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Retry</button>
        </div>
      </div>
    )
  }

  const plan      = stats?.plan || planData?.plan || 'free'
  const limit     = PLAN_LIMITS[plan] ?? 10
  const usage     = planData?.usage || 0
  const pct       = limit === Infinity ? 0 : Math.min(100, Math.round((usage / limit) * 100))

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px', marginBottom: 4 }}>Dashboard</h2>
          <p style={{ fontSize: 13, color: '#475569' }}>Your last 30 days · {stats?.total || 0} total replies</p>
        </div>
        <button onClick={fetchStats} style={{ background: '#0d0d1a', border: '1px solid #1e2033', color: '#475569', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          🔄 Refresh
        </button>
      </div>

      {/* Big Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '✉️', label: 'Total Replies',  value: stats?.total || 0,          unit: '',     color: '#6366f1' },
          { icon: '⭐', label: 'Avg Quality',    value: stats?.avgQuality || 0,      unit: '%',    color: '#22c55e' },
          { icon: '⏱️', label: 'Time Saved',     value: stats?.timeSaved || 0,       unit: ' min', color: '#06b6d4' },
          { icon: '📅', label: 'Replies Today',  value: stats?.last14?.[13]?.count || 0, unit: '',  color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 16, padding: '20px 18px' }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.color, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}{s.unit}</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 16 }}>

        {/* Replies per Day Bar Chart */}
        <div style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 16, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 20 }}>Replies per Day — Last 14 Days</div>
          <BarChart data={stats?.last14 || []} />
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Plan Usage */}
          <div style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.06),rgba(99,102,241,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 4 }}>Current Plan</div>
                <div style={{ fontSize: 17, fontWeight: 800, background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </div>
              </div>
              {plan !== 'pro' && (
                <button onClick={onUpgrade} style={{ background: GRAD, border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, boxShadow: '0 0 12px rgba(99,102,241,0.25)' }}>
                  Upgrade
                </button>
              )}
            </div>
            {limit !== Infinity ? (
              <>
                <div style={{ height: 5, background: '#1e2033', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : GRAD, borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>{usage} / {limit} replies this month</div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>∞ Unlimited replies</div>
            )}
          </div>

          {/* Quality Breakdown */}
          <div style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 16, padding: 20, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 16 }}>Quality Breakdown</div>
            {stats?.total === 0 ? (
              <div style={{ fontSize: 12, color: '#334155', textAlign: 'center', padding: '16px 0' }}>No data yet</div>
            ) : (
              <QualityChart buckets={stats?.qualityBuckets} total={stats?.total} />
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Languages */}
        <div style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 16, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 16 }}>Languages Detected</div>
          {!stats?.languages?.length ? (
            <div style={{ fontSize: 12, color: '#334155', textAlign: 'center', padding: '16px 0' }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.languages.slice(0, 6).map(l => (
                <div key={l.lang}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>{l.lang}</span>
                    <span style={{ fontSize: 12, color: '#475569' }}>{l.count}</span>
                  </div>
                  <div style={{ height: 4, background: '#1e2033', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((l.count / stats.total) * 100)}%`, background: 'linear-gradient(90deg,#06b6d4,#6366f1)', borderRadius: 99, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Replies */}
        <div style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 16, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 16 }}>Recent Auto-Replies</div>
          {!stats?.recent?.length ? (
            <div style={{ fontSize: 12, color: '#334155', textAlign: 'center', padding: '16px 0' }}>No replies yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.recent.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 12px', background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 10 }}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.from?.split('<')[0]?.trim() || r.from || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 11, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{r.subject}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                    {r.quality && (
                      <span style={{ fontSize: 10, color: r.quality >= 80 ? '#22c55e' : '#f59e0b', fontWeight: 700 }}>{r.quality}%</span>
                    )}
                    <span style={{ fontSize: 10, color: '#334155' }}>{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
      {data.map((d, i) => {
        const h       = max === 0 ? 0 : Math.max(4, Math.round((d.count / max) * 110))
        const isToday = i === data.length - 1

        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {/* Tooltip on hover */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }} title={`${d.label}: ${d.count} replies`}>
              <div style={{
                width:        '100%',
                height:       h,
                borderRadius: '4px 4px 2px 2px',
                background:   isToday
                  ? GRAD
                  : d.count > 0
                  ? 'rgba(99,102,241,0.4)'
                  : '#131320',
                transition:   'height 0.4s ease',
                cursor:       'default',
                boxShadow:    isToday ? '0 0 8px rgba(99,102,241,0.3)' : 'none',
              }} />
            </div>
            {/* Label every 3rd + last */}
            <div style={{ fontSize: 9, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%', textAlign: 'center' }}>
              {(i % 3 === 0 || isToday) ? d.label?.split(' ')[1] || '' : ''}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Quality Chart ──────────────────────────────────────────────────────────

function QualityChart({ buckets = {}, total = 0 }) {
  const items = [
    { label: 'Excellent', key: 'excellent', range: '90–100%', color: '#22c55e' },
    { label: 'Good',      key: 'good',      range: '75–89%',  color: '#06b6d4' },
    { label: 'Average',   key: 'average',   range: '60–74%',  color: '#f59e0b' },
    { label: 'Poor',      key: 'poor',      range: '<60%',    color: '#f87171' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(item => {
        const count = buckets[item.key] || 0
        const pct   = total ? Math.round((count / total) * 100) : 0
        return (
          <div key={item.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.label}</span>
                <span style={{ fontSize: 10, color: '#334155' }}>{item.range}</span>
              </div>
              <span style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{count}</span>
            </div>
            <div style={{ height: 4, background: '#1e2033', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}