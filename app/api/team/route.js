import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - list team members
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const ownerEmail = searchParams.get('owner')
    if (!ownerEmail) return Response.json({ members: [] })

    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_email', ownerEmail)
      .order('created_at', { ascending: true })

    if (error) throw error
    return Response.json({ members: data || [] })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST - invite member
export async function POST(req) {
  try {
    const { ownerEmail, memberEmail, role } = await req.json()

    if (!ownerEmail || !memberEmail) {
      return Response.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (ownerEmail === memberEmail) {
      return Response.json({ error: 'Cannot invite yourself' }, { status: 400 })
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('team_members')
      .select('id')
      .eq('owner_email', ownerEmail)
      .eq('member_email', memberEmail)
      .single()

    if (existing) {
      return Response.json({ error: 'Already a team member' }, { status: 400 })
    }

    const { error } = await supabase
      .from('team_members')
      .insert({
        owner_email:  ownerEmail,
        member_email: memberEmail,
        role:         role || 'member',
        status:       'pending',
        created_at:   new Date().toISOString(),
      })

    if (error) throw error
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// DELETE - remove member
export async function DELETE(req) {
  try {
    const { ownerEmail, memberEmail } = await req.json()

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('owner_email', ownerEmail)
      .eq('member_email', memberEmail)

    if (error) throw error
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}