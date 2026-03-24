import type { Metadata } from 'next'
import { Syne, Syne_Mono, Outfit, Caveat } from 'next/font/google'
import { DesktopNav } from '@/components/layout/DesktopNav'
import { BottomNav } from '@/components/layout/BottomNav'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit-var',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne-var',
})

const syneMono = Syne_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-synemono-var',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat-var',
})

export const metadata: Metadata = {
  title: 'Sandkorn',
  description: 'Danish digital activism and boycott platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${syne.variable} ${syneMono.variable} ${caveat.variable} font-sans`}>
        <DesktopNav />
        <main className="md:pt-16">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
