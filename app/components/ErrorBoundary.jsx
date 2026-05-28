'use client'
import { Component } from 'react'
import { GRAD } from './ui'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Solvian error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
          <div style={{ background: '#0d0d1a', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: 40, maxWidth: 440, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.3px' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ background: GRAD, border: 'none', color: 'white', padding: '10px 24px', borderRadius: 9, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}