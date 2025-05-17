const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Basic echo chat
exports.chat = functions.https.onRequest((req, res) => {
  res.send(req.query.query || '');
});

// Crea job en Firestore
function addJob(data) {
  return db.collection('jobs').add({ ...data, status: 'queued', createdAt: Date.now() });
}

exports.ingestSingle = functions.https.onRequest(async (req, res) => {
  const doc = await addJob({ type: 'single', url: req.body.url });
  res.json({ ok: true, jobId: doc.id });
});

exports.ingestChannel = functions.https.onRequest(async (req, res) => {
  const doc = await addJob({
    type: 'channel',
    url: req.body.url,
    limit: Number(req.body.limit || 10),
  });
  res.json({ ok: true, jobId: doc.id });
});

exports.ingestPlaylist = functions.https.onRequest(async (req, res) => {
  const doc = await addJob({ type: 'playlist', url: req.body.url });
  res.json({ ok: true, jobId: doc.id });
});

exports.worker = functions.firestore.document('jobs/{jobId}').onCreate(async (snap, ctx) => {
  // Aquí luego pondremos descarga y transcripción
  await snap.ref.update({ status: 'done' });
});
