import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VelocityDrop - Game Server Management',
  description: 'Manage your game servers on-demand',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

