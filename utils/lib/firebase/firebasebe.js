const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_ADMIN_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();
