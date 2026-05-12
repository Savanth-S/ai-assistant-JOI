import {
  useEffect,
  useState,
} from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const useVoice =
  (setMessage) => {

    const [
      speaking,
      setSpeaking,
    ] = useState(false);

    const [
      voices,
      setVoices,
    ] = useState([]);

    const [
      selectedVoice,
      setSelectedVoice,
    ] = useState(null);

    const [
      voiceEnabled,
      setVoiceEnabled,
    ] = useState(true);

    const {
      transcript,
      listening,
      browserSupportsSpeechRecognition,
      resetTranscript,
    } =
      useSpeechRecognition();

    // LOAD VOICES
    useEffect(() => {

      const loadVoices =
        () => {

          const availableVoices =
            window.speechSynthesis.getVoices();

          if (
            availableVoices.length > 0
          ) {

            setVoices(
              availableVoices
            );

            // RESTORE SAVED VOICE
            const savedVoice =
              localStorage.getItem(
                "selectedVoice"
              );

            if (savedVoice) {

              const foundVoice =
                availableVoices.find(
                  (voice) =>
                    voice.name ===
                    savedVoice
                );

              if (foundVoice) {

                setSelectedVoice(
                  foundVoice
                );

                return;
              }
            }

            // DEFAULT VOICE
            setSelectedVoice(
              availableVoices[0]
            );
          }
        };

      loadVoices();

      window.speechSynthesis.onvoiceschanged =
        loadVoices;

      return () => {

        window.speechSynthesis.onvoiceschanged =
          null;
      };

    }, []);

    // SAVE VOICE
    useEffect(() => {

      if (selectedVoice) {

        localStorage.setItem(
          "selectedVoice",
          selectedVoice.name
        );
      }

    }, [selectedVoice]);

    // VOICE INPUT
    useEffect(() => {

      if (
        transcript &&
        typeof setMessage ===
          "function"
      ) {

        setMessage(transcript);
      }

    }, [transcript, setMessage]);

    // START LISTENING
    const startListening =
      () => {

        resetTranscript();

        SpeechRecognition.startListening({
          continuous: true,
        });
      };

    // STOP LISTENING
    const stopListening =
      () => {

        SpeechRecognition.stopListening();
      };

    // SPEAK
    const speakText =
      (text) => {

        if (!voiceEnabled) return;

        if (
          !window.speechSynthesis
        ) return;

        window.speechSynthesis.cancel();

        const utterance =
          new SpeechSynthesisUtterance(
            text
          );

        if (selectedVoice) {

          utterance.voice =
            selectedVoice;
        }

        utterance.onstart =
          () => {

            setSpeaking(true);
          };

        utterance.onend =
          () => {

            setSpeaking(false);
          };

        utterance.onerror =
          () => {

            setSpeaking(false);
          };

        window.speechSynthesis.speak(
          utterance
        );
      };

    return {

      transcript,

      listening,

      startListening,

      stopListening,

      browserSupportsSpeechRecognition,

      speaking,

      voices,

      selectedVoice,

      setSelectedVoice,

      voiceEnabled,

      setVoiceEnabled,

      speakText,
    };
  };