'use client'
import { PLAN_NAMES, PLAN_COLORS, PLAN_LIMITS } from '../hooks/usePlan'
import { GRAD } from './ui'

export function PlanBadge({ plan, usage, limit, remaining }) {
  const color     = PLAN_COLORS[plan] || '#475569'
  const isUnlimited = limit === Infinity

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#0f0f1a', border: `1px solid ${color}30`, borderRadius: 9, padding: '5px 11px' }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ fontSize: 12, color, fontWeight: 600 }}>{PLAN_NAMES[plan]}</span>
      <span style={{ fontSize: 11, color: '#334155' }}>
        {isUnlimited ? '∞' : `${remaining} left`}
      </span>
    </div>
  )
}

export function UsageBar({ plan, usage, limit, usagePercent, onUpgrade }) {
  const isUnlimited = limit === Infinity
  const color       = PLAN_COLORS[plan] || '#475569'
  const isWarning   = usagePercent >= 80
  const isDanger    = usagePercent >= 100

  if (isUnlimited) return null

  return (
    <div style={{ background: '#0d0d1a', border: `1px solid ${isDanger ? 'rgba(239,68,68,0.2)' : '#1e2033'}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{PLAN_NAMES[plan]} Plan</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: isDanger ? '#f87171' : isWarning ? '#f59e0b' : '#475569' }}>
            {usage} / {limit} replies used
          </span>
          {isWarning && (
            <button onClick={onUpgrade} style={{ background: GRAD, border: 'none', color: 'white', padding: '4px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600, boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
              Upgrade →
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 5, background: '#1e2033', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height:     '100%',
          width:      `${usagePercent}%`,
          background: isDanger
            ? 'linear-gradient(90deg,#ef4444,#dc2626)'
            : isWarning
            ? 'linear-gradient(90deg,#f59e0b,#d97706)'
            : GRAD,
          borderRadius: 99,
          transition:   'width 0.5s ease',
        }} />
      </div>

      {isDanger && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '8px 12px' }}>
          🚫 Monthly limit reached. <button onClick={onUpgrade} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Upgrade now</button> to keep going.
        </div>
      )}
    </div>
  )
}

export function LimitReachedModal({ plan, onUpgrade, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
      <div style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 22, padding: 36, maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, letterSpacing: '-0.3px' }}>Monthly limit reached</h3>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
          You've used all your replies on the <strong style={{ color: '#94a3b8' }}>{PLAN_NAMES[plan]}</strong> plan this month. Upgrade to keep replying to customers.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { planId: 'starter',  price: '10', limit: '50',  label: 'Starter' },
            { planId: 'standard', price: '25', limit: '500', label: 'Standard', popular: true },
            { planId: 'pro',      price: '59', limit: '∞',   label: 'Pro' },
          ].map(p => (
            <button key={p.planId} onClick={() => onUpgrade(p.planId)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: p.popular ? 'rgba(99,102,241,0.1)' : '#131320', border: `1px solid ${p.popular ? 'rgba(99,102,241,0.3)' : '#1e2033'}`, borderRadius: 11, padding: '12px 16px', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = p.popular ? 'rgba(99,102,241,0.3)' : '#1e2033'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {p.popular && <span style={{ fontSize: 10, background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>POPULAR</span>}
                <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{p.label}</span>
                <span style={{ fontSize: 12, color: '#475569' }}>{p.limit} replies/mo</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: p.popular ? '#a5b4fc' : '#94a3b8' }}>€{p.price}/mo</span>
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{ marginTop: 16, background: 'none', border: 'none', color: '#334155', fontSize: 13, cursor: 'pointer', padding: '4px 8px' }}>
          Maybe later
        </button>
      </div>
    </div>
  )
}