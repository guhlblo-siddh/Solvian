'use client'
import { useState, useEffect } from 'react'
import { supabase }  from './lib/supabase'
import Landing       from './components/Landing'
import Layout        from './components/Layout'
import AuthPage      from './components/Auth'

export default function Home() {
  const [page, setPage]   = useState('landing')
  const [user, setUser]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setPage('app')
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <LoadingScreen />

  if (page === 'landing') return (
    <Landing
      onStart={() => user ? setPage('app') : setPage('auth')}
      onLogin={() => setPage('auth')}
      user={user}
    />
  )

  if (page === 'auth') return (
    <AuthPage
      onSuccess={() => setPage('app')}
      onBack={() => setPage('landing')}
    />
  )

  if (page === 'app') return (
    <Layout
      user={user}
      onBack={() => setPage('landing')}
      onLogout={async () => {
        await supabase.auth.signOut()
        setUser(null)
        setPage('landing')
      }}
    />
  )
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#06b6d4,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>✉️</div>
        <div style={{ fontSize: 13, color: '#475569', fontFamily: 'monospace' }}>Loading Solvian...</div>
      </div>
    </div>
  )
}