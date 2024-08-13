"use client";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

export default function Home() {
  const [wordToTranslate, setWordToTranslate] = useState("");
  const [translatedWord, setTranslatedWord] = useState("");
  const [languageToTranslateFrom, setLanguageToTranslateFrom] = useState([
    { label: "English", value: "english" },
  ]);
  const [languageToTranslateTo, setLanguageToTranslateTo] = useState([
    { label: "Yoruba", value: "yoruba" },
  ]);
  const [selectedLanguageFrom, setSelectedLanguageFrom] = useState("");
  const [selectedLanguageTo, setSelectedLanguageTo] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLanguages = async () => {
    const response = await fetch("/api/languages");
    const data = await response.json();
    if (data.data) {
      const lang = data.data.map((lang: any) => ({
        label: lang.name,
        value: lang.id,
      }));
      setLanguageToTranslateFrom(lang);
      setLanguageToTranslateTo(lang);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  // Filter languages for the "Translate To" dropdown based on the selected "Translate From" language
  const filteredLanguagesTo = languageToTranslateTo.filter(
    (lang) => lang.value !== selectedLanguageFrom
  );

  const translate = async (
    text: string,
    languageToTranslateFrom: string,
    languageToTranslateTo: string
  ) => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: text,
          from: languageToTranslateFrom,
          to: languageToTranslateTo,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.data) {
        return data.data[data.data.length - 1];
      }
      return "";
    } catch (error) {
      console.log("-------", error);
      toast("Oops something went wrong", { type: "error" });
    }
  };

  const handleTranslation = async () => {
    setLoading(true);
    if (!selectedLanguageFrom || !selectedLanguageTo || !wordToTranslate) {
      setLoading(false);
      return;
    }
    console.log("Translating-------------!");
    const translation = await translate(
      wordToTranslate,
      selectedLanguageFrom,
      selectedLanguageTo
    );
    if (translation) {
      setTranslatedWord(translation.word);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <main className="">
      <nav className="p-4 shadow-md">
        <a className="text-2xl font-bold flex items-baseline gap-1" href="/">
          Transco{" "}
          <span className="w-[10px] h-[10px] bg-black block rounded-full"></span>
        </a>
      </nav>

      <section className="flex gap-4 container mx-auto my-6">
        <div className="w-1/2">
          <div className="mb-3">
            <SelectDropdown
              languages={languageToTranslateFrom}
              selectedLanguage={selectedLanguageFrom}
              setSelectedLanguage={setSelectedLanguageFrom}
            />
          </div>
          <textarea
            className="w-full min-h-36 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter your text here"
            onChange={(e) => {
              setWordToTranslate(e.target.value);
            }}
            defaultValue={wordToTranslate}
          ></textarea>
          <button
            className="px-3 py-2 bg-black text-white rounded-lg w-full flex items-center justify-center gap-2"
            onClick={handleTranslation}
            disabled={loading}
          >
            Translate
            <Oval
              visible={loading}
              height="20"
              width="20"
              color="#ffffff"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </button>
        </div>
        <ToastContainer position="top-right" />
        <div className="w-1/2">
          <div className="mb-3">
            <SelectDropdown
              languages={filteredLanguagesTo}
              selectedLanguage={selectedLanguageTo}
              setSelectedLanguage={setSelectedLanguageTo}
            />
          </div>
          <textarea
            disabled
            className="w-full min-h-36 p-2 border border-gray-300 rounded-lg"
            placeholder="Translation will appear here"
            defaultValue={translatedWord}
          ></textarea>
        </div>
      </section>
    </main>
  );
}

const SelectDropdown = ({
  languages = [],
  selectedLanguage,
  setSelectedLanguage,
}: {
  languages: { label: string; value: string }[];
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}) => {
  return (
    <select
      className="w-full p-2 border-b outline-none capitalize"
      value={selectedLanguage}
      onChange={(e) => {
        setSelectedLanguage(e.target.value);
      }}
    >
      <option value="" disabled>
        Select a language
      </option>
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};
