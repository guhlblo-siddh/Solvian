import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - load auto-reply settings for user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    if (!email) return Response.json({ settings: null })

    const { data } = await supabase
      .from('auto_reply_settings')
      .select('*')
      .eq('email', email)
      .single()

    return Response.json({ settings: data || null })
  } catch {
    return Response.json({ settings: null })
  }
}

// POST - save auto-reply settings
export async function POST(req) {
  try {
    const body = await req.json()
    const { email, enabled, tone, businessName, businessType, language, signature, rules } = body

    if (!email) return Response.json({ error: 'No email provided' }, { status: 400 })

    const { error } = await supabase
      .from('auto_reply_settings')
      .upsert({
        email,
        enabled:       enabled ?? false,
        tone:          tone || 'professional',
        business_name: businessName || '',
        business_type: businessType || 'local service',
        language:      language || 'auto',
        signature:     signature || '',
        rules:         rules || [],
        updated_at:    new Date().toISOString(),
      })

    if (error) throw error
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}