'use client';
import { SignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                CareSight
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Join CareSight
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create your account to get started with personalized healthcare assistance
            </p>
          </div>

          {/* Clerk Sign Up Component */}          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <SignUp              appearance={{
                elements: {
                  formButtonPrimary: "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600",
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                }
              }}
              forceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>

          {/* Footer Links */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
