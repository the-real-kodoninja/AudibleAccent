export const readAndHighlight = (text: string, speed: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    let currentWordIndex = 0;
  
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const words = document.querySelectorAll('.word');
        words.forEach((word, index) =>
          word.classList.toggle('highlight', index === currentWordIndex)
        );
        currentWordIndex++;
      }
    };
  
    utterance.onend = () =>
      document.querySelectorAll('.word').forEach((word) => word.classList.remove('highlight'));
  
    window.speechSynthesis.speak(utterance);
  };