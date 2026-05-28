import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    if (!email) return Response.json({ error: 'No email' }, { status: 400 })

    // Last 30 days
    const since = new Date()
    since.setDate(since.getDate() - 30)
    const sinceISO = since.toISOString()

    // Fetch all logs
    const { data: logs, error } = await supabase
      .from('auto_reply_log')
      .select('*')
      .eq('user_email', email)
      .gte('created_at', sinceISO)
      .order('created_at', { ascending: true })

    if (error) throw error

    const total        = logs.length
    const avgQuality   = total ? Math.round(logs.reduce((a, l) => a + (l.quality_score || 0), 0) / total) : 0
    const timeSaved    = total * 4

    // Replies per day (last 14 days)
    const last14 = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const count   = logs.filter(l => l.created_at?.startsWith(dateStr)).length
      last14.push({ date: dateStr, label: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), count })
    }

    // Languages breakdown
    const langMap = {}
    logs.forEach(l => {
      if (l.language) langMap[l.language] = (langMap[l.language] || 0) + 1
    })
    const languages = Object.entries(langMap)
      .map(([lang, count]) => ({ lang, count }))
      .sort((a, b) => b.count - a.count)

    // Quality distribution
    const qualityBuckets = { excellent: 0, good: 0, average: 0, poor: 0 }
    logs.forEach(l => {
      const q = l.quality_score || 0
      if (q >= 90)      qualityBuckets.excellent++
      else if (q >= 75) qualityBuckets.good++
      else if (q >= 60) qualityBuckets.average++
      else              qualityBuckets.poor++
    })

    // Recent logs (last 5)
    const recent = logs.slice(-5).reverse().map(l => ({
      from:    l.from_email,
      subject: l.subject,
      quality: l.quality_score,
      lang:    l.language,
      time:    new Date(l.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
      date:    new Date(l.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    }))

    // Subscription info
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    return Response.json({
      total,
      avgQuality,
      timeSaved,
      last14,
      languages,
      qualityBuckets,
      recent,
      plan: sub?.plan || 'free',
    })

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}