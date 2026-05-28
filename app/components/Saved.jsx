'use client'
import { useState } from 'react'
import { copyBtnSt, inputSt } from './ui'

export default function Saved({ saved, setSaved }) {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState('')

  const filtered = saved.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.reply?.toLowerCase().includes(search.toLowerCase())
  )

  function copy(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  function exportAll() {
    const text = saved.map((s, i) =>
      `--- Reply ${i + 1} (${s.time}) ---\nCustomer: ${s.email}\n\nSubject: ${s.subject || ''}\n\n${s.reply}\n`
    ).join('\n')
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })), download: 'solvian-replies.txt' })
    a.click()
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px' }}>Saved Replies</h2>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 3 }}>{saved.length} replies saved</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." style={{ ...inputSt, width: 200 }} />
          {saved.length > 0 && <button onClick={exportAll} style={{ background: '#0d0d18', border: '1px solid #1e1e2e', color: '#94a3b8', padding: '8px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 13 }}>📥 Export</button>}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#334155' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{search ? 'No results' : 'No saved replies yet'}</div>
          <div style={{ fontSize: 13 }}>{search ? 'Try a different search' : 'Click 💾 Save on a reply to keep it here'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(s => (
            <div key={s.id} style={{ background: '#0d0d18', border: '1px solid #1e1e2e', borderRadius: 16, padding: 20, transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  <Tag color="#334155">{s.time}</Tag>
                  {s.detectedLanguage && <Tag color="#6366f1">{s.detectedLanguage}</Tag>}
                  {s.tone && <Tag color="#475569">{s.tone}</Tag>}
                  {s.qualityScore && <Tag color={s.qualityScore >= 80 ? '#22c55e' : '#f59e0b'}>{s.qualityScore}%</Tag>}
                  {s.businessName && <Tag color="#334155">{s.businessName}</Tag>}
                </div>
                <button onClick={() => setSaved(p => p.filter(x => x.id !== s.id))} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 16, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#f87171'}
                  onMouseLeave={e => e.target.style.color = '#334155'}
                >✕</button>
              </div>
              <div style={{ fontSize: 12, color: '#475569', background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: 9, padding: '10px 14px', marginBottom: 10, fontStyle: 'italic' }}>
                "{s.email?.length > 120 ? s.email.substring(0, 120) + '…' : s.email}"
              </div>
              {s.subject && <div style={{ fontSize: 12, color: '#6366f1', marginBottom: 8, fontWeight: 500 }}>📧 {s.subject}</div>}
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 14, whiteSpace: 'pre-wrap' }}>{s.reply}</div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => copy(s.reply, s.id + 'r')} style={copyBtnSt(copied === s.id + 'r')}>{copied === s.id + 'r' ? '✓ Copied' : '📋 Copy'}</button>
                <button onClick={() => copy(`Subject: ${s.subject}\n\n${s.reply}`, s.id + 'f')} style={copyBtnSt(copied === s.id + 'f')}>{copied === s.id + 'f' ? '✓ Copied' : '📧 Full Email'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Tag({ children, color }) {
  return <span style={{ fontSize: 10, color, background: `${color}20`, border: `1px solid ${color}30`, padding: '2px 7px', borderRadius: 99, fontWeight: 500 }}>{children}</span>
}