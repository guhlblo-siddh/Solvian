import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
)

function getTokens(req) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const match = cookieHeader.match(/gmail_tokens=([^;]+)/)
    if (!match) return null
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return null
  }
}

function makeEmail({ to, subject, body }) {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body,
  ].join('\n')

  return Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// POST /api/gmail/send — send reply
export async function POST(req) {
  const tokens = getTokens(req)
  if (!tokens) {
    return Response.json({ error: 'Not connected to Gmail' }, { status: 401 })
  }

  try {
    const { to, subject, body, threadId } = await req.json()

    if (!to || !body) {
      return Response.json({ error: 'Missing to or body' }, { status: 400 })
    }

    oauth2Client.setCredentials(tokens)
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    const raw = makeEmail({ to, subject: subject || 'Re: Your message', body })

    const result = await gmail.users.messages.send({
      userId:      'me',
      requestBody: {
        raw,
        ...(threadId ? { threadId } : {}),
      },
    })

    // Mark original as read if threadId provided
    if (threadId) {
      await gmail.users.threads.modify({
        userId:      'me',
        id:          threadId,
        requestBody: { removeLabelIds: ['UNREAD'] },
      }).catch(() => {}) // ignore if fails
    }

    return Response.json({ success: true, messageId: result.data.id })

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}