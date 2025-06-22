const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json'); // rename yours

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "hxa-shopping.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;
