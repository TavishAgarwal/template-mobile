/**
 * Velvet mock data — used as placeholderData in TanStack Query hooks.
 * Screens must never flash empty on first load.
 */
import type { Profile, Application, Event, Conversation, Message, Invite, Notification } from '@/types'

// ─── PROFILES / MEMBERS ───────────────────────────────────────────────────────

export const mockMembers: Profile[] = [
  {
    id: 'mock-member-1', email: 'alexandra@sequoia.com', display_name: 'Alexandra Chen',
    avatar_url: null, city: 'San Francisco', profession: 'Venture Capitalist',
    company: 'Sequoia Capital', linkedin_url: 'https://linkedin.com/in/alexandrachen',
    instagram_handle: 'alexandra.chen',
    bio: 'Early-stage investor focused on consumer and fintech. Previously founded two companies (one exit). Lover of good wine and worse jokes.',
    role: 'member', invite_code: 'ALEX1234', invited_by: null, invite_count: 2,
    is_online: true, last_seen_at: new Date().toISOString(), onboarding_completed: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-member-2', email: 'marcus@variant.fund', display_name: 'Marcus Webb',
    avatar_url: null, city: 'New York', profession: 'Founder', company: 'Variant Fund',
    linkedin_url: 'https://linkedin.com/in/marcuswebb', instagram_handle: 'marcuswebb',
    bio: 'Building the next layer of financial infrastructure. Marathon runner. Obsessed with Ethiopian coffee.',
    role: 'member', invite_code: 'MARC5678', invited_by: 'mock-member-1', invite_count: 1,
    is_online: false, last_seen_at: new Date(Date.now() - 7200000).toISOString(),
    onboarding_completed: true,
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-member-3', email: 'priya@designstudio.io', display_name: 'Priya Sharma',
    avatar_url: null, city: 'London', profession: 'Creative Director', company: 'Studio Eight',
    linkedin_url: null, instagram_handle: 'priya.makes',
    bio: 'Design director by day, ceramicist by weekend. Obsessed with the intersection of craft and technology.',
    role: 'member', invite_code: 'PRIY9012', invited_by: null, invite_count: 3,
    is_online: true, last_seen_at: new Date().toISOString(), onboarding_completed: true,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-member-4', email: 'james@manifold.xyz', display_name: 'James Okafor',
    avatar_url: null, city: 'Lagos', profession: 'Entrepreneur', company: 'Manifold',
    linkedin_url: 'https://linkedin.com/in/jamesokafor', instagram_handle: 'james.okafor',
    bio: "Building Africa's next consumer platform. Previously scaled ops at Stripe. Part-time philosopher.",
    role: 'member', invite_code: 'JAME3456', invited_by: 'mock-member-2', invite_count: 0,
    is_online: false, last_seen_at: new Date(Date.now() - 18000000).toISOString(),
    onboarding_completed: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-member-5', email: 'sofia@architects.com', display_name: 'Sofia Reyes',
    avatar_url: null, city: 'Mexico City', profession: 'Architect', company: 'Reyes & Partners',
    linkedin_url: 'https://linkedin.com/in/sofiareyes', instagram_handle: 'sofia.builds',
    bio: 'Designing spaces that outlast trends. Studio based between Mexico City and Madrid. Dog mom.',
    role: 'member', invite_code: 'SOFI7890', invited_by: 'mock-member-3', invite_count: 2,
    is_online: true, last_seen_at: new Date().toISOString(), onboarding_completed: true,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-member-6', email: 'theo@signal.vc', display_name: 'Theo Nakamura',
    avatar_url: null, city: 'Tokyo', profession: 'Investor', company: 'Signal Ventures',
    linkedin_url: 'https://linkedin.com/in/theonakamura', instagram_handle: null,
    bio: 'Seed investor in climatetech and deep tech. Spent 5 years in academia before finance. Kendo practitioner.',
    role: 'member', invite_code: 'THEO2345', invited_by: null, invite_count: 3,
    is_online: false, last_seen_at: new Date(Date.now() - 86400000).toISOString(),
    onboarding_completed: true,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-member-7', email: 'nina@haus.media', display_name: 'Nina Volkov',
    avatar_url: null, city: 'Berlin', profession: 'Journalist', company: 'Haus Media',
    linkedin_url: 'https://linkedin.com/in/ninavolkov', instagram_handle: 'nina.writes',
    bio: 'Covering culture, power, and the places they intersect. Bylines in NYT, The Atlantic, Wired.',
    role: 'member', invite_code: 'NINA6789', invited_by: 'mock-member-1', invite_count: 1,
    is_online: false, last_seen_at: new Date(Date.now() - 1800000).toISOString(),
    onboarding_completed: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-member-8', email: 'cai@wei.co', display_name: 'Cai Wei',
    avatar_url: null, city: 'Singapore', profession: 'Product Lead', company: 'Grab',
    linkedin_url: 'https://linkedin.com/in/caiwei', instagram_handle: 'cai.wei',
    bio: "Leading product for Southeast Asia's largest super-app. Chess player, dim sum enthusiast.",
    role: 'member', invite_code: 'CAIW0123', invited_by: 'mock-member-4', invite_count: 2,
    is_online: true, last_seen_at: new Date().toISOString(), onboarding_completed: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// ─── EVENTS ───────────────────────────────────────────────────────────────────

export const mockEvents: Event[] = [
  {
    id: 'mock-event-1', title: 'Velvet Rooftop Mixer — New York',
    description: "An intimate evening on The Standard's rooftop. Cocktails, conversations, and the Manhattan skyline. Limited to 40 members.",
    event_type: 'in_person', location: 'The Standard, High Line',
    address: '848 Washington St, New York, NY 10014', virtual_link: null,
    cover_image_url: null, starts_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    ends_at: new Date(Date.now() + 7 * 86400000 + 10800000).toISOString(),
    capacity: 40, rsvp_count: 23, is_published: true, created_by: 'mock-admin-1',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'mock-event-2', title: 'Fireside: The Future of Taste',
    description: 'A virtual conversation with founders redefining how we eat, drink, and experience food. Q&A to follow.',
    event_type: 'virtual', location: 'Zoom', address: null,
    virtual_link: 'https://zoom.us/j/velvet-fireside', cover_image_url: null,
    starts_at: new Date(Date.now() + 3 * 86400000).toISOString(),
    ends_at: new Date(Date.now() + 3 * 86400000 + 5400000).toISOString(),
    capacity: null, rsvp_count: 61, is_published: true, created_by: 'mock-admin-1',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'mock-event-3', title: 'London Gallery Walk — Mayfair',
    description: 'Private access to three Mayfair galleries followed by dinner at Gymkhana. Members only.',
    event_type: 'in_person', location: 'Mayfair, London',
    address: 'Meet at Gagosian, 17-19 Davies St, London W1K 3JP', virtual_link: null,
    cover_image_url: null, starts_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    ends_at: null, capacity: 20, rsvp_count: 12, is_published: true,
    created_by: 'mock-admin-1', created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'mock-event-4', title: 'Office Hours: Ask a VC Anything',
    description: 'Open Q&A with three investors across consumer, fintech, and deep tech. No pitches — just honest conversation.',
    event_type: 'virtual', location: 'Zoom', address: null,
    virtual_link: 'https://zoom.us/j/velvet-officehours', cover_image_url: null,
    starts_at: new Date(Date.now() + 21 * 86400000).toISOString(),
    ends_at: new Date(Date.now() + 21 * 86400000 + 3600000).toISOString(),
    capacity: null, rsvp_count: 38, is_published: true, created_by: 'mock-admin-1',
    created_at: new Date().toISOString(),
  },
]

// ─── CONVERSATIONS ────────────────────────────────────────────────────────────

export const mockConversations: Conversation[] = [
  {
    id: 'mock-conv-1', member_1_id: 'current-user-id', member_2_id: 'mock-member-1',
    last_message: 'Would love to connect at the NY mixer!',
    last_message_at: new Date(Date.now() - 1200000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    other_member: mockMembers[0], unread_count: 1,
  },
  {
    id: 'mock-conv-2', member_1_id: 'mock-member-3', member_2_id: 'current-user-id',
    last_message: 'The ceramics studio opens next month — you should come.',
    last_message_at: new Date(Date.now() - 10800000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    other_member: mockMembers[2], unread_count: 0,
  },
  {
    id: 'mock-conv-3', member_1_id: 'current-user-id', member_2_id: 'mock-member-7',
    last_message: 'Read your Atlantic piece. Outstanding.',
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    other_member: mockMembers[6], unread_count: 0,
  },
]

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export const mockMessages: Message[] = [
  { id: 'mock-msg-1', conversation_id: 'mock-conv-1', sender_id: 'current-user-id',
    content: "Hey Alexandra — just joined Velvet. Love what you're building at Sequoia.",
    is_read: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'mock-msg-2', conversation_id: 'mock-conv-1', sender_id: 'mock-member-1',
    content: 'Welcome! Great to have you here. Are you based in SF?',
    is_read: true, created_at: new Date(Date.now() - 2 * 86400000 + 600000).toISOString() },
  { id: 'mock-msg-3', conversation_id: 'mock-conv-1', sender_id: 'current-user-id',
    content: 'NYC actually. Are you coming to the rooftop mixer?',
    is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'mock-msg-4', conversation_id: 'mock-conv-1', sender_id: 'mock-member-1',
    content: 'Would love to connect at the NY mixer!',
    is_read: false, created_at: new Date(Date.now() - 1200000).toISOString() },
]

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────

export const mockApplications: Application[] = [
  {
    id: 'mock-app-1', user_id: 'mock-applicant-1', email: 'dan@techco.io',
    full_name: 'Daniel Park', city: 'Seoul', profession: 'Software Engineer', company: 'Kakao',
    linkedin_url: 'https://linkedin.com/in/danielpark', instagram_handle: 'dan.park',
    why_join: "I've been building in the consumer space for 8 years and I'm looking for a community of peers who think differently about what products can be. Velvet seems like the rare circle where depth of conversation is valued over breadth of followers.",
    referral_code: 'ALEX1234', status: 'pending', admin_notes: null,
    reviewed_by: null, reviewed_at: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'mock-app-2', user_id: 'mock-applicant-2', email: 'fatima@lawgroup.com',
    full_name: 'Fatima Al-Rashid', city: 'Dubai', profession: 'Corporate Lawyer',
    company: 'Al-Rashid & Associates', linkedin_url: 'https://linkedin.com/in/fatimaalrashid',
    instagram_handle: null,
    why_join: "I work at the intersection of international law and emerging technology. I'm looking for a space to connect with founders and operators who are thinking seriously about the next decade of business — not just the next funding round.",
    referral_code: null, status: 'pending', admin_notes: null,
    reviewed_by: null, reviewed_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-app-3', user_id: 'mock-applicant-3', email: 'leo@studio.art',
    full_name: 'Leo Fontaine', city: 'Paris', profession: 'Artist', company: 'Independent',
    linkedin_url: null, instagram_handle: 'leo.fontaine.art',
    why_join: "My practice sits at the intersection of fine art and digital media. I'm not looking for another social platform — I'm looking for a curated group of interesting people across disciplines. The Velvet brief resonates with how I want to spend my energy.",
    referral_code: 'PRIY9012', status: 'pending', admin_notes: null,
    reviewed_by: null, reviewed_at: null,
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
]

// ─── INVITES ──────────────────────────────────────────────────────────────────

export const mockInvites: Invite[] = [
  { id: 'mock-invite-1', code: 'VLVT1234', created_by: 'current-user-id',
    used_by: 'mock-member-7', used_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    expires_at: null, created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    used_by_profile: mockMembers[6] },
  { id: 'mock-invite-2', code: 'VLVT5678', created_by: 'current-user-id',
    used_by: null, used_at: null, expires_at: null,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'mock-invite-3', code: 'VLVT9012', created_by: 'current-user-id',
    used_by: null, used_at: null, expires_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString() },
]

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export const mockNotifications: Notification[] = [
  { id: 'mock-notif-1', user_id: 'current-user-id', type: 'new_member',
    title: 'New member joined', body: 'Cai Wei from Singapore just joined the circle.',
    data: { member_id: 'mock-member-8' }, is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'mock-notif-2', user_id: 'current-user-id', type: 'event_reminder',
    title: 'Rooftop Mixer in 48 hours', body: 'The NY mixer is coming up. 23 members are going.',
    data: { event_id: 'mock-event-1' }, is_read: false,
    created_at: new Date(Date.now() - 5 * 86400000 + 3600000).toISOString() },
  { id: 'mock-notif-3', user_id: 'current-user-id', type: 'invite_accepted',
    title: 'Your invite was accepted', body: 'Nina Volkov joined using your invite code.',
    data: { member_id: 'mock-member-7' }, is_read: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
]

// ─── ADMIN STATS ──────────────────────────────────────────────────────────────

export const mockAdminStats = {
  pendingApplications: 3,
  totalMembers: 127,
  eventsThisMonth: 4,
  messagesToday: 89,
}
