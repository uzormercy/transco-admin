"use client";
import { database } from "@/config/firebase";
import "react-toastify/dist/ReactToastify.css";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

export type TCollections = {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function CreateLanguage() {
  // const [toast, setToast] = useState<boolean>(false);
  // const [toastMessage, setToastMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newLanguage, setNewLanguage] = useState<string>("");
  const [collections, setCollections] = useState<TCollections[]>([]);
  const [english, setEnglish] = useState<any[]>([]);
  const [word, setWord] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");
  const [otherMeaning, setOtherMeaning] = useState<string>("");
  const [idioms, setIdioms] = useState<string>("");
  const [selectedEnglishWord, setSelectedEnglishWord] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null);

  const englishOptions = english.map((item) => ({
    value: item.id,
    label: item.word,
  }));

  const languageOptions = collections.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const handleNewLanguageSubmit = async () => {
    if (newLanguage === "") {
      toast("Please enter new language", { type: "warning" });
      return;
    }
    setIsLoading(true);
    try {
      const id = uuid();
      const languageId = uuid();
      const lang = newLanguage.toLowerCase();
      const date = new Date().toISOString();
      // TODO: Create a word along side,
      await setDoc(doc(database, lang, id), { id });
      toast(`${lang} language added successfully`, { type: "success" });
      setNewLanguage("");
      setIsLoading(false);
      //TODO: Delete the document created
      await setDoc(doc(database, "languages", languageId), {
        id: languageId,
        name: lang,
        createdAt: date,
        updatedAt: date,
      });
      fetchCollections();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getSavedCollections = async () => {
    const collections: TCollections[] = [];
    const querySnapshot = await getDocs(collection(database, "languages"));
    querySnapshot.forEach((doc: any) => {
      collections.push(doc.data());
    });
    return collections;
  };

  const memoizedGetSavedCollections = useMemo(() => getSavedCollections, []);

  const fetchCollections = async () => {
    const result = await memoizedGetSavedCollections();
    setCollections(result);
  };

  const getEnglishWords = async () => {
    const englishWords: any[] = [];
    const querySnapshot = await getDocs(collection(database, "english"));
    querySnapshot.forEach((doc: any) => {
      englishWords.push(doc.data());
    });
    return englishWords;
  };

  const memoizedGetSavedEnglishWords = useMemo(() => getEnglishWords, []);

  const fetchEnglishWords = async () => {
    const result = await memoizedGetSavedEnglishWords();
    setEnglish(result);
  };

  useEffect(() => {
    fetchCollections();
    fetchEnglishWords();
  }, [memoizedGetSavedCollections]);

  const handleIsLanguageSelected = (selectedOption: any) => {
    setIsLanguageSelected(true);
    setSelectedLanguage(selectedOption);
  };

  const handleEnglishWordSelect = (selectedOption: any) => {
    setSelectedEnglishWord(selectedOption);
  };

  const handleCreateTranslation = async () => {
    if (
      (selectedEnglishWord && word) == null ||
      (selectedEnglishWord && word) == "" ||
      selectedLanguage == null
    ) {
      toast("Please select an English word and a word to translate", {
        type: "warning",
      });
      return;
    }

    const idiomsArray = idioms.split(" , ");
    const dataToSave = {
      id: uuid(),
      word: word.trim().toLowerCase(),
      meaning: meaning.trim().toLowerCase(),
      otherMeaning: otherMeaning.trim().toLowerCase(),
      idioms: idiomsArray,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      englishId: selectedEnglishWord.value,
    };
    setIsLoading(true);
    try {
      await setDoc(
        doc(database, selectedLanguage.value, dataToSave.id),
        dataToSave
      );
      toast("Translation created successfully", { type: "success" });

      // Clear all input fields and dropdown selections
      setWord("");
      setMeaning("");
      setOtherMeaning("");
      setIdioms("");
      setSelectedEnglishWord(null);
      setSelectedLanguage(null);
      setIsLanguageSelected(false); // Reset language selection if desired

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast("Error creating translation", { type: "error" });
    }
  };

  return (
    <section className="p-5">
      <ToastContainer position="top-right" />
      <h1 className="font-bold text-2xl">Create Translation</h1>

      <div className="w-[400px] mt-10 mb-5 border p-5">
        <div className="">
          <label htmlFor="word" className="text-[15px] font-semibold">
            Select Language
          </label>
          <Select
            options={languageOptions}
            onChange={handleIsLanguageSelected}
          />
        </div>
      </div>
      {!isLanguageSelected && (
        <div className="w-[400px] mt-10 mb-5 border p-5">
          <h4 className="font-bold text-2xl"> Add a new Language</h4>
          <div className="mt-1">
            <label htmlFor="word" className="text-[15px] font-semibold">
              Language
            </label>
            <input
              className="w-full px-3 py-1 border"
              value={newLanguage}
              // required
              onChange={(e) => setNewLanguage(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-5">
            <button
              className={`py-[10px] px-[30px] border flex item-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-500 cursor-wait"
                  : "border-blue-800 bg-blue-800 cursor-pointer"
              } text-white rounded`}
              onClick={handleNewLanguageSubmit}
              disabled={isLoading}
            >
              Create
              <Oval
                visible={isLoading}
                height="20"
                width="20"
                color="#ffffff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </button>
          </div>
        </div>
      )}

      {isLanguageSelected && (
        <div className="w-[400px] mt-10 border p-5">
          <div className="">
            <label htmlFor="word" className="text-[15px] font-semibold">
              Select English Word
            </label>
            <Select
              options={englishOptions}
              onChange={handleEnglishWordSelect}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="word" className="text-[15px] font-semibold">
              Word
            </label>
            <input
              className="w-full px-3 py-1 border"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="meaning" className="text-[15px] font-semibold">
              Meaning
            </label>
            <textarea
              className="w-full border"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-3">
            <label htmlFor="meaning" className="text-[15px] font-semibold">
              Other Meaning
            </label>
            <textarea
              className="w-full border"
              value={otherMeaning}
              onChange={(e) => setOtherMeaning(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-3">
            <label htmlFor="meaning" className="text-[15px] font-semibold">
              Idioms{" "}
              <small>
                (please separate the words with a comma &quot;,&quot;)
              </small>
            </label>
            <input
              className="w-full px-3 py-1 border"
              value={idioms}
              onChange={(e) => setIdioms(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-5">
            <button
              className={`py-[10px] px-[30px] border ${
                isLoading
                  ? "bg-gray-500 cursor-wait"
                  : "border-blue-800 bg-blue-800 cursor-pointer"
              } text-white rounded`}
              onClick={handleCreateTranslation}
              disabled={isLoading}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
