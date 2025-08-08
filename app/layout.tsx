import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taimoor Qureshi — Data Science Portfolio',
  description: 'Data Scientist | Health Data Science | Bayesian Clinical Trials',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
