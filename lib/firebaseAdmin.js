import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "the-easy-q.firebasestorage.app"
  });
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
