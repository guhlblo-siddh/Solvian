// ─── Solvian v8 — Shared UI ───────────────────────────────────────────────

export const GRAD = 'linear-gradient(135deg,#06b6d4,#6366f1,#8b5cf6)'

export function Card({ children, glow }) {
  return (
    <div style={{ background: '#0d0d1a', border: `1px solid ${glow ? 'rgba(99,102,241,0.25)' : '#1e2033'}`, borderRadius: 16, padding: 20, boxShadow: glow ? '0 0 24px rgba(99,102,241,0.08)' : 'none' }}>
      {children}
    </div>
  )
}

export function CardLabel({ children, style }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.8px', ...style }}>{children}</div>
}

export function FieldLabel({ children, style }) {
  return <div style={{ fontSize: 12, color: '#475569', marginBottom: 5, ...style }}>{children}</div>
}

export function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}

export function GradText({ children, style }) {
  return <span style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', ...style }}>{children}</span>
}

export function Spinner() {
  return <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.15)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
}

export function Tag({ children, color }) {
  return <span style={{ fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}30`, padding: '2px 8px', borderRadius: 99, fontWeight: 500 }}>{children}</span>
}

export const inputSt   = { width: '100%', background: '#0f0f1a', border: '1px solid #1e2033', borderRadius: 9, padding: '9px 12px', color: '#e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s' }
export const copyBtnSt = (a) => ({ fontSize: 12, color: a ? '#22c55e' : '#475569', background: '#0f0f1a', border: '1px solid #1e2033', padding: '5px 11px', borderRadius: 7, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' })
export const actionBtn = { fontSize: 12, color: '#475569', background: '#0f0f1a', border: '1px solid #1e2033', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' }
export const primaryBtn = (active) => ({ background: active ? GRAD : '#131320', border: active ? 'none' : '1px solid #1e2033', color: active ? 'white' : '#475569', padding: '10px 22px', borderRadius: 9, cursor: active ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, boxShadow: active ? '0 0 20px rgba(99,102,241,0.25)' : 'none', transition: 'all 0.2s' })