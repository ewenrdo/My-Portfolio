const TARGET_DATE = '2026-12-10';
const TARGET_TIME = '12:45:00';
const TARGET_ISO = `${TARGET_DATE}T${TARGET_TIME}+01:00`;
const TARGET_TIMESTAMP = new Date(TARGET_ISO).getTime();

const getCountdown = (now = Date.now()) => {
    const totalSeconds = Math.max(0, Math.floor((TARGET_TIMESTAMP - now) / 1000));

    return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        totalSeconds,
    };
};

export async function GET() {
    const countdown = getCountdown();

    return Response.json({
        timestamp: TARGET_TIMESTAMP,
        targetTimestamp: TARGET_TIMESTAMP,
        unixTimestamp: Math.floor(TARGET_TIMESTAMP / 1000),
        isoTimestamp: TARGET_ISO,
        date: TARGET_DATE,
        time: TARGET_TIME,
        ...countdown,
        countdown,
    }, {
        headers: {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
    });
}
