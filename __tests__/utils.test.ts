import { getInitials, isValidEmail, adjustBrightness, formatRelativeTime, truncate, getGreeting, isValidUrl } from '@/lib/utils'

describe('getInitials', () => {
    it('returns two-letter initials from full name', () => {
        expect(getInitials('Alex Rivera')).toBe('AR')
    })
    it('returns single char for single name', () => {
        expect(getInitials('Alex')).toBe('A')
    })
    it('uses first and last word when name has 3+ words', () => {
        expect(getInitials('Mary Jane Watson')).toBe('MW')
    })
    it('returns ? for empty string', () => {
        expect(getInitials('')).toBe('?')
    })
    it('returns ? for null/undefined', () => {
        expect(getInitials(null)).toBe('?')
        expect(getInitials(undefined)).toBe('?')
    })
})

describe('isValidEmail', () => {
    it('accepts valid emails', () => {
        expect(isValidEmail('user@example.com')).toBe(true)
        expect(isValidEmail('a+b@co.io')).toBe(true)
    })
    it('rejects invalid emails', () => {
        expect(isValidEmail('notanemail')).toBe(false)
        expect(isValidEmail('@nodomain')).toBe(false)
    })
})

describe('adjustBrightness', () => {
    it('returns a valid hex colour', () => {
        const result = adjustBrightness('#C9A84C', 20)
        expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })
    it('clamps channels to 0–255', () => {
        expect(adjustBrightness('#ffffff', 100)).toBe('#ffffff')
        expect(adjustBrightness('#000000', -100)).toBe('#000000')
    })
})

describe('formatRelativeTime', () => {
    it('returns "just now" for very recent dates', () => {
        expect(formatRelativeTime(new Date().toISOString())).toBe('just now')
    })
    it('returns empty string for null/undefined', () => {
        expect(formatRelativeTime(null)).toBe('')
        expect(formatRelativeTime(undefined)).toBe('')
    })
})

describe('truncate', () => {
    it('truncates long text', () => {
        expect(truncate('Hello, world!', 8)).toBe('Hello, …')
    })
    it('returns original if within limit', () => {
        expect(truncate('Hi', 10)).toBe('Hi')
    })
    it('returns empty for null', () => {
        expect(truncate(null, 10)).toBe('')
    })
})

describe('getGreeting', () => {
    it('returns a greeting string', () => {
        const result = getGreeting()
        expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(result)
    })
})

describe('isValidUrl', () => {
    it('accepts valid URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true)
    })
    it('rejects invalid URLs', () => {
        expect(isValidUrl('not-a-url')).toBe(false)
    })
})
