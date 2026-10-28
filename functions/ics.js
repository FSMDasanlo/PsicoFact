// Generación del calendario .ics (sin datos clínicos: solo cita, paciente y centro)
const TZ = 'Europe/Madrid';

function escapar(texto) {
    return String(texto || '')
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\r?\n/g, '\\n');
}

// Pliega líneas a 75 octetos como exige RFC 5545
function plegar(linea) {
    const bytes = Buffer.from(linea, 'utf8');
    if (bytes.length <= 75) return linea;
    const partes = [];
    let inicio = 0;
    let limite = 75;
    while (inicio < bytes.length) {
        let fin = Math.min(inicio + limite, bytes.length);
        while (fin < bytes.length && (bytes[fin] & 0xc0) === 0x80) fin--;
        partes.push(bytes.slice(inicio, fin).toString('utf8'));
        inicio = fin;
        limite = 74;
    }
    return partes.join('\r\n ');
}

function fechaLocal(fecha, hora, sumarMin = 0) {
    const [y, mo, d] = fecha.split('-').map(Number);
    const [h, mi] = hora.split(':').map(Number);
    const t = new Date(Date.UTC(y, mo - 1, d, h, mi + sumarMin));
    const p = (n) => String(n).padStart(2, '0');
    return `${t.getUTCFullYear()}${p(t.getUTCMonth() + 1)}${p(t.getUTCDate())}T${p(t.getUTCHours())}${p(t.getUTCMinutes())}00`;
}

const VTIMEZONE = [
    'BEGIN:VTIMEZONE',
    `TZID:${TZ}`,
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE'
];

function construirIcs(citas, ahora = new Date()) {
    const p = (n) => String(n).padStart(2, '0');
    const stamp = `${ahora.getUTCFullYear()}${p(ahora.getUTCMonth() + 1)}${p(ahora.getUTCDate())}T${p(ahora.getUTCHours())}${p(ahora.getUTCMinutes())}${p(ahora.getUTCSeconds())}Z`;

    const lineas = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//PsicoFact//Agenda//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:PsicoFact',
        `X-WR-TIMEZONE:${TZ}`,
        'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
        'X-PUBLISHED-TTL:PT1H',
        ...VTIMEZONE
    ];

    for (const c of citas) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(c.fecha || '') || !/^\d{1,2}:\d{2}$/.test(c.hora || '')) continue;
        const duracion = Math.max(15, parseInt(c.duracion, 10) || 60);
        const lugar = c.centro || c.clinica || '';
        const paciente = String(c.paciente || '').trim() || 'Cita';
        const resumen = lugar ? `${paciente} - ${lugar}` : paciente;
        lineas.push(
            'BEGIN:VEVENT',
            `UID:${c.id}@psicofact`,
            `DTSTAMP:${stamp}`,
            `DTSTART;TZID=${TZ}:${fechaLocal(c.fecha, c.hora)}`,
            `DTEND;TZID=${TZ}:${fechaLocal(c.fecha, c.hora, duracion)}`,
            `SUMMARY:${escapar(resumen)}`
        );
        if (lugar) lineas.push(`LOCATION:${escapar(lugar)}`);
        lineas.push('STATUS:CONFIRMED', 'TRANSP:OPAQUE', 'END:VEVENT');
    }

    lineas.push('END:VCALENDAR');
    return lineas.map(plegar).join('\r\n') + '\r\n';
}

module.exports = { construirIcs };
