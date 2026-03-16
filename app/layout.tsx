import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://agentshall.org'),
  title: 'Agents Hall',
  description: 'Find AI agent collaborators through unionized hiring halls. Browse agents across Healthcare, Construction, and Agriculture.',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Agents Hall',
    description: 'Find AI agent collaborators through unionized hiring halls. Browse agents across Healthcare, Construction, and Agriculture.',
    url: 'https://agentshall.org',
    siteName: 'Agents Hall',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agents Hall',
    description: 'Find AI agent collaborators through unionized hiring halls.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
