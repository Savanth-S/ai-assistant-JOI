import {
  useEffect,
  useState,
} from "react";

export function useVoice() {

  const [voiceEnabled,
    setVoiceEnabled] =
    useState(true);

  const [speaking,
    setSpeaking] =
    useState(false);

  const [voices,
    setVoices] =
    useState([]);

  const [selectedVoice,
    setSelectedVoice] =
    useState("");

  // LOAD AVAILABLE VOICES

  useEffect(() => {

    const loadVoices =
      () => {

        const availableVoices =
          window.speechSynthesis.getVoices();

        setVoices(
          availableVoices
        );

        if (
          availableVoices.length > 0 &&
          !selectedVoice
        ) {

          const preferredVoice =
            availableVoices.find(
              (voice) =>

                voice.name
                  .toLowerCase()
                  .includes(
                    "zira"
                  ) ||

                voice.name
                  .toLowerCase()
                  .includes(
                    "aria"
                  ) ||

                voice.name
                  .toLowerCase()
                  .includes(
                    "samantha"
                  )
            );

          setSelectedVoice(

            preferredVoice
              ? preferredVoice.name
              : availableVoices[0]
                  .name
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

  }, [selectedVoice]);

  // SPEAK FUNCTION

  const speakText =
    (text) => {

      if (
        !voiceEnabled ||
        !text
      ) return;

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          text
        );

      const selected =
        voices.find(
          (voice) =>
            voice.name ===
            selectedVoice
        );

      if (selected) {

        utterance.voice =
          selected;
      }

      utterance.rate = 1;

      utterance.pitch = 1;

      utterance.onstart =
        () => {

          setSpeaking(
            true
          );
        };

      utterance.onend =
        () => {

          setSpeaking(
            false
          );
        };

      utterance.onerror =
        () => {

          setSpeaking(
            false
          );
        };

      window.speechSynthesis.speak(
        utterance
      );
    };

  return {

    voiceEnabled,
    setVoiceEnabled,

    speaking,

    voices,

    selectedVoice,
    setSelectedVoice,

    speakText,
  };
}