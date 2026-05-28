'use client'
import { useState }      from 'react'
import { Logo }           from './Landing'
import Compose            from './Compose'
import Saved              from './Saved'
import Settings           from './Settings'
import Pricing            from './Pricing'
import Gmail              from './Gmail'
import AutoReply          from './AutoReply'
import Dashboard          from './Dashboard'
import { PlanBadge }      from './PlanBadge'
import { usePlan }        from '../hooks/usePlan'
import { useIsMobile }    from '../hooks/useIsMobile'
import { GRAD }           from './ui'

const NAV = [
  { id: 'compose',   icon: '✍️', label: 'Compose'   },
  { id: 'gmail',     icon: '📬', label: 'Gmail'     },
  { id: 'autoreply', icon: '🤖', label: 'Auto'      },
  { id: 'dashboard', icon: '📊', label: 'Stats'     },
  { id: 'saved',     icon: '📁', label: 'Saved'     },
  { id: 'pricing',   icon: '⚡', label: 'Upgrade'   },
  { id: 'settings',  icon: '⚙️', label: 'Settings'  },
]

// Bottom nav shows only 5 items on mobile
const MOBILE_NAV = [
  { id: 'compose',   icon: '✍️', label: 'Compose'  },
  { id: 'gmail',     icon: '📬', label: 'Gmail'    },
  { id: 'dashboard', icon: '📊', label: 'Stats'    },
  { id: 'saved',     icon: '📁', label: 'Saved'    },
  { id: 'settings',  icon: '⚙️', label: 'More'     },
]

export default function Layout({ user, onBack, onLogout }) {
  const [nav, setNav]           = useState('compose')
  const [saved, setSaved]       = useState([])
  const [history, setHistory]   = useState([])
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const planData = usePlan(user)
  const isMobile = useIsMobile()
  const initials = user?.email?.substring(0, 2).toUpperCase() || '??'

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: isMobile ? 72 : 0 }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: '1px solid #1e2033', padding: isMobile ? '0 16px' : '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(8,8,15,0.97)', backdropFilter: 'blur(16px)', zIndex: 20 }}>

        <Logo small />

        {/* Desktop Nav */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 1 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setNav(n.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 8, border: 'none', background: nav === n.id ? 'rgba(99,102,241,0.12)' : 'transparent', color: nav === n.id ? '#a5b4fc' : n.id === 'pricing' ? '#6366f1' : '#475569', cursor: 'pointer', fontSize: 12, fontWeight: nav === n.id ? 600 : 400, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                <span>{n.icon}</span><span>{n.label}</span>
                {n.id === 'saved' && saved.length > 0 && (
                  <span style={{ background: GRAD, color: 'white', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 99 }}>{saved.length}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          {!isMobile && !planData.loadingPlan && (
            <PlanBadge plan={planData.plan} usage={planData.usage} limit={planData.limit} remaining={planData.remaining} />
          )}

          {/* Mobile: hamburger menu */}
          {isMobile && (
            <button onClick={() => setShowMobileMenu(true)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 20, padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
              ☰
            </button>
          )}

          {/* Avatar */}
          <button onClick={() => setShowUserMenu(v => !v)} style={{ width: 32, height: 32, borderRadius: 8, background: GRAD, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12, boxShadow: '0 0 12px rgba(99,102,241,0.3)', flexShrink: 0 }}>
            {initials}
          </button>

          {showUserMenu && (
            <div style={{ position: 'absolute', top: 42, right: 0, background: '#0d0d1a', border: '1px solid #1e2033', borderRadius: 12, padding: 8, minWidth: 200, zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e2033', marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>{initials}</div>
                <div style={{ fontSize: 11, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                {!planData.loadingPlan && isMobile && (
                  <div style={{ fontSize: 11, color: '#6366f1', marginTop: 3, fontWeight: 600 }}>
                    {planData.plan.charAt(0).toUpperCase() + planData.plan.slice(1)} Plan
                    {planData.limit !== Infinity && ` · ${planData.remaining} left`}
                  </div>
                )}
              </div>
              {[
                { label: '⚡ Upgrade Plan', id: 'pricing'   },
                { label: '⚙️ Settings',     id: 'settings'  },
              ].map(item => (
                <button key={item.id} onClick={() => { setNav(item.id); setShowUserMenu(false) }} style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, textAlign: 'left', cursor: 'pointer', borderRadius: 7 }}
                  onMouseEnter={e => e.target.style.background = '#131320'}
                  onMouseLeave={e => e.target.style.background = 'none'}
                >{item.label}</button>
              ))}
              <button onClick={() => { setShowUserMenu(false); onLogout() }} style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: '#f87171', fontSize: 13, textAlign: 'left', cursor: 'pointer', borderRadius: 7 }}
                onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.07)'}
                onMouseLeave={e => e.target.style.background = 'none'}
              >← Sign Out</button>
            </div>
          )}
        </div>
      </header>

      {/* ── MOBILE SLIDE-IN MENU ── */}
      {showMobileMenu && (
        <>
          <div onClick={() => setShowMobileMenu(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 40 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 260, background: '#0d0d1a', border: '1px solid #1e2033', zIndex: 50, padding: 20, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Menu</span>
              <button onClick={() => setShowMobileMenu(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            {NAV.map(n => (
              <button key={n.id} onClick={() => { setNav(n.id); setShowMobileMenu(false) }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: 'none', background: nav === n.id ? 'rgba(99,102,241,0.12)' : 'transparent', color: nav === n.id ? '#a5b4fc' : n.id === 'pricing' ? '#6366f1' : '#94a3b8', cursor: 'pointer', fontSize: 14, fontWeight: nav === n.id ? 600 : 400, textAlign: 'left', transition: 'all 0.15s' }}>
                <span style={{ fontSize: 18, width: 24 }}>{n.icon}</span>
                {n.label}
                {n.id === 'saved' && saved.length > 0 && (
                  <span style={{ background: GRAD, color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, marginLeft: 'auto' }}>{saved.length}</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── PAGE CONTENT ── */}
      {nav === 'compose'   && <Compose    saved={saved} setSaved={setSaved} history={history} setHistory={setHistory} user={user} planData={planData} onUpgrade={() => setNav('pricing')} isMobile={isMobile} />}
      {nav === 'gmail'     && <Gmail      planData={planData} onUpgrade={() => setNav('pricing')} isMobile={isMobile} />}
      {nav === 'autoreply' && <AutoReply  user={user} isMobile={isMobile} />}
      {nav === 'dashboard' && <Dashboard  user={user} planData={planData} onUpgrade={() => setNav('pricing')} isMobile={isMobile} />}
      {nav === 'saved'     && <Saved      saved={saved} setSaved={setSaved} isMobile={isMobile} />}
      {nav === 'pricing'   && <Pricing    user={user} currentPlan={planData.plan} isMobile={isMobile} />}
      {nav === 'settings'  && <Settings   user={user} onLogout={onLogout} planData={planData} onUpgrade={() => setNav('pricing')} isMobile={isMobile} />}

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, background: 'rgba(8,8,15,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid #1e2033', display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 20, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {MOBILE_NAV.map(n => (
            <button key={n.id} onClick={() => n.id === 'settings' ? setShowMobileMenu(true) : setNav(n.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 10, flex: 1, transition: 'all 0.15s', position: 'relative' }}>
              <span style={{ fontSize: 20 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: nav === n.id ? 600 : 400, color: nav === n.id ? '#a5b4fc' : '#475569', transition: 'color 0.15s' }}>{n.label}</span>
              {nav === n.id && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, borderRadius: 99, background: GRAD }} />}
              {n.id === 'saved' && saved.length > 0 && (
                <div style={{ position: 'absolute', top: 4, right: 14, width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
              )}
            </button>
          ))}
        </nav>
      )}

      {(showUserMenu || showMobileMenu) && !showMobileMenu && (
        <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideIn { from { transform:translateX(100%) } to { transform:translateX(0) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #334155; }
        select option { background: #0f0f1a; }
        body { background: #08080f; }
        @media (max-width: 768px) {
          ::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  )
}