// app/context/CareModeContext.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type CareModeContextType = {
  careMode: boolean
  toggleCareMode: () => void
  isDark: boolean
  toggleDarkMode: () => void
}

const CareModeContext = createContext<CareModeContextType | null>(null)

export function CareModeProvider({ children }: { children: React.ReactNode }) {
  const [careMode, setCareMode] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (careMode) {
      document.documentElement.style.fontSize = '120%'
      document.documentElement.style.lineHeight = '1.8'
    } else {
      document.documentElement.style.fontSize = '100%'
      document.documentElement.style.lineHeight = '1.5'
    }
  }, [careMode])

  return (
    <CareModeContext.Provider value={{
      careMode,
      toggleCareMode: () => setCareMode(!careMode),
      isDark,
      toggleDarkMode: () => setIsDark(!isDark)
    }}>
      <div className={`${careMode ? 'care-mode' : ''} ${isDark ? 'dark' : ''}`}>
        {children}
      </div>
    </CareModeContext.Provider>
  )
}

export function useCareMode() {
  const context = useContext(CareModeContext)
  if (!context) throw new Error('useCareMode must be used within CareModeProvider')
  return context
}