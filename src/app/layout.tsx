import type { Metadata } from 'next';
import './globals.css';
import Providers from '../components/Providers';

export const metadata: Metadata = {
  title: 'Md. Samim — AI & Backend Engineering Specialist',
  description: 'AI & Backend Specialist building scalable, high-performance web applications using Next.js and Node.js, with deep AI integration and autonomous workflow automation.',
  keywords: ['AI Engineer', 'Backend Specialist', 'Next.js', 'Node.js', 'Prisma ORM', 'PostgreSQL', 'Machine Learning', 'Md. Samim'],
  authors: [{ name: 'Md. Samim', url: 'https://github.com/MdShamim5669' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Italiana&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
