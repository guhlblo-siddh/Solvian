'use client'

const FEATURES = [
  { icon: '⚡', title: 'Instant Replies',   desc: 'Generate professional email replies in under 3 seconds.' },
  { icon: '🌐', title: 'Multilingual',      desc: 'Auto-detects language. Replies in 6+ languages.' },
  { icon: '🎯', title: 'Smart Tone',        desc: 'Professional, friendly, formal or casual — always on brand.' },
  { icon: '📧', title: 'Subject Generator', desc: 'Automatically creates the perfect subject line.' },
  { icon: '⭐', title: 'Quality Score',     desc: 'AI rates every reply so you always send the best.' },
  { icon: '💾', title: 'Save & Export',     desc: 'Save replies and export as a text file anytime.' },
]

const PRICING = [
  {
    name: 'Starter', price: '10',
    features: ['50 replies / month', '2 business profiles', 'Basic templates', 'Email support'],
    cta: 'Start Free',
  },
  {
    name: 'Standard', price: '25', popular: true,
    features: ['500 replies / month', '5 business profiles', 'All features', 'Priority support', 'Quality scores'],
    cta: 'Get Started',
  },
  {
    name: 'Pro', price: '59',
    features: ['Unlimited replies', 'Unlimited profiles', 'API access', 'Custom templates', 'Dedicated support'],
    cta: 'Contact Sales',
  },
]

const STEPS = [
  { n: '01', title: 'Paste the email',       desc: 'Copy any customer email and paste it into Solvian.' },
  { n: '02', title: 'Choose tone & language', desc: 'Pick your style. Solvian auto-detects the language.' },
  { n: '03', title: 'Copy & send',            desc: 'Get a perfect reply in seconds. One click to copy.' },
]

export default function Landing({ onStart }) {
  return (
    <div style={s.page}>

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <Logo />
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {['Features', 'How it works', 'Pricing'].map(i => (
            <a key={i} href={`#${i.toLowerCase().replace(/ /g, '-')}`} style={s.navLink}
              onMouseEnter={e => e.target.style.color = '#e2e8f0'}
              onMouseLeave={e => e.target.style.color = '#64748b'}
            >{i}</a>
          ))}
          <button onClick={onStart} style={s.navCta}>Try Free →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={s.hero}>

        {/* Glow */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse,rgba(99,102,241,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 32 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
          <span style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 500, letterSpacing: '0.3px' }}>AI Automation for Business</span>
        </div>

        <h1 style={s.heroTitle}>
          Stop wasting time<br />
          <span style={s.grad}>on customer emails</span>
        </h1>

        <p style={s.heroSub}>
          Solvian AI writes professional email replies for your salon, shop, or service business — instantly, in any language.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onStart} style={s.heroCta}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >Start for Free →</button>
          <a href="#how-it-works" style={s.heroSecondary}>See how it works</a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
          {[['500+', 'Businesses'], ['50k+', 'Emails Replied'], ['4.9★', 'Rating'], ['3 sec', 'Avg Reply Time']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.5px' }}>{v}</div>
              <div style={{ fontSize: 12, color: '#334155', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={s.section}>
        <SectionLabel>Features</SectionLabel>
        <h2 style={s.sectionTitle}>Everything you need</h2>
        <p style={s.sectionSub}>Built specifically for small businesses and local services</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 48 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={s.featureCard}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2033'; e.currentTarget.style.background = '#0d0d1a' }}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={s.section}>
        <SectionLabel>How it works</SectionLabel>
        <h2 style={s.sectionTitle}>3 simple steps</h2>
        <div style={{ maxWidth: 640, margin: '48px auto 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 24, padding: '28px 0', borderBottom: i < STEPS.length - 1 ? '1px solid #1e2033' : 'none', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 36, fontWeight: 900, background: s.gradStr, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', minWidth: 52, lineHeight: 1 }}>{step.n}</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={s.section}>
        <SectionLabel>Pricing</SectionLabel>
        <h2 style={s.sectionTitle}>Simple, honest pricing</h2>
        <p style={s.sectionSub}>Start free. Upgrade when you're ready.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 48 }}>
          {PRICING.map(p => (
            <div key={p.name} style={{ ...s.pricingCard, ...(p.popular ? s.pricingPopular : {}) }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: s.gradStr, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12, letterSpacing: '0.3px' }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 20 }}>
                <span style={{ fontSize: 14, color: '#475569' }}>€</span>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-1px' }}>{p.price}</span>
                <span style={{ fontSize: 13, color: '#475569' }}>/mo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#94a3b8', alignItems: 'flex-start' }}>
                    <span style={{ color: '#22c55e', marginTop: 1 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={onStart} style={{ width: '100%', background: p.popular ? s.gradStr : '#131320', border: p.popular ? 'none' : '1px solid #1e2033', color: p.popular ? 'white' : '#64748b', padding: '11px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: p.popular ? '0 0 24px rgba(99,102,241,0.3)' : 'none', transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ maxWidth: 720, margin: '0 auto 100px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 24, padding: '64px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse,rgba(99,102,241,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', marginBottom: 12, letterSpacing: '-0.5px', position: 'relative' }}>Ready to save hours every week?</h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32, position: 'relative' }}>Join 500+ businesses already using Solvian Email AI.</p>
          <button onClick={onStart} style={{ ...s.heroCta, position: 'relative' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >Try Solvian Free →</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #1e2033', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo small />
        <div style={{ fontSize: 12, color: '#334155' }}>© 2025 Solvian · AI Automation for Business</div>
        <div style={{ fontSize: 12, color: '#334155' }}>Built for small businesses ❤️</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #08080f; }
      `}</style>
    </div>
  )
}

// ─── Logo Component ───────────────────────────────────────────────────────

export function Logo({ small }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: small ? 8 : 10 }}>
      {/* S Icon with chat bubble */}
      <svg width={small ? 28 : 36} height={small ? 28 : 36} viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#06b6d4" />
            <stop offset="50%"  stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="9" fill="url(#lg)" />
        {/* S shape */}
        <path d="M22 11H16a3 3 0 000 6h4a3 3 0 010 6h-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Chat dots */}
        <circle cx="13" cy="24" r="1" fill="white" opacity="0.9" />
        <circle cx="17" cy="24" r="1" fill="white" opacity="0.9" />
        <circle cx="21" cy="24" r="1" fill="white" opacity="0.9" />
      </svg>

      {/* Wordmark */}
      <div>
        <div style={{ fontWeight: 800, fontSize: small ? 13 : 15, letterSpacing: '-0.3px', lineHeight: 1, color: '#f1f5f9' }}>
          SOLVI<span style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>A</span>N
        </div>
        {!small && <div style={{ fontSize: 9, color: '#475569', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 2 }}>AI Automation for Business</div>}
      </div>
    </div>
  )
}

// ─── Section Label ────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12, background: 'linear-gradient(90deg,#06b6d4,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
      {children}
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────

const gradStr = 'linear-gradient(135deg,#06b6d4,#6366f1,#8b5cf6)'

const s = {
  page:    { minHeight: '100vh', background: '#08080f', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" },
  gradStr,
  grad:    { background: gradStr, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },

  nav:     { position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #1e2033', background: 'rgba(8,8,15,0.96)', backdropFilter: 'blur(16px)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLink: { fontSize: 13, color: '#64748b', textDecoration: 'none', padding: '6px 12px', transition: 'color 0.15s' },
  navCta:  { background: gradStr, border: 'none', color: 'white', padding: '9px 20px', borderRadius: 9, cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: '0 0 24px rgba(99,102,241,0.35)', marginLeft: 8, transition: 'transform 0.15s' },

  hero:    { maxWidth: 820, margin: '0 auto', padding: '110px 24px 90px', textAlign: 'center', position: 'relative' },
  heroTitle: { fontSize: 58, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 22, color: '#f1f5f9' },
  heroSub:   { fontSize: 18, color: '#64748b', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 40px' },
  heroCta:   { background: gradStr, border: 'none', color: 'white', padding: '14px 36px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 0 32px rgba(99,102,241,0.4)', transition: 'transform 0.15s' },
  heroSecondary: { background: 'transparent', border: '1px solid #1e2033', color: '#94a3b8', padding: '14px 28px', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },

  section: { maxWidth: 960, margin: '0 auto', padding: '0 24px 96px', textAlign: 'center' },
  sectionTitle: { fontSize: 36, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.5px' },
  sectionSub:   { fontSize: 15, color: '#64748b', marginTop: 10 },

  featureCard: { background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 18, padding: 26, textAlign: 'left', transition: 'all 0.2s', cursor: 'default' },

  pricingCard:    { background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 22, padding: 28, position: 'relative', textAlign: 'left' },
  pricingPopular: { background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.35)' },
}