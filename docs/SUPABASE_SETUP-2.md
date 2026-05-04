# Supabase Setup — Velvet

Step-by-step guide to configure the Supabase backend. Run every migration before building any screen.

---

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `velvet`
3. Database password: generate and save securely
4. Region: pick closest to your users (e.g., `ap-south-1` for India)
5. Copy from Settings → API:
   - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon public` key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Run Migrations — In Order

Go to **SQL Editor** in Supabase dashboard and run each migration:

---

### Migration 001 — Profiles + Auth Trigger

```sql
-- 001_init.sql

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT NOT NULL,
  display_name          TEXT,
  avatar_url            TEXT,
  city                  TEXT,
  profession            TEXT,
  company               TEXT,
  linkedin_url          TEXT,
  instagram_handle      TEXT,
  bio                   TEXT,
  role                  TEXT NOT NULL DEFAULT 'applicant',
  invite_code           TEXT UNIQUE,
  invited_by            UUID REFERENCES public.profiles(id),
  invite_count          INT NOT NULL DEFAULT 3,
  is_online             BOOLEAN DEFAULT FALSE,
  last_seen_at          TIMESTAMPTZ,
  onboarding_completed  BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate invite code function
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(gen_random_uuid()::text FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view other members"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      role IN ('member', 'admin') OR
      auth.uid() = id
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### Migration 002 — Applications

```sql
-- 002_applications.sql

CREATE TABLE public.applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email             TEXT NOT NULL,
  full_name         TEXT NOT NULL,
  city              TEXT NOT NULL,
  profession        TEXT NOT NULL,
  company           TEXT,
  linkedin_url      TEXT,
  instagram_handle  TEXT,
  why_join          TEXT NOT NULL,
  referral_code     TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',
  admin_notes       TEXT,
  reviewed_by       UUID REFERENCES public.profiles(id),
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can submit an application
CREATE POLICY "Anyone can insert application"
  ON public.applications FOR INSERT
  WITH CHECK (true);

-- Applicant can read their own
CREATE POLICY "Users can read own application"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all applications
CREATE POLICY "Admins can read all applications"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### Migration 003 — Events + RSVPs

```sql
-- 003_events.sql

CREATE TABLE public.events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  event_type      TEXT NOT NULL DEFAULT 'in_person',
  location        TEXT,
  address         TEXT,
  virtual_link    TEXT,
  cover_image_url TEXT,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ,
  capacity        INT,
  rsvp_count      INT NOT NULL DEFAULT 0,
  is_published    BOOLEAN DEFAULT FALSE,
  created_by      UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.event_rsvps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'going',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- RSVP count trigger
CREATE OR REPLACE FUNCTION public.handle_rsvp_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'going' THEN
    UPDATE public.events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'going' AND NEW.status = 'going' THEN
      UPDATE public.events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
    ELSIF OLD.status = 'going' AND NEW.status != 'going' THEN
      UPDATE public.events SET rsvp_count = GREATEST(rsvp_count - 1, 0) WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'going' THEN
    UPDATE public.events SET rsvp_count = GREATEST(rsvp_count - 1, 0) WHERE id = OLD.event_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_rsvp_change
  AFTER INSERT OR UPDATE OR DELETE ON public.event_rsvps
  FOR EACH ROW EXECUTE FUNCTION public.handle_rsvp_change();

-- RLS Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view published events"
  ON public.events FOR SELECT
  USING (
    is_published = true AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('member', 'admin'))
  );

CREATE POLICY "Admins can do everything with events"
  ON public.events FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS RSVPs
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members manage own RSVPs"
  ON public.event_rsvps FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Members see all RSVPs (social proof)"
  ON public.event_rsvps FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('member', 'admin'))
  );
```

---

### Migration 004 — Messaging

```sql
-- 004_messaging.sql

CREATE TABLE public.conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_1_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_2_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message    TEXT,
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_1_id, member_2_id)
);

CREATE TABLE public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members access own conversations"
  ON public.conversations FOR ALL
  USING (auth.uid() = member_1_id OR auth.uid() = member_2_id);

-- RLS Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members access messages in own conversations"
  ON public.messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (member_1_id = auth.uid() OR member_2_id = auth.uid())
    )
  );

-- Enable Realtime on messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
```

---

### Migration 005 — Invites

```sql
-- 005_invites.sql

CREATE TABLE public.invites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,
  created_by  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  used_by     UUID REFERENCES public.profiles(id),
  used_at     TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members see own invites"
  ON public.invites FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Members create invites"
  ON public.invites FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND invite_count > 0 AND role IN ('member', 'admin')
    )
  );

-- Admins see all invites
CREATE POLICY "Admins see all invites"
  ON public.invites FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Anyone can validate a code (for application form)
CREATE POLICY "Anyone can validate invite code"
  ON public.invites FOR SELECT
  USING (true);
```

---

### Migration 006 — Notifications

```sql
-- 006_notifications.sql

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```

---

## 3. Configure Auth

Go to **Authentication → Providers** in dashboard:

### Email (OTP / Magic Link)
- Enable Email provider ✅
- Disable "Confirm email" (use magic link instead)
- Set **Site URL** to your Expo scheme: `velvet://` for production, `exp://localhost:8081` for dev

### Google OAuth (optional)
1. Create project in Google Cloud Console
2. OAuth 2.0 → Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
3. Copy Client ID + Secret → Supabase Auth → Google provider

### Apple OAuth (optional, iOS only)
- Requires Apple Developer account
- Follow Supabase Apple auth guide

### Email Templates
In **Authentication → Email Templates**, customize:

**Confirm signup / Magic Link:**
```html
Subject: Your Velvet Access Link

<p>You've been approved. Welcome to the circle.</p>
<p><a href="{{ .ConfirmationURL }}">Enter Velvet →</a></p>
<p style="color:#888; font-size:12px;">This link expires in 24 hours.</p>
```

---

## 4. Configure Storage

Go to **Storage** → Create buckets:

### `avatars` bucket
- Public: ✅ Yes
- Allowed MIME types: `image/jpeg, image/png, image/webp`
- Max file size: 5MB

**Policies:**
```sql
-- Anyone can view avatars (public)
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Members can upload their own avatar
CREATE POLICY "Members upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Members can update own avatar
CREATE POLICY "Members update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### `event-covers` bucket
- Public: ✅ Yes
- Allowed MIME types: `image/jpeg, image/png, image/webp`
- Max file size: 10MB

**Policies:**
```sql
CREATE POLICY "Public can view event covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-covers');

CREATE POLICY "Admins can upload event covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-covers' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 5. Enable Realtime

Go to **Database → Replication**:

Enable for these tables:
- ✅ `messages`
- ✅ `notifications`

(Or use the SQL migrations above which include `ALTER PUBLICATION supabase_realtime ADD TABLE`)

---

## 6. Edge Functions

### `send-approval-email`

In Supabase dashboard → **Edge Functions** → New function:

```typescript
// supabase/functions/send-approval-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { applicationId, applicantEmail, applicantName } = await req.json()

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Send magic link to approved applicant
  const { error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: applicantEmail,
    options: {
      redirectTo: 'velvet://onboarding',
    }
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  // In production: use Resend / SendGrid to send a branded email
  // For hackathon: Supabase's built-in email is fine

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### `send-rejection-email`

```typescript
// supabase/functions/send-rejection-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { applicantEmail, applicantName } = await req.json()

  // In production: send branded rejection email via Resend
  // For hackathon demo: log and return success
  console.log(`Rejection email for ${applicantName} (${applicantEmail})`)

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

**Deploy edge functions:**
```bash
npx supabase functions deploy send-approval-email
npx supabase functions deploy send-rejection-email
```

---

## 7. Seed Data (For Demo)

Run this in SQL Editor to populate realistic demo data:

```sql
-- Create an admin user first via Supabase Auth, then run this:
-- Replace 'your-admin-uuid' with actual UUID from auth.users

UPDATE public.profiles
SET
  role = 'admin',
  display_name = 'Admin',
  city = 'New York',
  profession = 'Community Manager',
  onboarding_completed = true
WHERE id = 'your-admin-uuid';

-- Seed some demo events
INSERT INTO public.events (title, description, event_type, location, starts_at, is_published, rsvp_count) VALUES
(
  'Velvet Rooftop Mixer',
  'An intimate evening with the most interesting people in the city. Cocktails, conversation, no small talk.',
  'in_person',
  'The Standard Hotel, New York',
  NOW() + INTERVAL '7 days',
  true,
  47
),
(
  'The Future of AI — Velvet Circle Conversation',
  'A closed-door roundtable with founders, investors, and researchers. Velvet members only.',
  'virtual',
  'Zoom',
  NOW() + INTERVAL '14 days',
  true,
  23
),
(
  'Members Dinner — San Francisco',
  'Seasonal menu. Curated seating. Leave your pitch deck at home.',
  'in_person',
  'Quince Restaurant, San Francisco',
  NOW() + INTERVAL '21 days',
  true,
  31
);
```

---

## 8. Local Supabase CLI (Optional but Recommended)

For running Supabase locally during development:

```bash
# Install CLI
npm install -g supabase

# Link to project
supabase login
supabase link --project-ref your-project-ref

# Pull remote schema to local
supabase db pull

# Run local Supabase stack
supabase start

# Push local migrations to remote
supabase db push
```

---

## 9. Environment Checklist

Before running the app, verify:

- [ ] `.env.local` has `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] All 6 migrations run successfully (check Tables in Supabase dashboard)
- [ ] Auth email provider enabled, site URL configured
- [ ] Storage buckets `avatars` and `event-covers` created with correct policies
- [ ] Realtime enabled on `messages` and `notifications` tables
- [ ] At least one user promoted to `admin` role for demo
- [ ] Seed events added so Events tab isn't empty in demo

---

## 10. Common Supabase Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `row-level security policy` violation | RLS blocking query | Check policies for that table; ensure user role matches |
| `duplicate key value` on conversations | UNIQUE constraint on member pair | Use `upsert` or check-then-insert pattern |
| `JWT expired` | Token stale | Handled by `autoRefreshToken: true` in client config |
| `realtime not receiving events` | Table not in publication | Run `ALTER PUBLICATION supabase_realtime ADD TABLE table_name` |
| `storage object not found` | Wrong bucket or path | Check bucket name matches exactly: `avatars` not `avatar` |
| `edge function returned 500` | Missing env var in function | Set secrets: `supabase secrets set KEY=value` |
