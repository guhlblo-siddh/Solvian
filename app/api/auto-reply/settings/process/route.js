import Anthropic    from '@anthropic-ai/sdk'
import { google }   from 'googleapis'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase  = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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
  } catch { return null }
}

function decodeBase64(str) {
  try {
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
  } catch { return '' }
}

function getEmailBody(payload) {
  if (payload?.body?.data) return decodeBase64(payload.body.data)
  if (payload?.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) return decodeBase64(part.body.data)
    }
  }
  return ''
}

function getHeader(headers, name) {
  return headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''
}

function makeRawEmail({ to, subject, body }) {
  const email = [`To: ${to}`, `Subject: ${subject}`, 'Content-Type: text/plain; charset=utf-8', 'MIME-Version: 1.0', '', body].join('\n')
  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// POST /api/auto-reply/process
// Fetches unread emails, generates AI replies, optionally sends them
export async function POST(req) {
  const tokens = getTokens(req)
  if (!tokens) return Response.json({ error: 'Gmail not connected' }, { status: 401 })

  try {
    const { userEmail, autoSend = false } = await req.json()

    // Load settings from DB
    const { data: settings } = await supabase
      .from('auto_reply_settings')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (!settings?.enabled && !autoSend) {
      return Response.json({ message: 'Auto-reply is disabled', processed: [] })
    }

    oauth2Client.setCredentials(tokens)
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Get unread emails not yet processed
    const list = await gmail.users.messages.list({
      userId:     'me',
      maxResults: 5,
      q:          'is:unread category:primary -label:solvian-processed',
    })

    const messages = list.data.messages || []
    if (messages.length === 0) return Response.json({ processed: [], message: 'No new emails' })

    const processed = []

    for (const msg of messages) {
      try {
        const full    = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' })
        const headers = full.data.payload?.headers || []
        const from    = getHeader(headers, 'from')
        const subject = getHeader(headers, 'subject')
        const body    = getEmailBody(full.data.payload) || full.data.snippet || ''

        // Build system prompt from settings
        const systemPrompt = `You are a customer service assistant for "${settings?.business_name || 'our business'}", a ${settings?.business_type || 'local service'}.
Tone: ${settings?.tone || 'professional'}
Language: ${settings?.language === 'auto' ? 'Reply in the same language as the customer.' : `Reply in ${settings?.language}.`}
Rules: Keep replies short (3-5 sentences). Always offer next steps. Never invent specific times or prices.
${settings?.signature ? `Always end with this signature:\n${settings.signature}` : ''}

Return valid JSON only:
{
  "subject": "Re: [subject]",
  "reply": "email reply text",
  "detectedLanguage": "English",
  "qualityScore": 85,
  "shouldReply": true
}

Set shouldReply to false if the email is spam, a newsletter, or doesn't need a reply.`

        const message = await anthropic.messages.create({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 600,
          system:     systemPrompt,
          messages:   [{ role: 'user', content: `Customer email from ${from}:\nSubject: ${subject}\n\n${body}` }],
        })

        const raw    = message.content[0].text.replace(/```json|```/g, '').trim()
        const result = JSON.parse(raw)

        const entry = {
          id:               msg.id,
          threadId:         full.data.threadId,
          from,
          subject,
          body,
          aiReply:          result.reply,
          aiSubject:        result.subject,
          qualityScore:     result.qualityScore,
          detectedLanguage: result.detectedLanguage,
          shouldReply:      result.shouldReply,
          sent:             false,
          timestamp:        new Date().toISOString(),
        }

        // Auto-send if enabled and AI thinks it should reply
        if ((settings?.enabled || autoSend) && result.shouldReply) {
          const rawEmail = makeRawEmail({ to: from, subject: result.subject, body: result.reply })
          await gmail.users.messages.send({
            userId:      'me',
            requestBody: { raw: rawEmail, threadId: full.data.threadId },
          })

          // Mark as read and add label
          await gmail.users.messages.modify({
            userId:      'me',
            id:          msg.id,
            requestBody: { removeLabelIds: ['UNREAD'] },
          }).catch(() => {})

          entry.sent = true

          // Log to DB
          await supabase.from('auto_reply_log').insert({
            user_email:    userEmail,
            from_email:    from,
            subject,
            reply_sent:    result.reply,
            quality_score: result.qualityScore,
            language:      result.detectedLanguage,
            created_at:    new Date().toISOString(),
          }).catch(() => {})
        }

        processed.push(entry)
      } catch (msgErr) {
        // Skip individual email errors, continue processing
        console.error('Error processing email:', msgErr.message)
      }
    }

    return Response.json({ processed, total: processed.length })

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}