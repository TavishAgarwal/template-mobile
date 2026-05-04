# Database Schema — Velvet

All tables live in Supabase (PostgreSQL). Row Level Security (RLS) is enabled on every table.

---

## Tables

### `profiles`
Extends Supabase `auth.users`. Auto-created on signup via trigger.

```sql
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  display_name    TEXT,
  avatar_url      TEXT,
  city            TEXT,
  profession      TEXT,
  company         TEXT,
  linkedin_url    TEXT,
  instagram_handle TEXT,
  bio             TEXT,
  role            TEXT NOT NULL DEFAULT 'applicant',
  -- role: 'applicant' | 'pending' | 'member' | 'admin'
  invite_code     TEXT UNIQUE,             -- code this member can share
  invited_by      UUID REFERENCES profiles(id),
  invite_count    INT NOT NULL DEFAULT 3,  -- invites remaining
  is_online       BOOLEAN DEFAULT FALSE,
  last_seen_at    TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- `SELECT`: members can see all other members (role = 'member' or 'admin'). Admins see everyone.
- `UPDATE`: users can update their own row. Admins can update any row.

---

### `applications`
Stores the full membership application.

```sql
CREATE TABLE applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  city            TEXT NOT NULL,
  profession      TEXT NOT NULL,
  company         TEXT,
  linkedin_url    TEXT,
  instagram_handle TEXT,
  why_join        TEXT NOT NULL,         -- the essay answer
  referral_code   TEXT,                  -- invite code used
  status          TEXT NOT NULL DEFAULT 'pending',
  -- status: 'pending' | 'approved' | 'rejected' | 'waitlisted'
  admin_notes     TEXT,                  -- internal admin comment
  reviewed_by     UUID REFERENCES profiles(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- `INSERT`: anyone (including unauthenticated) can insert their application.
- `SELECT`: applicant can read their own row. Admins can read all.
- `UPDATE`: admins only (to update status, notes).

---

### `events`
Community events — virtual or in-person.

```sql
CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  event_type      TEXT NOT NULL DEFAULT 'in_person',
  -- event_type: 'in_person' | 'virtual'
  location        TEXT,                  -- venue name or "Zoom"
  address         TEXT,                  -- full address (in-person only)
  virtual_link    TEXT,                  -- Zoom/Meet link (virtual only)
  cover_image_url TEXT,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ,
  capacity        INT,                   -- NULL = unlimited
  rsvp_count      INT NOT NULL DEFAULT 0,
  is_published    BOOLEAN DEFAULT FALSE,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- `SELECT`: members can see published events. Admins see all.
- `INSERT/UPDATE/DELETE`: admins only.

---

### `event_rsvps`
Member RSVPs to events.

```sql
CREATE TABLE event_rsvps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'going',
  -- status: 'going' | 'maybe' | 'not_going'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

**RLS Policies:**
- `SELECT/INSERT/UPDATE`: members can manage their own RSVPs.
- `SELECT`: members can see who else is going (for social proof).

---

### `conversations`
Direct message conversations between two members.

```sql
CREATE TABLE conversations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_1_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  member_2_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_1_id, member_2_id)
);
```

**RLS Policies:**
- `SELECT/INSERT/UPDATE`: members can only see/create conversations they are part of.

---

### `messages`
Individual messages within a conversation.

```sql
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- `SELECT/INSERT`: members who are part of the conversation.
- Realtime enabled on this table for live chat.

---

### `invites`
Tracks invite links generated by members.

```sql
CREATE TABLE invites (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT UNIQUE NOT NULL,
  created_by   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  used_by      UUID REFERENCES profiles(id),
  -- NULL = not yet used
  used_at      TIMESTAMPTZ,
  expires_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- `SELECT`: member sees their own invites. Admins see all.
- `INSERT`: members can create invites (if invite_count > 0).

---

### `notifications`
In-app notifications for members.

```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  -- type: 'application_approved' | 'new_message' | 'event_reminder' | 
  --        'new_member' | 'invite_accepted' | 'application_rejected'
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB,           -- extra payload (event_id, member_id, etc.)
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- `SELECT/UPDATE`: users see and update only their own notifications.
- `INSERT`: service role only (Supabase edge functions).

---

## Key DB Functions / Triggers

### Auto-create profile on signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Generate invite code on member approval
```sql
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(gen_random_uuid()::text, 1, 8));
END;
$$ LANGUAGE plpgsql;
```

### Increment RSVP count
```sql
CREATE OR REPLACE FUNCTION increment_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events SET rsvp_count = rsvp_count + 1
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_rsvp_created
  AFTER INSERT ON event_rsvps
  FOR EACH ROW EXECUTE FUNCTION increment_rsvp_count();
```

---

## Realtime Subscriptions

Enable Realtime on these tables in the Supabase dashboard:
- `messages` — for live DM updates
- `notifications` — for real-time notification badge
- `applications` — for admin dashboard live updates

---

## Storage Buckets

| Bucket | Public | Used For |
|--------|--------|----------|
| `avatars` | Yes | Member profile photos |
| `event-covers` | Yes | Event cover images |

---

## Edge Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `send-approval-email` | HTTP POST from admin approve action | Sends approval email with OTP login link |
| `send-rejection-email` | HTTP POST from admin reject action | Sends polite rejection email |
| `notify-on-message` | DB webhook on `messages` insert | Creates notification for recipient |
