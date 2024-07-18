import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
const firebaseAct = process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY;
const serviceAccount = JSON.parse(firebaseAct as string);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const admin_database = getFirestore();

export { admin_database };
