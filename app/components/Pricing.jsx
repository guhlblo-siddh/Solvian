'use client'
import { useState } from 'react'
import { GRAD }     from './ui'

const PLANS = [
  {
    id:       'starter',
    name:     'Starter',
    price:    '10',
    color:    '#475569',
    limit:    50,
    features: [
      '50 replies / month',
      '2 business profiles',
      'Basic templates',
      '6 languages',
      'Email support',
    ],
    cta: 'Start with Starter',
  },
  {
    id:       'standard',
    name:     'Standard',
    price:    '25',
    popular:  true,
    color:    '#6366f1',
    limit:    500,
    features: [
      '500 replies / month',
      '5 business profiles',
      'All templates',
      'Quality scores',
      'Priority support',
      'Analytics dashboard',
    ],
    cta: 'Get Standard',
  },
  {
    id:       'pro',
    name:     'Pro',
    price:    '59',
    color:    '#8b5cf6',
    limit:    Infinity,
    features: [
      'Unlimited replies',
      'Unlimited profiles',
      'API access',
      'Custom templates',
      'Dedicated support',
      'Early access features',
    ],
    cta: 'Go Pro',
  },
]

export { PLANS }

export default function Pricing({ user, currentPlan, onPlanChange }) {
  const [loading, setLoading] = useState('')
  const [error, setError]     = useState('')

  async function checkout(planId) {
    if (!user) {
      setError('Please sign in first to subscribe.')
      return
    }
    if (currentPlan === planId) return

    setLoading(planId)
    setError('')

    try {
      const res  = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan: planId, email: user.email }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      window.location.href = data.url
    } catch (e) {
      setError(e.message)
      setLoading('')
    }
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px', marginBottom: 6 }}>
          Upgrade Your Plan
        </h2>
        <p style={{ fontSize: 13, color: '#475569' }}>
          {currentPlan === 'free'
            ? 'You are on the Free plan. Upgrade to unlock more replies.'
            : `You are on the ${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan.`}
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 20 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {PLANS.map(plan => {
          const isCurrent = currentPlan === plan.id
          const isLoading = loading === plan.id

          return (
            <div key={plan.id} style={{
              background:    plan.popular ? 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))' : '#0d0d1a',
              border:        `1px solid ${isCurrent ? '#22c55e' : plan.popular ? 'rgba(99,102,241,0.35)' : '#1e2033'}`,
              borderRadius:  22,
              padding:       28,
              position:      'relative',
              transition:    'border-color 0.2s',
            }}>

              {/* Badges */}
              {plan.popular && !isCurrent && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: GRAD, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                  MOST POPULAR
                </div>
              )}
              {isCurrent && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                  CURRENT PLAN
                </div>
              )}

              {/* Plan Header */}
              <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10, letterSpacing: '0.3px' }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 20 }}>
                <span style={{ fontSize: 14, color: '#475569' }}>€</span>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-1px' }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: '#475569' }}>/mo</span>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#94a3b8', alignItems: 'flex-start' }}>
                    <span style={{ color: '#22c55e', marginTop: 1, flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => checkout(plan.id)}
                disabled={isCurrent || isLoading}
                style={{
                  width:      '100%',
                  background: isCurrent ? 'rgba(34,197,94,0.1)' : plan.popular ? GRAD : '#131320',
                  border:     isCurrent ? '1px solid rgba(34,197,94,0.3)' : plan.popular ? 'none' : '1px solid #1e2033',
                  color:      isCurrent ? '#22c55e' : plan.popular ? 'white' : '#64748b',
                  padding:    '11px',
                  borderRadius: 10,
                  cursor:     isCurrent ? 'default' : 'pointer',
                  fontWeight: 600,
                  fontSize:   13,
                  boxShadow:  plan.popular && !isCurrent ? '0 0 20px rgba(99,102,241,0.25)' : 'none',
                  transition: 'opacity 0.15s',
                  opacity:    isLoading ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.opacity = '1' }}
              >
                {isLoading ? '⏳ Redirecting...' : isCurrent ? '✓ Active' : plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      {/* Free Plan Note */}
      <div style={{ background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 14, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: currentPlan === 'free' ? '#22c55e' : '#f1f5f9', marginBottom: 3 }}>
            Free Plan {currentPlan === 'free' && '✓ Current'}
          </div>
          <div style={{ fontSize: 12, color: '#475569' }}>10 replies / month · Basic features · No credit card required</div>
        </div>
        {currentPlan !== 'free' && (
          <div style={{ fontSize: 12, color: '#334155' }}>Downgrade available via support</div>
        )}
      </div>

      {/* Guarantee */}
      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#334155' }}>
        🔒 Secure payment via Stripe · Cancel anytime · 7-day money back guarantee
      </div>
    </div>
  )
}