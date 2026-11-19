import 'katex/dist/katex.min.css';
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

export const metadata = {
    title: 'Ewen Rodrigues de Oliveira - Étudiant en DLMI',
    description: 'Portfolio d’Ewen Rodrigues de Oliveira, étudiant en double licence Maths & Informatique.',
    keywords: ['Ewen Rodrigues', 'portfolio', 'développeur web', 'mathématiques', 'informatique'],
    metadataBase: new URL('https://ewenrdo.fr'),
    alternates: { canonical: '/' },
    openGraph: {
        title: 'Ewen Rodrigues de Oliveira - Étudiant en DLMI',
        description: 'Portfolio d’Ewen Rodrigues de Oliveira, développeur à ses heures perdues.',
        url: 'https://ewenrdo.fr/',
        images: ['/images/photo.jpg'],
        locale: 'fr_FR',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
}
