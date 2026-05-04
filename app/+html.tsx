import { ScrollViewStyleReset } from 'expo-router/html'
import type { PropsWithChildren } from 'react'

/**
 * Custom HTML wrapper for Expo Web.
 * Ensures the app fills the full viewport and behaves like a native mobile screen.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <title>Velvet</title>

        {/*
          Disable the body scroll bounce on iOS web and ensure
          full-screen rendering with no margins.
        */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      </head>
      <body style={{ height: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}

const GLOBAL_CSS = `
/* ── Full viewport reset ───────────────────────────────────────────────── */
html, body, #root, #__next {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #0A0A0A;
  -webkit-overflow-scrolling: touch;
}

/* Force React Native Web root to fill viewport */
body > div:first-child,
#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
}

/* Remove default focus outlines for mobile feel */
* {
  -webkit-tap-highlight-color: transparent;
  outline: none;
  box-sizing: border-box;
}

/* Prevent text selection for app-like feel */
body {
  -webkit-user-select: none;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Allow text selection in inputs */
input, textarea {
  -webkit-user-select: auto;
  user-select: auto;
}

/* Smooth scrolling for ScrollViews */
[data-testid="scroll-view"],
[role="scrollbar"] {
  -webkit-overflow-scrolling: touch;
}

/* Hide scrollbars but keep scrolling (mobile feel) */
::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`
