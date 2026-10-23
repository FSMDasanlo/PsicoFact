const { onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const crypto = require('crypto');
const { construirIcs } = require('./ics');

initializeApp();
const db = getFirestore();

const hash = (s) => crypto.createHash('sha256').update(String(s)).digest();
const iso = (d) => d.toISOString().split('T')[0];

// URL: /calendario?u=<uid>&t=<token>. Cualquier fallo responde 404 para no dar pistas.
exports.calendario = onRequest({ region: 'europe-west1', maxInstances: 5, cors: false }, async (req, res) => {
    const uid = String(req.query.u || '');
    const token = String(req.query.t || '');
    if (!/^[A-Za-z0-9]{10,64}$/.test(uid) || !/^[a-f0-9]{48,128}$/.test(token)) {
        res.status(404).send('No encontrado');
        return;
    }

    try {
        const tokenSnap = await db.doc(`usuarios/${uid}/facultativo/calendario`).get();
        const guardado = tokenSnap.exists ? tokenSnap.data().token : null;
        if (!guardado || !crypto.timingSafeEqual(hash(guardado), hash(token))) {
            res.status(404).send('No encontrado');
            return;
        }

        const hoy = new Date();
        const desde = new Date(hoy.getTime() - 60 * 86400000);
        const hasta = new Date(hoy.getTime() + 400 * 86400000);
        const snap = await db.collection(`usuarios/${uid}/citas`)
            .where('fecha', '>=', iso(desde))
            .where('fecha', '<=', iso(hasta))
            .limit(5000)
            .get();

        const citas = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(c => c.estado !== 'cancelled');

        res.set('Content-Type', 'text/calendar; charset=utf-8');
        res.set('Content-Disposition', 'inline; filename="psicofact.ics"');
        res.set('Cache-Control', 'private, max-age=300');
        res.status(200).send(construirIcs(citas));
    } catch (e) {
        console.error('Error generando calendario', e);
        res.status(500).send('Error');
    }
});
