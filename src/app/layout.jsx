import 'katex/dist/katex.min.css';
import Script from 'next/script';
import '../assets/stylesheets/index.scss';
import '../assets/stylesheets/alimentation.scss';
import '../assets/stylesheets/avent.scss';
import '../assets/stylesheets/cooldown.scss';
import '../assets/stylesheets/maintenance.scss';
import '../assets/stylesheets/minestrator.scss';
import '../assets/stylesheets/not-found.scss';
import '../assets/stylesheets/november21.scss';
import '../assets/stylesheets/portfolio.scss';
import '../assets/stylesheets/ressources.scss';
import '../assets/stylesheets/safety.scss';
import '../assets/stylesheets/simulateur.scss';
import '../assets/stylesheets/visio-calendar.scss';
import '../assets/stylesheets/documentation.scss';

export const metadata = {
    title: 'Ewen Rodrigues de Oliveira - Étudiant en DLMI',
    description: 'Ewen Rodrigues de Oliveira. Étudiant en double licence Maths & Informatique, développeur à ses heures perdues.',
    keywords: ['Ewen Rodrigues', 'portfolio', 'développeur web', 'React', 'Node.js', 'Mathématiques', 'Informatique', 'Paris'],
    metadataBase: new URL('https://ewenrdo.fr'),
    alternates: { canonical: '/' },
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/images/favicon_192.png', sizes: '192x192', type: 'image/png' },
            { url: '/images/favicon_512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: '/images/favicon_192.png',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    },
    openGraph: {
        title: 'Ewen Rodrigues de Oliveira - Étudiant en DLMI',
        description: 'Portfolio d’Ewen Rodrigues de Oliveira. Développeur à ses heures perdues, étudiant en double licence Maths & Informatique.',
        url: 'https://ewenrdo.fr/',
        images: ['/images/photo.jpg'],
        locale: 'fr_FR',
        type: 'website',
        alternateLocale: ['fr_FR'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ewen Rodrigues de Oliveira - Étudiant en DLMI',
        description: 'Portfolio d’Ewen Rodrigues de Oliveira. Développeur à ses heures perdues, étudiant en double licence Maths & Informatique.',
        images: ['/images/photo.jpg'],
        creator: '@funoxpanda',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#ffffff',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ewen Rodrigues de Oliveira',
    url: 'https://ewenrdo.fr',
    image: 'https://ewenrdo.fr/images/photo.jpg',
    jobTitle: 'Étudiant',
    sameAs: ['https://www.linkedin.com/in/ewen-rodrigues-de-oliveira-500736267/'],
    email: 'contact@ewenrdo.fr',
    worksFor: {
        '@type': 'Organization',
        name: 'Université Paris Cité',
        url: 'https://u-pariscite.fr/',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://cdn.jsdelivr.net" />
                <link rel="dns-prefetch" href="https://ka-f.fontawesome.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400..800;1,400..800&family=Aleo:ital,wght@0,400..800;1,400..800&family=Great+Vibes&display=swap"
                    rel="stylesheet"
                />
                <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                {children}
                <Script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                <Script
                    src="https://kit.fontawesome.com/9effd4ff41.js"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
