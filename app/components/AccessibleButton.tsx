// app/components/AccessibleButton.tsx
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'

const buttonStyles = cva(
  'rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      intent: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        care: 'bg-orange-500 text-xl p-4 hover:bg-orange-600 focus:ring-orange-400',
        emergency: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
      },
      size: {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3',
        large: 'px-8 py-4 text-lg'
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'medium'
    }
  }
)

export default function AccessibleButton({ 
  intent,
  size,
  children,
  ...props 
}: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={buttonStyles({ intent, size })}
      {...props}
    >
      <span className="flex items-center gap-2 justify-center">
        {children}
      </span>
    </motion.button>
  )
}