// app/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { CareModeProvider } from './context/CareModeContext'
import { ThemeProvider } from './context/ThemeContext'
import ThreeScene from './components/ThreeScene'

export const metadata = {
  title: 'CareSight - Medical Accessibility Assistant',
  description: 'AI-powered health form reader and medical assistant',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  // If no valid Clerk key is provided, render without Clerk
  if (!publishableKey || publishableKey === 'your_clerk_publishable_key_here') {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider>
            <CareModeProvider>
              {children}
            </CareModeProvider>
          </ThemeProvider>
        </body>
      </html>
    )
  }
  
  // Render with Clerk when key is available
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider>
            <CareModeProvider>
              {children}
            </CareModeProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
