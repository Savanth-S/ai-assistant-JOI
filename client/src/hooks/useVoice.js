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

    // FIXED
    const [
      voiceEnabled,
      setVoiceEnabled,
    ] = useState(() => {

      const saved =
        localStorage.getItem(
          "voiceEnabled"
        );

      return saved !== "false";
    });

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

          const allVoices =
            window.speechSynthesis.getVoices();

          const availableVoices =
            allVoices.filter(
              (voice) => {

                const name =
                  voice.name.toLowerCase();

                const lang =
                  voice.lang.toLowerCase();

                return (

                  lang.includes("en") &&

                  !name.includes("offline") &&
                  !name.includes("legacy") &&
                  !name.includes("espeak") &&
                  !name.includes("test") &&
                  !name.includes("google uk english female")
                );
              }
            );

          availableVoices.sort(
            (a, b) => {

              const preferred = [
                "google",
                "microsoft",
                "samantha",
                "daniel",
                "zira",
                "aria",
              ];

              const aScore =
                preferred.some(
                  (p) =>
                    a.name
                      .toLowerCase()
                      .includes(p)
                )
                  ? 1
                  : 0;

              const bScore =
                preferred.some(
                  (p) =>
                    b.name
                      .toLowerCase()
                      .includes(p)
                )
                  ? 1
                  : 0;

              return (
                bScore - aScore
              );
            }
          );

          if (
            availableVoices.length > 0
          ) {

            setVoices(
              availableVoices
            );

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

    // SAVE SELECTED VOICE
    useEffect(() => {

      if (selectedVoice) {

        localStorage.setItem(
          "selectedVoice",
          selectedVoice.name
        );
      }

    }, [selectedVoice]);

    // FIXED SAVE VOICE ENABLED
    useEffect(() => {

      localStorage.setItem(
        "voiceEnabled",
        voiceEnabled
      );

      if (!voiceEnabled) {

        window.speechSynthesis.cancel();
      }

    }, [voiceEnabled]);

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

        utterance.rate = 1;

        utterance.pitch = 1;

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