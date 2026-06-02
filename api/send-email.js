import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Chargement des variables d'environnement en local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Cache en mémoire pour stocker temporairement les IPs (valable tant que l'instance Serverless est active)
const ipCache = new Map();
const COOLDOWN_MS = 60 * 1000; // 60 secondes entre chaque envoi

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    // --- DETECTION DE L'IP DE L'UTILISATEUR (Géré par Vercel) ---
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    // --- VÉRIFICATION DU COOLDOWN (CACHE SERVEUR) ---
    if (ipCache.has(userIp)) {
        const lastSendTime = ipCache.get(userIp);
        const timeElapsed = now - lastSendTime;

        if (timeElapsed < COOLDOWN_MS) {
            const timeLeft = Math.ceil((COOLDOWN_MS - timeElapsed) / 1000);
            return res.status(429).json({
                error: `Trop de requêtes. Veuillez patienter ${timeLeft} secondes avant de renvoyer un message.`
            });
        }
    }

    // --- VÉRIFICATION DU COOLDOWN (SÉCURITÉ COOKIE SI LE SERVEUR REBOOT) ---
    // Si l'instance Vercel redémarre, le `ipCache` se vide. On utilise un cookie pour doubler la sécurité.
    const cookies = req.headers.cookie || '';
    if (cookies.includes('feedback_cooldown=')) {
        const match = cookies.match(/feedback_cooldown=(\d+)/);
        if (match) {
            const lastCookieTime = parseInt(match[1], 10);
            if (now - lastCookieTime < COOLDOWN_MS) {
                const timeLeft = Math.ceil((COOLDOWN_MS - (now - lastCookieTime)) / 1000);
                return res.status(429).json({
                    error: `Veuillez patienter ${timeLeft} secondes.`
                });
            }
        }
    }

    try {
        const data = req.body;

        // Configuration de Nodemailer (Port 587 pour STARTTLS Proton Mail)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.protonmail.ch',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Construction de l'e-mail (Exemple pour le feedback)
        let emailSubject = '📬 Nouvelle soumission';
        let emailHtml = `<p>Nouveau message reçu.</p>`;

        if (data.type === 'feedback') {
            emailSubject = `💬 Nouveau retour sur : ${data.resourceTitle}`;
            emailHtml = `
                <div style="font-family: sans-serif; line-height: 1.5; color: #111;">
                    <h2>Retour utilisateur sur un document</h2>
                    <p><strong>Auteur :</strong> ${data.firstname} ${data.lastname}</p>
                    <p><strong>Ressource :</strong> ${data.resourceTitle} (<i>Slug: ${data.resourceSlug}</i>)</p>
                    <p><strong>Commentaire :</strong></p>
                    <blockquote style="background: #f5f5f5; padding: 1rem; border-left: 4px solid #111; margin: 0; font-style: italic;">
                        ${data.comment.replace(/\n/g, '<br>')}
                    </blockquote>
                </div>
            `;
        } else if (data.type === 'suggestion') {

            const { firstname, lastname, contact, resourceLink, consent } = data;

            emailSubject = `📥 Nouvelle ressource proposée par ${firstname} ${lastname}`;
            emailHtml = `
            <div style="font-family: sans-serif; line-height: 1.5; color: #111;">
                <h2>Nouvelle proposition de document</h2>
                <p><strong>Nom complet :</strong> ${firstname} ${lastname}</p>
                <p><strong>Moyen de contact :</strong> ${contact}</p>
                <p><strong>Lien vers la ressource :</strong> <a href="${resourceLink}">${resourceLink}</a></p>
                <p><strong>Consentement de publication :</strong> ${consent ? '✅ Oui, accepte la publication' : '❌ Non'}</p>
            </div>
        `;
        }

        // Envoi effectif
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: emailSubject,
            html: emailHtml,
        });

        // --- ENREGISTREMENT DU COOLDOWN EN CAS DE REUSSITE ---
        ipCache.set(userIp, now);

        // On renvoie un cookie HTTP au navigateur pour verrouiller l'accès pendant 60s
        res.setHeader('Set-Cookie', `feedback_cooldown=${now}; Max-Age=${COOLDOWN_MS / 1000}; Path=/; HttpOnly; SameSite=Strict`);

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Erreur d'envoi de l'e-mail:", error);
        return res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
    }
}