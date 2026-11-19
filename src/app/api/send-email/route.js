import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const ipCache = new Map();
const COOLDOWN_MS = 60 * 1000;

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function POST(request) {
    const userIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || '127.0.0.1';
    const now = Date.now();
    const lastSendTime = ipCache.get(userIp);
    const cookieMatch = request.headers.get('cookie')?.match(/(?:^|;\s*)feedback_cooldown=(\d+)/);
    const lastCookieTime = cookieMatch ? Number(cookieMatch[1]) : 0;
    const lastRequestTime = Math.max(lastSendTime || 0, lastCookieTime);

    if (now - lastRequestTime < COOLDOWN_MS) {
        const timeLeft = Math.ceil((COOLDOWN_MS - (now - lastRequestTime)) / 1000);
        return NextResponse.json(
            { error: `Veuillez patienter ${timeLeft} secondes.` },
            { status: 429 },
        );
    }

    try {
        const data = await request.json();
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.protonmail.ch',
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        let emailSubject = '📬 Nouvelle soumission';
        let emailHtml = '<p>Nouveau message reçu.</p>';

        if (data.type === 'feedback') {
            const comment = escapeHtml(data.comment).replace(/\n/g, '<br>');
            emailSubject = `💬 Nouveau retour sur : ${escapeHtml(data.resourceTitle)}`;
            emailHtml = `<p><strong>Auteur :</strong> ${escapeHtml(data.firstname)} ${escapeHtml(data.lastname)}</p>
                <p><strong>Ressource :</strong> ${escapeHtml(data.resourceTitle)} (${escapeHtml(data.resourceSlug)})</p>
                <blockquote>${comment}</blockquote>`;
        } else if (data.type === 'suggestion') {
            const resourceLink = escapeHtml(data.resourceLink);
            emailSubject = `📥 Nouvelle ressource proposée par ${escapeHtml(data.firstname)} ${escapeHtml(data.lastname)}`;
            emailHtml = `<p><strong>Nom complet :</strong> ${escapeHtml(data.firstname)} ${escapeHtml(data.lastname)}</p>
                <p><strong>Moyen de contact :</strong> ${escapeHtml(data.contact)}</p>
                <p><strong>Lien :</strong> <a href="${resourceLink}">${resourceLink}</a></p>
                <p><strong>Consentement :</strong> ${data.consent ? 'Oui' : 'Non'}</p>`;
        }

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: emailSubject,
            html: emailHtml,
        });

        ipCache.set(userIp, now);
        const response = NextResponse.json({ success: true });
        response.cookies.set('feedback_cooldown', String(now), {
            maxAge: COOLDOWN_MS / 1000,
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });
        return response;
    } catch (error) {
        console.error("Erreur d'envoi de l'e-mail:", error);
        return NextResponse.json({ error: "Erreur lors de l'envoi de l'e-mail." }, { status: 500 });
    }
}
