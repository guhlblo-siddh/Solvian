import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe    = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase  = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role for server-side writes
)

export async function POST(req) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return Response.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  // Handle subscription events
  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object
      await supabase.from('subscriptions').upsert({
        email:          session.customer_email,
        plan:           session.metadata.plan,
        status:         'active',
        stripe_customer: session.customer,
        updated_at:     new Date().toISOString(),
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object
      await supabase.from('subscriptions').update({
        status:     'cancelled',
        updated_at: new Date().toISOString(),
      }).eq('stripe_customer', sub.customer)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      await supabase.from('subscriptions').update({
        status:     'past_due',
        updated_at: new Date().toISOString(),
      }).eq('stripe_customer', invoice.customer)
      break
    }
  }

  return Response.json({ received: true })
}