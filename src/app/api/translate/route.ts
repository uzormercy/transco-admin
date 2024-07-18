import { NextResponse } from "next/server";

import { admin_database as db } from "@/config/firebase-admin";
import { TCollections } from "@/app/language/create/page";
import { getLanguages } from "@/services";

type TEnglish = {
  id: string;
  word: string;
  meaning?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Get the language to translate from and the language to translate to  by id,  from the language table
const getLanguageById = async (id: string): Promise<TCollections | null> => {
  const languages = await getLanguages();
  const language = languages.find((language) => language.id === id);
  return language || null;
};

// Get the word to translate from the english table
const getEnglishWord = async (word: string): Promise<TEnglish[]> => {
  const words = await db.collection("english").where("word", "==", word).get();
  return words.docs.map((doc) => doc.data() as TEnglish);
};

// Get the word to translate from the english table by id
const getEnglishById = async (id: string): Promise<TEnglish[]> => {
  const words = await db.collection("english").where("id", "==", id).get();
  return words.docs.map((doc) => doc.data() as TEnglish);
};

// Get the translated word from the translated table
const getTranslatedWord = async (englishId: string, collection: string) => {
  const words = await db
    .collection(collection)
    .where("englishId", "==", englishId)
    .get();
  return words.docs.map((doc) => doc.data());
};

// Get the english id from the translated table
const getEnglishIdFromTranslatedWord = async (
  word: string,
  collection: string
) => {
  const words = await db.collection(collection).where("word", "==", word).get();
  return words.docs.map((doc) => doc.data());
};

export async function POST(request: Request) {
  let { from, to, word } = await request.json();
  let englishWord: TEnglish[] = [];
  if (!from || !to || !word) {
    return NextResponse.json({
      message: "All fields are required",
      data: null,
    });
  }
  word = word.toLowerCase();
  // Get the language to translate from and the language to translate to  by id,  from the language table
  const languageFrom: TCollections | null = await getLanguageById(from);
  const languageTo: TCollections | null = await getLanguageById(to);

  // If the language to translate from not found, return a message
  if (!languageFrom) {
    return NextResponse.json({
      message: "Language to translate from not found",
      data: null,
    });
  }
  // If the language to translate from is english, get the word from the english table
  if (languageFrom.name === "english") {
    englishWord = await getEnglishWord(word);
  } else {
    // If the language to translate from is not english, get the word from the translated table
    const translatedWord = await getEnglishIdFromTranslatedWord(
      word,
      languageFrom.name
    );
    // If the word to translate from not found, return a message
    if (!translatedWord) {
      return NextResponse.json({
        message: "Word to translate from not found",
        data: null,
      });
    }
    englishWord = await getEnglishById(translatedWord[0].englishId);
  }

  // If the language to translate to not found, return a message
  if (!languageTo) {
    return NextResponse.json({
      message: "Language to translate to not found",
      data: null,
    });
  }

  // Get the translated word from the translated table
  const translatedWord = await getTranslatedWord(
    englishWord[0].id,
    languageTo.name
  );

  // Return the translated word
  return NextResponse.json({
    message: "Translation retrieved successfully",
    data: translatedWord,
  });
}
