import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Prompt, Sarabun } from 'next/font/google'
import './globals.css'

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-prompt',
})

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
})

export const metadata: Metadata = {
  title: 'สาธุ แอดมิน — แดชบอร์ด',
  description: 'ระบบบริหารการบริจาควัด',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f3f0f8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={`light bg-background ${prompt.variable} ${sarabun.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}