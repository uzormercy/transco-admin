"use client";
import { database } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function CreateEnglish() {
  const [englishWord, setEnglishWord] = useState<string>("");
  const [englishMeaning, setEnglishMeaning] = useState<string>("");
  const [toast, setToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (englishWord === "") {
      setToast(true);
      setToastMessage("Please enter a word");
      setTimeout(() => {
        setToast(false);
        setToastMessage("");
      }, 2000);
      return;
    }
    setIsLoading(true);
    try {
      const word = englishWord.toLowerCase();
      const meaning = englishMeaning;
      const date = new Date().toISOString();
      const id = uuid();
      const attributeToCreate = {
        id,
        word,
        meaning,
        createdAt: date,
        updatedAt: date,
      };
      await setDoc(doc(database, "english", id), attributeToCreate);
      setToast(true);
      setToastMessage("English word added successfully");
      setEnglishMeaning("");
      setEnglishWord("");
      setIsLoading(false);
      setTimeout(() => {
        setToast(false);
        setToastMessage("");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-5">
      <h1 className="font-bold text-2xl">Create English</h1>
      <div className="mt-10">
        {toast && (
          <p className=" p-1 bg-green-200 text-green-700 w-[400px]  rounded">
            {toastMessage}
          </p>
        )}
      </div>
      <div className="w-[400px] mt-4 border p-5">
        <div className="">
          <label htmlFor="word" className="text-[15px] font-semibold">
            Word
          </label>
          <input
            className="w-full px-3 py-1 border"
            value={englishWord}
            required
            onChange={(e) => setEnglishWord(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <label htmlFor="meaning" className="text-[15px] font-semibold">
            Meaning
          </label>
          <textarea
            className="w-full border"
            required
            value={englishMeaning}
            onChange={(e) => setEnglishMeaning(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className={`py-[10px] px-[30px] border ${
              isLoading
                ? "bg-gray-500 cursor-wait"
                : "border-blue-800 bg-blue-800 cursor-pointer"
            } text-white rounded`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Create
          </button>
        </div>
      </div>
    </section>
  );
}
