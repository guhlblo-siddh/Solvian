import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,#06b6d4,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26 }}>✉️</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, color: '#1e2033', letterSpacing: '-2px', marginBottom: 8 }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Page not found</h2>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 28 }}>The page you're looking for doesn't exist.</p>
        <Link href="/" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '11px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          Back to Solvian
        </Link>
      </div>
    </div>
  )
}