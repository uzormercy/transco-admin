import { admin_database as db } from "@/config/firebase-admin";
import { TCollections } from "@/app/language/create/page";

export const getLanguages = async () => {
  const collections: TCollections[] = [];
  const querySnapshot = db.collection("languages");
  const data = await querySnapshot.get();
  data.forEach((doc: any) => {
    collections.push(doc.data());
  });
  return collections;
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDGf18vN59kQKxqVSknYXS2vepizNa9Llg",
//   authDomain: "langpro-d2453.firebaseapp.com",
//   projectId: "langpro-d2453",
//   storageBucket: "langpro-d2453.appspot.com",
//   messagingSenderId: "829791214713",
//   appId: "1:829791214713:web:6d1191df6698006fc848a8",
//   measurementId: "G-2QH3W4YYLY"
// };
