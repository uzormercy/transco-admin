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
