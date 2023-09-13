import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import Providers from '@/utils/providers/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coding Challenge',
  description: 'By Topu Roy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          <main className="dark:bg-gray-950/50 bg-stone-100">
            <ThemeSwitcher />
            {children}
          </main>
          <Toaster position='top-right' />
        </Providers>
      </body>
    </html >
  )
}
