import { NextResponse } from "next/server";
import { admin_database as db } from "@/config/firebase-admin";
import { TCollections } from "@/app/language/create/page";

const getLanguages = async () => {
  const collections: TCollections[] = [];
  const querySnapshot = db.collection("languages");
  const data = await querySnapshot.get();
  data.forEach((doc: any) => {
    collections.push(doc.data());
  });
  return collections;
};

export async function GET() {
  const languages = await getLanguages();
  return NextResponse.json({
    message: "Languages retrieved successfully",
    data: languages,
  });
}
