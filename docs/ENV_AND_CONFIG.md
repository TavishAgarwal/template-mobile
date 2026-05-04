# Environment & Configuration — Velvet

---

## Environment Variables

Create `.env.local` in the project root (never commit this):

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# PostHog Analytics (optional but recommended)
EXPO_PUBLIC_POSTHOG_API_KEY=phc_your_posthog_key
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

Prefix with `EXPO_PUBLIC_` for anything that needs to be accessible in the app bundle.

---

## `app.json`

```json
{
  "expo": {
    "name": "Velvet",
    "slug": "velvet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "scheme": "velvet",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0A0A0A"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.velvet.app",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Velvet uses your photo library to set your profile picture.",
        "NSCameraUsageDescription": "Velvet uses your camera to take a profile photo."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0A0A0A"
      },
      "package": "com.velvet.app"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      [
        "expo-image-picker",
        {
          "photosPermission": "Velvet accesses your photos to set your profile picture."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

## `package.json` — Key Dependencies

```json
{
  "dependencies": {
    "expo": "~55.0.0",
    "expo-router": "~4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",

    "@supabase/supabase-js": "^2.45.0",
    "@react-native-async-storage/async-storage": "^2.0.0",

    "@tanstack/react-query": "^5.56.0",

    "react-native-reanimated": "~3.16.0",
    "react-native-gesture-handler": "~2.20.0",
    "@gorhom/bottom-sheet": "^5.0.0",

    "expo-linear-gradient": "~14.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-clipboard": "~7.0.0",
    "expo-sharing": "~12.0.0",

    "lucide-react-native": "^0.447.0",
    "@expo-google-fonts/playfair-display": "^0.2.3",
    "@expo-google-fonts/dm-sans": "^0.2.3",

    "@react-native-community/netinfo": "^11.3.0",
    "nativewind": "^4.0.0",

    "i18next": "^23.0.0",
    "react-i18next": "^15.0.0",

    "posthog-react-native": "^3.0.0"
  }
}
```

---

## `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: '#C9A84C',
        'accent-dim': 'rgba(201,168,76,0.12)',
        'bg-base': '#0A0A0A',
        'bg-surface': '#141414',
        'bg-elevated': '#1C1C1C',
        'text-primary': '#F5F5F0',
        'text-secondary': '#888880',
        'text-tertiary': '#555550',
        success: '#4CAF7C',
        warning: '#E8B84C',
        error: '#E85C4C',
        info: '#4C8CE8',
      },
    },
  },
  plugins: [],
}
```

---

## `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin', // Must be LAST
    ],
  }
}
```

---

## `metro.config.js`

```javascript
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './global.css' })
```

---

## `global.css` (NativeWind v4 entry)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## `eas.json`

```json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## `lib/constants.ts`

```typescript
export const APP_NAME = 'Velvet'
export const APP_TAGLINE = 'Not everyone gets in.'
export const APP_DESCRIPTION = 'A curated circle of interesting people.'
export const SUPPORT_EMAIL = 'hello@joinvelvet.com'

export const INVITE_CODE_LENGTH = 8
export const DEFAULT_INVITE_COUNT = 3
export const MAX_BIO_LENGTH = 160
export const MIN_ESSAY_LENGTH = 100
export const MAX_ESSAY_LENGTH = 500
export const APPLICATION_STEPS = 4
```

---

## `lib/analytics.ts`

```typescript
import PostHog from 'posthog-react-native'

export const posthog = new PostHog(
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY!,
  { host: process.env.EXPO_PUBLIC_POSTHOG_HOST }
)

// Event tracking helpers
export const analytics = {
  track: (event: string, props?: Record<string, unknown>) => {
    posthog.capture(event, props)
  },
  identify: (userId: string, traits?: Record<string, unknown>) => {
    posthog.identify(userId, traits)
  },
  reset: () => {
    posthog.reset()
  },
  // Key events
  applicationStarted: () => analytics.track('application_started'),
  applicationSubmitted: (city: string) => analytics.track('application_submitted', { city }),
  memberLoggedIn: () => analytics.track('member_logged_in'),
  profileCompleted: () => analytics.track('profile_completed'),
  eventRsvped: (eventId: string, status: string) => analytics.track('event_rsvped', { eventId, status }),
  messageSent: () => analytics.track('message_sent'),
  inviteShared: () => analytics.track('invite_shared'),
  adminApproved: (applicationId: string) => analytics.track('admin_approved', { applicationId }),
  adminRejected: (applicationId: string) => analytics.track('admin_rejected', { applicationId }),
}
```

---

## `lib/utils.ts`

```typescript
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatEventDateShort(dateString: string): string {
  const date = new Date(dateString)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate().toString(),
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

export function getMorningOrEvening(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
```
