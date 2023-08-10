// backend/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'learnt-me-test.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();


module.exports = { db, bucket };
