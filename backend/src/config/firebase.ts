import * as admin from "firebase-admin";
import * as path from "path";

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require(path.join(__dirname, "../../key.json"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();

