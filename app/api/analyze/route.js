import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Price IDs from your Stripe Dashboard
const PRICES = {
  starter:  'price_starter_id_from_stripe',
  standard: 'price_standard_id_from_stripe',
  pro:      'price_pro_id_from_stripe',
}

export async function POST(req) {
  try {
    const { plan, email } = await req.json()

    if (!PRICES[plan]) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:                 'subscription',
      customer_email:       email,
      line_items: [{
        price:    PRICES[plan],
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: { plan },
    })

    return Response.json({ url: session.url })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}