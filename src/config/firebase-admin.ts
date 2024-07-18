import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Replace with the path to your service account key file
const serviceAccount = require("../../transco.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const admin_database = getFirestore();

export { admin_database };
