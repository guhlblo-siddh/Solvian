import './globals.css'
import ErrorBoundary from './components/ErrorBoundary'

export const metadata = {
  title:       'Solvian Email AI — AI-powered replies for small businesses',
  description: 'Reply to customer emails in seconds with AI. Professional, multilingual, and always on-brand.',
  keywords:    'email AI, customer service, auto reply, small business, salon, shop',
  authors:     [{ name: 'Solvian' }],
  openGraph: {
    title:       'Solvian Email AI',
    description: 'Reply to customer emails in seconds with AI.',
    type:        'website',
    locale:      'en_US',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Solvian Email AI',
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export const viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor:   '#08080f',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}