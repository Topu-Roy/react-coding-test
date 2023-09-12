import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { UIProvider } from './uiProvider'

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
      <body className={inter.className}>
        <UIProvider>
          {children}
        </UIProvider>
      </body>
    </html>
  )
}
