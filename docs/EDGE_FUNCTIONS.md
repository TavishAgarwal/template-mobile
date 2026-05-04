# Edge Functions — Velvet

Two Supabase Edge Functions handle transactional email. Both are invoked via HTTP POST from the admin approval flow.

---

## Setup

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize (if not done)
supabase init

# Create the functions
supabase functions new send-approval-email
supabase functions new send-rejection-email
supabase functions new notify-on-message
```

Set secrets:
```bash
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set APP_URL=https://joinvelvet.com
```

---

## `supabase/functions/send-approval-email/index.ts`

Uses **Resend** for email delivery. Replace with SendGrid/Postmark if preferred — same pattern.

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const APP_URL = Deno.env.get('APP_URL') ?? 'https://joinvelvet.com'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { applicationId, applicantEmail, applicantName } = await req.json()

    if (!applicantEmail || !applicantName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Generate OTP magic link via Supabase Admin
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: applicantEmail,
      options: {
        redirectTo: `${APP_URL}/onboarding`,
      },
    })

    if (linkError) throw linkError

    const magicLink = linkData.properties?.action_link ?? `${APP_URL}/(auth)/login`

    // Send email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Velvet <hello@joinvelvet.com>',
        to: [applicantEmail],
        subject: "You're in. Welcome to Velvet.",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="background:#0A0A0A;color:#F5F5F0;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:48px 24px;">
            <p style="color:#C9A84C;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-bottom:32px;">VELVET</p>
            <h1 style="font-size:28px;font-weight:400;margin-bottom:16px;">You're in, ${applicantName.split(' ')[0]}.</h1>
            <p style="color:#888880;font-size:16px;line-height:1.7;margin-bottom:32px;">
              Your application has been reviewed and approved. Welcome to the circle.
            </p>
            <p style="color:#888880;font-size:15px;line-height:1.7;margin-bottom:40px;">
              Click below to set up your profile and meet your fellow members.
            </p>
            <a href="${magicLink}" 
               style="display:inline-block;background:#C9A84C;color:#0A0A0A;text-decoration:none;padding:16px 32px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
              Enter Velvet →
            </a>
            <p style="color:#555550;font-size:12px;margin-top:48px;line-height:1.6;">
              This link expires in 24 hours. If you didn't apply for Velvet, ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0;" />
            <p style="color:#555550;font-size:11px;">© 2025 Velvet · <a href="${APP_URL}/privacy" style="color:#555550;">Privacy</a></p>
          </body>
          </html>
        `,
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.text()
      throw new Error(`Resend error: ${err}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('send-approval-email error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

---

## `supabase/functions/send-rejection-email/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const APP_URL = Deno.env.get('APP_URL') ?? 'https://joinvelvet.com'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { applicationId, applicantEmail, applicantName } = await req.json()

    const firstName = applicantName?.split(' ')[0] ?? 'there'

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Velvet <hello@joinvelvet.com>',
        to: [applicantEmail],
        subject: 'Your Velvet application',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="background:#0A0A0A;color:#F5F5F0;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:48px 24px;">
            <p style="color:#C9A84C;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-bottom:32px;">VELVET</p>
            <h1 style="font-size:24px;font-weight:400;margin-bottom:16px;">Thank you, ${firstName}.</h1>
            <p style="color:#888880;font-size:16px;line-height:1.7;margin-bottom:24px;">
              We appreciate you taking the time to apply to Velvet.
            </p>
            <p style="color:#888880;font-size:15px;line-height:1.7;margin-bottom:24px;">
              We're very selective about timing and fit — we review every application personally, 
              and at this time we're not moving forward with yours.
            </p>
            <p style="color:#888880;font-size:15px;line-height:1.7;margin-bottom:40px;">
              If a member of Velvet refers you in the future, we'd be glad to take another look.
            </p>
            <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0;" />
            <p style="color:#555550;font-size:11px;">© 2025 Velvet · <a href="${APP_URL}/privacy" style="color:#555550;">Privacy</a></p>
          </body>
          </html>
        `,
      }),
    })

    if (!emailRes.ok) {
      throw new Error(`Resend error: ${await emailRes.text()}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('send-rejection-email error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

---

## `supabase/functions/notify-on-message/index.ts`

DB webhook triggered on `messages` INSERT. Creates a notification for the recipient.

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const payload = await req.json()
  const message = payload.record // new message row

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Get conversation to find recipient
  const { data: conversation } = await supabase
    .from('conversations')
    .select('member_1_id, member_2_id')
    .eq('id', message.conversation_id)
    .single()

  if (!conversation) return new Response('ok')

  const recipientId =
    conversation.member_1_id === message.sender_id
      ? conversation.member_2_id
      : conversation.member_1_id

  // Get sender name
  const { data: sender } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', message.sender_id)
    .single()

  const senderName = sender?.display_name ?? 'Someone'

  // Insert notification
  await supabase.from('notifications').insert({
    user_id: recipientId,
    type: 'new_message',
    title: `${senderName} sent you a message`,
    body: message.content.slice(0, 80),
    data: {
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
    },
  })

  return new Response('ok', { status: 200 })
})
```

### Register the webhook in Supabase Dashboard:
1. Go to **Database → Webhooks**
2. Create webhook on table `messages`, event `INSERT`
3. Point to: `https://<project>.supabase.co/functions/v1/notify-on-message`
4. Add header: `Authorization: Bearer <service_role_key>`

---

## Deploy

```bash
# Deploy all functions
supabase functions deploy send-approval-email
supabase functions deploy send-rejection-email
supabase functions deploy notify-on-message

# Set secrets (production)
supabase secrets set RESEND_API_KEY=re_live_xxx
supabase secrets set APP_URL=https://joinvelvet.com
```

---

## Local Testing

```bash
# Serve locally
supabase functions serve --env-file .env.local

# Test approval email
curl -X POST http://localhost:54321/functions/v1/send-approval-email \
  -H "Content-Type: application/json" \
  -d '{"applicationId":"test","applicantEmail":"test@example.com","applicantName":"Test User"}'
```

---

## Email Provider Alternatives

If not using Resend, swap the fetch block:

**SendGrid:**
```typescript
// endpoint: https://api.sendgrid.com/v3/mail/send
// header: Authorization: Bearer SG.xxx
// body: { personalizations: [{to:[{email}]}], from: {email}, subject, content: [{type:'text/html',value:html}] }
```

**Postmark:**
```typescript
// endpoint: https://api.postmarkapp.com/email
// header: X-Postmark-Server-Token: xxx
// body: { From, To, Subject, HtmlBody }
```
