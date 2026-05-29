import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - load shared replies for team
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const ownerEmail = searchParams.get('owner')
    if (!ownerEmail) return Response.json({ replies: [] })

    const { data, error } = await supabase
      .from('shared_replies')
      .select('*')
      .eq('owner_email', ownerEmail)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return Response.json({ replies: data || [] })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST - save reply to shared inbox
export async function POST(req) {
  try {
    const { ownerEmail, authorEmail, customerEmail, subject, reply, qualityScore, language, tone, note } = await req.json()

    const { error } = await supabase
      .from('shared_replies')
      .insert({
        owner_email:    ownerEmail,
        author_email:   authorEmail,
        customer_email: customerEmail,
        subject,
        reply,
        quality_score:  qualityScore,
        language,
        tone,
        note:           note || '',
        status:         'pending',
        created_at:     new Date().toISOString(),
      })

    if (error) throw error
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// PATCH - update status or add comment
export async function PATCH(req) {
  try {
    const { id, status, comment } = await req.json()

    const updates = {}
    if (status)  updates.status  = status
    if (comment) updates.comment = comment
    updates.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from('shared_replies')
      .update(updates)
      .eq('id', id)

    if (error) throw error
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}