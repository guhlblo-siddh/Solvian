import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
)

// Step 2: Handle OAuth callback, store tokens
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=no_code`)
  }

  try {
    const { tokens } = await oauth2Client.getToken(code)

    // Store tokens in cookie (in production use encrypted DB storage)
    const tokenStr = encodeURIComponent(JSON.stringify(tokens))
    const response = Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}?gmail=connected`
    )
    response.headers.set(
      'Set-Cookie',
      `gmail_tokens=${tokenStr}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
    )
    return response

  } catch (err) {
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}?error=auth_failed`
    )
  }
}