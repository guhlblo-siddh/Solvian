import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) return Response.json({ plan: 'free' })

    const { data } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    return Response.json({ plan: data?.plan || 'free' })
  } catch {
    return Response.json({ plan: 'free' })
  }
}