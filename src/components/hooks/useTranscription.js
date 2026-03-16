import { useState, useEffect, useRef } from "react";

export function useTranscription({ micOn, onTranscriptChunk, onTranscriptInterim }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const callbackRef = useRef(onTranscriptChunk);
  const interimCallbackRef = useRef(onTranscriptInterim);
  const micOnRef = useRef(micOn);

  // Keep callback refs up to date
  useEffect(() => {
    callbackRef.current = onTranscriptChunk;
  }, [onTranscriptChunk]);

  useEffect(() => {
    interimCallbackRef.current = onTranscriptInterim;
  }, [onTranscriptInterim]);

  // Keep micOn ref up to date
  useEffect(() => {
    micOnRef.current = micOn;
  }, [micOn]);

  const safeStart = () => {
    if (!recognitionRef.current) return;
    try {
      console.log("[useTranscription] Triggering recognition.start()...");
      recognitionRef.current.start();
    } catch (e) {
      console.log("[useTranscription] recognition.start() notice:", e.message);
    }
  };

  useEffect(() => {
    console.log("[useTranscription] Initializing SpeechRecognition. micOn status:", micOn);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("[useTranscription] Speech Recognition API is NOT SUPPORTED in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("[useTranscription] onstart.");
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("[useTranscription] onend. micOnRef:", micOnRef.current);
      setIsListening(false);
      if (micOnRef.current) {
        console.log("[useTranscription] Scheduling restart in 500ms...");
        setTimeout(safeStart, 500);
      }
    };

    recognition.onerror = (event) => {
      console.error("[useTranscription] onerror:", event.error);
      if (event.error === 'not-allowed') {
        micOnRef.current = false; 
      }
    };

    recognition.onresult = (event) => {
      console.log(`[useTranscription] onresult event. Results length: ${event.results.length}`);
      let finalTranscript = "";
      let interimTranscript = "";
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          console.log(`[useTranscription] FINAL CHUNK: "${transcript}"`);
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript.trim() && interimCallbackRef.current) {
          interimCallbackRef.current(interimTranscript.trim());
      }

      if (finalTranscript.trim() && callbackRef.current) {
        console.log(`[useTranscription] Sending final chunk to callback: "${finalTranscript.trim()}"`);
        callbackRef.current(finalTranscript.trim());
      }
    };

    recognitionRef.current = recognition;

    if (micOn) {
        console.log("[useTranscription] Hook mounted with micOn=true. Starting recognition...");
        safeStart();
    }

    return () => {
      console.log("[useTranscription] Hook unmounting. Stopping recognition...");
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle manual toggle
  useEffect(() => {
    if (!recognitionRef.current) return;
    console.log("[useTranscription] micOn/isListening effect changed. micOn:", micOn, "isListening:", isListening);
    if (micOn && !isListening) {
      console.log("[useTranscription] micOn changed to TRUE while not listening. Starting...");
      safeStart();
    } else if (!micOn && isListening) {
      console.log("[useTranscription] micOn changed to FALSE while listening. Stopping...");
      recognitionRef.current.stop();
    }
  }, [micOn, isListening]);

  return { isListening };
}
