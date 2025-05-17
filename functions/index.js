const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/* ---- Chat de prueba ------------------------------------------------- */
exports.chat = functions.https.onRequest((req, res) => {
  const text = req.query.query || '';
  res.status(200).send(`Hola, funciona: ${text}`);
});

/* ---- Helper: crea un job en Firestore ------------------------------- */
function addJob(data) {
  return db.collection('jobs').add({
    ...data,
    status: 'queued',
    createdAt: Date.now()
  });
}

/* ---- Endpoints HTTP para ingesta ------------------------------------ */
exports.ingestSingle = functions.https.onRequest(async (req, res) => {
  const { url } = req.body;
  const doc = await addJob({ type: 'single', url });
  res.json({ ok: true, jobId: doc.id });
});

exports.ingestChannel = functions.https.onRequest(async (req, res) => {
  const { url, limit } = req.body;
  const doc = await addJob({
    type: 'channel',
    url,
    limit: Number(limit || 10)
  });
  res.json({ ok: true, jobId: doc.id });
});

exports.ingestPlaylist = functions.https.onRequest(async (req, res) => {
  const { url } = req.body;
  const doc = await addJob({ type: 'playlist', url });
  res.json({ ok: true, jobId: doc.id });
});

/* ---- Worker esqueleto: marca el job como done ----------------------- */
exports.worker = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snap /*, ctx */) => {
    // Aquí luego pondremos descarga y transcripción
    await snap.ref.update({ status: 'done' });
  });