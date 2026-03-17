"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/transcription.css";

const Transcription = () => {
  const recognitionRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [voices, setVoices] = useState([]);
  const [language, setLanguage] = useState("en-US");

  const availableLanguages = Array.from(
    new Set((voices || []).map((v) => v.lang))
  ).map((lang) => ({ lang, label: lang }));

  const activeLanguage = availableLanguages.find(({ lang }) => language === lang);

  const availableVoices = voices.filter((v) => v.lang === language);
  const activeVoice =
    availableVoices.find((v) => v.name.includes("Google")) ||
    availableVoices[0];

    const handleDelete = () => {
        setText("");
    };

  useEffect(() => {
    const loadVoices = () => {
      const voiceList = window.speechSynthesis.getVoices();
      if (voiceList.length > 0) setVoices(voiceList);
    };
    loadVoices();
    if ("onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  function handleOnRecord() {
    if (isActive) {
      recognitionRef.current?.stop();
      setIsActive(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = language;
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => setIsActive(true);

    recognitionRef.current.onend = () => {
      setIsActive(false);
      if (isActive) recognitionRef.current.start();
    };

    recognitionRef.current.onresult = async (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setText(transcript);

      try {
        const results = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript, language }),
        }).then((r) => r.json());

        setTranslation(results.text);
        speak(results.text);
      } catch (err) {
        console.error("Translation error:", err);
      }
    };

    recognitionRef.current.start();
  }

  function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (activeVoice) utterance.voice = activeVoice;
    window.speechSynthesis.speak(utterance);
  }

  function handleSave() {
    const blob = new Blob([`Spoken:\n${text}\n\nTranslation:\n${translation}`], {
      type: "text/plain",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcription.txt";
    link.click();
  }

  return (
    <div className="transcription-container">
      <div className="controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {availableLanguages.map(({ lang, label }) => (
            <option key={lang} value={lang}>
              {label}
            </option>
          ))}
        </select>

        <button
          className={isActive ? "record-btn active" : "record-btn"}
          onClick={handleOnRecord}
        >
          {isActive ? "Stop" : "Record"}
        </button>
      </div>

      <div className="equalizer">
        <AnimatePresence>
          {isActive &&
            Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="bar"
                animate={{ height: ["10px", `${30 + i * 5}px`, "10px"] }}
                transition={{ repeat: Infinity, duration: 0.5, repeatType: "mirror" }}
              />
            ))}
        </AnimatePresence>
      </div>

      <div className="text-output">
        <div className="scrollable-text">
          <p><strong>Spoken:</strong> {text || "..."}</p>
          {/* <p><strong>Translation:</strong> {translation || "..."}</p> */}
        </div>
        <div className="button">
        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
       
      </div>
    </div>
  );
};

export default Transcription;