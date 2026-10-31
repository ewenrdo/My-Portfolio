import React, { useEffect, useState } from 'react';
import DockNav from '../assets/components/DockNav';
import '../assets/stylesheets/visio-calendar.scss';

const CALENDAR_URL = '/api/calendar';
const VISIO_EVENT_COLOR = '#8a1538';

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
    if (!description) return null;
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
                events.push(enrichEvent({
                    id: currentEvent.uid || `${currentEvent.start}-${events.length}`,
                    title: unescapeIcsValue(currentEvent.summary) || 'Événement sans titre',
                    description,
                    start: currentEvent.start,
                    end: currentEvent.end,
                    location: unescapeIcsValue(currentEvent.location),
                }));
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
        if (propertyName === 'LOCATION') currentEvent.location = value;
        if (propertyName === 'DTSTART') currentEvent.start = parseIcsDate(value, property.includes('VALUE=DATE'));
        if (propertyName === 'DTEND') currentEvent.end = parseIcsDate(value, property.includes('VALUE=DATE'));
    });

    return events.sort((first, second) => first.start - second.start);
}

function enrichEvent(event) {
    const titleContainsVisio = event.title.toLowerCase().includes('visio');
    const isDisabled = event.title.includes('⌛');
    const videoLink = event.location || (!titleContainsVisio ? extractVideoLink(event.description) : null);

    return {
        ...event,
        isDisabled,
        titleContainsVisio,
        videoLink,
        color: isDisabled ? '#888888' : (event.location || titleContainsVisio ? VISIO_EVENT_COLOR : '#3f51b5'),
    };
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

function getMonday(date) {
    const monday = new Date(date);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
}

function getCalendarDays(weekStart) {
    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return date;
    });
}

function formatCalendarDay(date) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }).replace('.', '');
}

function formatCalendarTime(date) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatCalendarTimeRange(event) {
    const start = formatCalendarTime(event.start);
    if (!event.end) return start;
    return `${start} - ${formatCalendarTime(event.end)}`;
}

function CalendarView({ events, weekStart, onPreviousWeek, onNextWeek, onCurrentWeek, onSelectEvent }) {
    const days = getCalendarDays(weekStart);
    const dayStartHour = 8;
    const dayEndHour = 18;
    const hours = Array.from({ length: dayEndHour - dayStartHour + 1 }, (_, index) => dayStartHour + index);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const eventsInWeek = events.filter((event) => event.start <= weekEnd && (event.end || event.start) >= weekStart);

    return (
        <section className="visio-calendar-view" aria-label="Calendrier de la semaine">
            <div className="visio-calendar-navigation">
                <button type="button" onClick={onPreviousWeek} aria-label="Semaine précédente">
                    <i className="fas fa-chevron-left" aria-hidden="true" />
                </button>
                <h2>
                    {weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    {' - '}
                    {weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h2>
                <button type="button" onClick={onNextWeek} aria-label="Semaine suivante">
                    <i className="fas fa-chevron-right" aria-hidden="true" />
                </button>
                <button className="visio-calendar-today" type="button" onClick={onCurrentWeek}>Aujourd'hui</button>
            </div>

            <div className="visio-calendar-grid">
                <div className="visio-calendar-corner" />
                {days.map((day) => (
                    <div className="visio-calendar-day-label" key={getDayKey(day)}>
                        {formatCalendarDay(day)}
                    </div>
                ))}

                <div className="visio-calendar-times">
                    {hours.map((hour) => <span key={hour}>{`${String(hour).padStart(2, '0')}h`}</span>)}
                </div>
                {days.map((day) => {
                    const dayKey = getDayKey(day);
                    const dayEvents = eventsInWeek.filter((event) => getDayKey(event.start) === dayKey);

                    return (
                        <div className="visio-calendar-column" key={dayKey}>
                            {hours.map((hour) => <div className="visio-calendar-hour" key={hour} />)}
                            {dayEvents.map((event) => {
                                const startMinutes = Math.max(
                                    dayStartHour * 60,
                                    event.start.getHours() * 60 + event.start.getMinutes(),
                                );
                                const end = event.end || new Date(event.start.getTime() + 60 * 60 * 1000);
                                const endMinutes = Math.min(
                                    dayEndHour * 60,
                                    Math.max(startMinutes + 30, end.getHours() * 60 + end.getMinutes()),
                                );

                                return (
                                    <button
                                        className={`visio-calendar-event${event.isDisabled ? ' is-disabled' : ''}`}
                                        type="button"
                                        onClick={() => onSelectEvent(event)}
                                        key={event.id}
                                        style={{
                                            top: `${((startMinutes - dayStartHour * 60) / 60) * 10}%`,
                                            height: `${((endMinutes - startMinutes) / 60) * 10}%`,
                                            '--visio-event-color': event.color,
                                        }}
                                        title={`${event.title} — ${formatCalendarTimeRange(event)}`}
                                    >
                                        <strong>{event.title}</strong>
                                        <span>{formatCalendarTimeRange(event)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function EventDetails({ event }) {
    return (
        <>
            <p className="visio-event-date" style={{ color: event.color }}>{formatEventDate(event.start, event.end)}</p>
            <h3>{event.title}</h3>
            {event.description && <p className="visio-event-description">{event.description}</p>}
            {event.videoLink ? (
                <a className="visio-event-link" href={event.videoLink} target="_blank" rel="noreferrer" style={{ color: event.color }}>
                    <i className="fas fa-external-link-alt" aria-hidden="true" />
                    Rejoindre la visioconférence
                </a>
            ) : (
                <p className="visio-event-missing">
                    <i className="fas fa-clock" aria-hidden="true" />
                    Lien de visioconférence pas encore fourni
                </p>
            )}
        </>
    );
}

function EventCard({ event }) {
    return (
        <article className={`visio-event-card${event.isDisabled ? ' is-disabled' : ''}`} style={{ '--visio-event-color': event.color }}>
            <div className="visio-event-icon" aria-hidden="true">
                <i className="fas fa-video" />
            </div>
            <div className="visio-event-content">
                <EventDetails event={event} />
            </div>
        </article>
    );
}

function EventModal({ event, onClose }) {
    useEffect(() => {
        const handleKeyDown = (keyboardEvent) => {
            if (keyboardEvent.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="visio-event-modal-backdrop" role="presentation" onMouseDown={(mouseEvent) => {
            if (mouseEvent.target === mouseEvent.currentTarget) onClose();
        }}>
            <section className={`visio-event-modal${event.isDisabled ? ' is-disabled' : ''}`} role="dialog" aria-modal="true" aria-labelledby="visio-event-modal-title">
                <button className="visio-event-modal-close" type="button" onClick={onClose} aria-label="Fermer">
                    <i className="fas fa-times" aria-hidden="true" />
                </button>
                <div className="visio-event-icon" aria-hidden="true">
                    <i className="fas fa-video" />
                </div>
                <div className="visio-event-content">
                    <div id="visio-event-modal-title">
                        <EventDetails event={event} />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function VisioCalendar() {
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [activeView, setActiveView] = useState('calendar');
    const [activeTab, setActiveTab] = useState('upcoming');
    const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
    const [selectedEvent, setSelectedEvent] = useState(null);

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
                    <span className="visio-calendar-kicker">Double licence Mathématiques Informatique</span>
                    <h1>Calendrier de distanciel</h1>
                    <p>
                        Retrouvez ici les prochains événements et liens de visioconférence, ainsi que le travail à préparer pour chaque séance.
                    </p>
                </section>

                {status === 'loading' && <p className="visio-calendar-state">Chargement des événements…</p>}
                {status === 'error' && <p className="visio-calendar-state is-error">{error}</p>}
                {status === 'success' && (
                    <>
                        <div className="visio-calendar-tabs" role="tablist" aria-label="Choisir la vue">
                            <button type="button" role="tab" aria-selected={activeView === 'calendar'} className={activeView === 'calendar' ? 'is-active' : ''} onClick={() => setActiveView('calendar')}>
                                Calendrier
                            </button>
                            <button type="button" role="tab" aria-selected={activeView === 'list'} className={activeView === 'list' ? 'is-active' : ''} onClick={() => setActiveView('list')}>
                                Liste
                            </button>
                        </div>

                        {activeView === 'calendar' ? (
                            <CalendarView
                                events={events}
                                weekStart={weekStart}
                                onPreviousWeek={() => setWeekStart((date) => {
                                    const previous = new Date(date);
                                    previous.setDate(previous.getDate() - 7);
                                    return previous;
                                })}
                                onNextWeek={() => setWeekStart((date) => {
                                    const next = new Date(date);
                                    next.setDate(next.getDate() + 7);
                                    return next;
                                })}
                                onCurrentWeek={() => setWeekStart(getMonday(new Date()))}
                                onSelectEvent={setSelectedEvent}
                            />
                        ) : (
                            <>
                                <div className="visio-calendar-tabs visio-calendar-list-tabs" role="tablist" aria-label="Filtrer les événements">
                                    <button type="button" role="tab" aria-selected={activeTab === 'upcoming'} className={activeTab === 'upcoming' ? 'is-active' : ''} onClick={() => setActiveTab('upcoming')}>
                                        À venir <span>{upcomingEvents.length}</span>
                                    </button>
                                    <button type="button" role="tab" aria-selected={activeTab === 'past'} className={activeTab === 'past' ? 'is-active' : ''} onClick={() => setActiveTab('past')}>
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
                    </>
                )}
            </main>
            <DockNav />
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </div>
    );
}
