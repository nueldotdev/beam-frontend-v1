import { useState, useEffect, useRef } from "react";

export function useTranscription({ micOn, onTranscriptChunk }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const callbackRef = useRef(onTranscriptChunk);
  const micOnRef = useRef(micOn);

  // Keep callback ref up to date to avoid restarts
  useEffect(() => {
    callbackRef.current = onTranscriptChunk;
  }, [onTranscriptChunk]);

  // Keep micOn ref up to date for the onend handler
  useEffect(() => {
    micOnRef.current = micOn;
  }, [micOn]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      // Restart if mic is still supposed to be on
      if (micOnRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to restart recognition:", e);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript.trim() && callbackRef.current) {
        callbackRef.current(finalTranscript.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // Prevent restart on unmount
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (micOn && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Recognition might already be starting or started
      }
    } else if (!micOn && isListening) {
      recognitionRef.current.stop();
    }
  }, [micOn, isListening]);

  return { isListening };
}
