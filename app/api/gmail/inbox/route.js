import { google } from 'googleapis'
import { cookies } from 'next/headers'

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

function decodeBase64(str) {
  try {
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
  } catch {
    return ''
  }
}

function getEmailBody(payload) {
  if (!payload) return ''

  // Single part
  if (payload.body?.data) {
    return decodeBase64(payload.body.data)
  }

  // Multipart - find text/plain
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBase64(part.body.data)
      }
      // Nested parts
      if (part.parts) {
        for (const nested of part.parts) {
          if (nested.mimeType === 'text/plain' && nested.body?.data) {
            return decodeBase64(nested.body.data)
          }
        }
      }
    }
  }
  return ''
}

function getHeader(headers, name) {
  return headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''
}

// GET /api/gmail/inbox — fetch latest emails
export async function GET(req) {
  const tokens = getTokens(req)
  if (!tokens) {
    return Response.json({ error: 'Not connected to Gmail', connected: false }, { status: 401 })
  }

  try {
    oauth2Client.setCredentials(tokens)
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Get latest 10 unread emails
    const list = await gmail.users.messages.list({
      userId:   'me',
      maxResults: 10,
      q: 'is:unread category:primary',
    })

    const messages = list.data.messages || []

    if (messages.length === 0) {
      return Response.json({ emails: [], connected: true })
    }

    // Fetch full details for each message
    const emails = await Promise.all(
      messages.map(async (msg) => {
        const full = await gmail.users.messages.get({
          userId: 'me',
          id:     msg.id,
          format: 'full',
        })

        const headers  = full.data.payload?.headers || []
        const body     = getEmailBody(full.data.payload)
        const snippet  = full.data.snippet || ''

        return {
          id:        msg.id,
          threadId:  full.data.threadId,
          from:      getHeader(headers, 'from'),
          to:        getHeader(headers, 'to'),
          subject:   getHeader(headers, 'subject'),
          date:      getHeader(headers, 'date'),
          body:      body || snippet,
          snippet,
          unread:    full.data.labelIds?.includes('UNREAD') || false,
        }
      })
    )

    return Response.json({ emails, connected: true })

  } catch (err) {
    // Token might be expired
    if (err.message?.includes('invalid_grant') || err.message?.includes('Token')) {
      return Response.json({ error: 'Gmail session expired. Please reconnect.', connected: false }, { status: 401 })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}