// src/utils/speech.ts
export const readAndHighlight = (
    text: string,
    speed: number,
    startIndex: number = 0,
    setCurrentIndex: (index: number) => void,
    voiceName?: string
  ) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    if (voiceName) {
      const voice = window.speechSynthesis.getVoices().find((v) => v.name === voiceName);
      if (voice) utterance.voice = voice;
    }
    let currentWordIndex = startIndex;
  
    utterance.onboundary = (event) => {
      if (event.name === 'word' && currentWordIndex < text.split(' ').length) {
        const words = document.querySelectorAll('.word');
        words.forEach((word, index) =>
          word.classList.toggle('highlight', index === currentWordIndex)
        );
        setCurrentIndex(currentWordIndex);
        currentWordIndex++;
      }
    };
  
    utterance.onend = () =>
      document.querySelectorAll('.word').forEach((word) => word.classList.remove('highlight'));
  
    window.speechSynthesis.speak(utterance);
  };