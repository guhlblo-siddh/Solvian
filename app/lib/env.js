// Validates all required environment variables on startup
// Called in API routes to catch missing config early

const REQUIRED_ENV = {
  server: [
    'ANTHROPIC_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ],
  optional: [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_APP_URL',
  ],
}

export function validateEnv() {
  const missing = REQUIRED_ENV.server.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Add them to .env.local or your Vercel project settings.'
    )
  }
}

export function getEnv() {
  validateEnv()
  return {
    anthropicKey:        process.env.ANTHROPIC_API_KEY,
    supabaseUrl:         process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey:     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey:  process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripeSecretKey:     process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    googleClientId:      process.env.GOOGLE_CLIENT_ID,
    googleClientSecret:  process.env.GOOGLE_CLIENT_SECRET,
    appUrl:              process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  }
}