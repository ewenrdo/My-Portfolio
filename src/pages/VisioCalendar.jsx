import React, { useEffect, useState } from 'react';
import DockNav from '../assets/components/DockNav';
import '../assets/stylesheets/visio-calendar.scss';

const CALENDAR_URL = 'https://calendar.proton.me/api/calendar/v1/url/FXVWefJdoofz1_T4f2tGmjhf3xsfUKKdSWWQFFqWnIeGkX0jIaF2vWtJAEUmGlEi_OhGVpHLdPZDuEvUmFsUsQ==/calendar.ics?CacheKey=AtEJSoUaVTrvzDS9hnYjiQ%3D%3D&PassphraseKey=toaVuEtBhDYsh5Q8Cen986X_SbAjEAez171FYXM6VU8%3D';

function unfoldIcsLines(ics) {
    return ics.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/);
}

function unescapeIcsValue(value = '') {
    return value
        .replace(/\\n/gi, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\')
        .trim();
}

function getPropertyValue(line) {
    const separatorIndex = line.indexOf(':');
    return separatorIndex === -1 ? '' : line.slice(separatorIndex + 1);
}

function parseIcsDate(value, isDateOnly) {
    if (!value) return null;

    if (isDateOnly) {
        const year = Number(value.slice(0, 4));
        const month = Number(value.slice(4, 6)) - 1;
        const day = Number(value.slice(6, 8));
        return new Date(year, month, day);
    }

    const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
    if (!match) return null;

    const [, year, month, day, hours, minutes, seconds] = match.map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return value.endsWith('Z') ? new Date(date.getTime() - date.getTimezoneOffset() * 60000) : date;
}

function extractVideoLink(description) {
    return description.match(/https?:\/\/[^\s<>"']+/i)?.[0]?.replace(/[),.;]+$/, '') || null;
}

function parseIcsEvents(ics) {
    const events = [];
    let currentEvent = null;

    unfoldIcsLines(ics).forEach((line) => {
        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
            return;
        }

        if (line === 'END:VEVENT') {
            if (currentEvent?.start) {
                const description = unescapeIcsValue(currentEvent.description);
                events.push({
                    id: currentEvent.uid || `${currentEvent.start}-${events.length}`,
                    title: unescapeIcsValue(currentEvent.summary) || 'Événement sans titre',
                    description,
                    start: currentEvent.start,
                    end: currentEvent.end,
                    videoLink: extractVideoLink(description),
                });
            }
            currentEvent = null;
            return;
        }

        if (!currentEvent) return;

        const [property] = line.split(':', 1);
        const propertyName = property.split(';', 1)[0];
        const value = getPropertyValue(line);
        if (propertyName === 'UID') currentEvent.uid = value;
        if (propertyName === 'SUMMARY') currentEvent.summary = value;
        if (propertyName === 'DESCRIPTION') currentEvent.description = value;
        if (propertyName === 'DTSTART') currentEvent.start = parseIcsDate(value, property.includes('VALUE=DATE'));
        if (propertyName === 'DTEND') currentEvent.end = parseIcsDate(value, property.includes('VALUE=DATE'));
    });

    return events.sort((first, second) => first.start - second.start);
}

function formatEventDate(date, end) {
    const dateOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    const formattedStart = date.toLocaleString('fr-FR', dateOptions);
    if (!end || date.toDateString() !== end.toDateString()) return formattedStart;
    return `${formattedStart} - ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}

function formatDay(date) {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function getDayKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function groupEventsByDay(events) {
    return events.reduce((groups, event) => {
        const key = getDayKey(event.start);
        const existingGroup = groups.find((group) => group.key === key);

        if (existingGroup) {
            existingGroup.events.push(event);
        } else {
            groups.push({ key, date: event.start, events: [event] });
        }

        return groups;
    }, []);
}

function EventCard({ event }) {
    return (
        <article className="visio-event-card">
            <div className="visio-event-icon" aria-hidden="true">
                <i className="fas fa-video" />
            </div>
            <div className="visio-event-content">
                <p className="visio-event-date">{formatEventDate(event.start, event.end)}</p>
                <h3>{event.title}</h3>
                {event.description && <p className="visio-event-description">{event.description}</p>}
                {event.videoLink ? (
                    <a className="visio-event-link" href={event.videoLink} target="_blank" rel="noreferrer">
                        <i className="fas fa-external-link-alt" aria-hidden="true" />
                        Rejoindre la visioconférence
                    </a>
                ) : (
                    <p className="visio-event-missing">
                        <i className="fas fa-clock" aria-hidden="true" />
                        Lien de visioconférence pas encore fourni
                    </p>
                )}
            </div>
        </article>
    );
}

export default function VisioCalendar() {
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const controller = new AbortController();

        fetch(CALENDAR_URL, { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error(`Le calendrier a répondu avec le statut ${response.status}.`);
                return response.text();
            })
            .then((ics) => {
                setEvents(parseIcsEvents(ics));
                setStatus('success');
            })
            .catch((fetchError) => {
                if (fetchError.name === 'AbortError') return;
                setError('Impossible de charger le calendrier pour le moment.');
                setStatus('error');
            });

        return () => controller.abort();
    }, []);

    const now = new Date();
    const upcomingEvents = events
        .filter((event) => (event.end || event.start) >= now)
        .sort((first, second) => first.start - second.start);
    const pastEvents = events
        .filter((event) => (event.end || event.start) < now)
        .sort((first, second) => second.start - first.start);
    const visibleEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;
    const eventGroups = groupEventsByDay(visibleEvents);

    return (
        <div className="visio-calendar-page">
            <main className="visio-calendar-shell">
                <section className="visio-calendar-copy">
                    <span className="visio-calendar-kicker">Calendrier synchronisé</span>
                    <h1>Événements de visioconférence</h1>
                    <p>Retrouvez ici les prochains événements. Le lien de visioconférence est affiché lorsqu’il est présent dans la description.</p>
                </section>

                {status === 'loading' && <p className="visio-calendar-state">Chargement des événements…</p>}
                {status === 'error' && <p className="visio-calendar-state is-error">{error}</p>}
                {status === 'success' && (
                    <>
                        <div className="visio-calendar-tabs" role="tablist" aria-label="Filtrer les événements">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'upcoming'}
                                className={activeTab === 'upcoming' ? 'is-active' : ''}
                                onClick={() => setActiveTab('upcoming')}
                            >
                                À venir <span>{upcomingEvents.length}</span>
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'past'}
                                className={activeTab === 'past' ? 'is-active' : ''}
                                onClick={() => setActiveTab('past')}
                            >
                                Passées <span>{pastEvents.length}</span>
                            </button>
                        </div>

                        {eventGroups.length === 0 ? (
                            <p className="visio-calendar-state">
                                {activeTab === 'upcoming' ? 'Aucun événement à venir.' : 'Aucun événement passé.'}
                            </p>
                        ) : (
                            <section className="visio-events" aria-label={`Événements ${activeTab === 'upcoming' ? 'à venir' : 'passés'}`}>
                                {eventGroups.map((group) => (
                                    <div className="visio-day-group" key={group.key}>
                                        <h2 className="visio-day-heading">{formatDay(group.date)}</h2>
                                        <div className="visio-day-events">
                                            {group.events.map((event) => <EventCard event={event} key={event.id} />)}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </>
                )}
            </main>
            <DockNav />
        </div>
    );
}
