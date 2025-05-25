// app/components/Layout.tsx
'use client';
import { ReactNode } from 'react'
import Navbar from './Navbar'
import { useCareMode } from '../context/CareModeContext'
import HealthTools from './HealthTools'
import EmergencyContacts from './EmergencyContacts'

export default function Layout({ children }: { children: ReactNode }) {
  const { careMode } = useCareMode()

  return (
    <div className={`min-h-screen ${careMode ? 'care-mode' : ''}`}>
      <Navbar />
      <div className={`container mx-auto px-4 py-8 ${
        careMode ? 'max-w-4xl text-xl space-y-6' : 'max-w-6xl space-y-8'
      }`}>
        <div className={`grid gap-6 ${careMode ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
          <aside className={`space-y-6 ${careMode ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <HealthTools />
            <EmergencyContacts />
          </aside>
          <main className={`${careMode ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}