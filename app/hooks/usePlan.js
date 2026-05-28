import { useState, useEffect, useCallback } from 'react'

// Plan limits
export const PLAN_LIMITS = {
  free:     10,
  starter:  50,
  standard: 500,
  pro:      Infinity,
}

export const PLAN_NAMES = {
  free:     'Free',
  starter:  'Starter',
  standard: 'Standard',
  pro:      'Pro',
}

export const PLAN_COLORS = {
  free:     '#475569',
  starter:  '#06b6d4',
  standard: '#6366f1',
  pro:      '#8b5cf6',
}

// Local storage key
const STORAGE_KEY = 'solvian_usage'

function getUsage() {
  try {
    const raw  = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { count: 0, month: new Date().getMonth() }
    const data = JSON.parse(raw)
    // Reset if new month
    if (data.month !== new Date().getMonth()) {
      return { count: 0, month: new Date().getMonth() }
    }
    return data
  } catch {
    return { count: 0, month: new Date().getMonth() }
  }
}

function saveUsage(count) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      count,
      month: new Date().getMonth(),
    }))
  } catch {}
}

export function usePlan(user) {
  const [plan, setPlan]         = useState('free')
  const [usage, setUsage]       = useState(0)
  const [loadingPlan, setLoadingPlan] = useState(true)

  // Load plan from API
  useEffect(() => {
    async function fetchPlan() {
      if (!user?.email) { setLoadingPlan(false); return }
      try {
        const res  = await fetch(`/api/subscription?email=${user.email}`)
        const data = await res.json()
        setPlan(data.plan || 'free')
      } catch {
        setPlan('free')
      }
      setLoadingPlan(false)
    }
    fetchPlan()
  }, [user])

  // Load usage from localStorage
  useEffect(() => {
    const u = getUsage()
    setUsage(u.count)
  }, [])

  const limit        = PLAN_LIMITS[plan] ?? 10
  const remaining    = limit === Infinity ? Infinity : Math.max(0, limit - usage)
  const isLimitReached = remaining === 0
  const usagePercent   = limit === Infinity ? 0 : Math.min(100, Math.round((usage / limit) * 100))

  const incrementUsage = useCallback(() => {
    const newCount = usage + 1
    setUsage(newCount)
    saveUsage(newCount)
  }, [usage])

  return {
    plan,
    usage,
    limit,
    remaining,
    isLimitReached,
    usagePercent,
    loadingPlan,
    incrementUsage,
  }
}