import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {

  const [text, setText] = useState<string>("Hello world");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const populateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      setSelectedVoice(allVoices[0]); // Set a default selected voice
    }
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }, []);

  const speak = () => {
    if (!selectedVoice) return; // Prevent speaking if no voice is selected

    if (utterRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <div className='container'>
      <div className='title'><h2>Text-to-Speech App</h2></div>
      <div className='inputDiv'>
        <div className='inputText'>
          <label htmlFor="text" className='inputLabel'>Text to speak:</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className='inputOption'>
          <label htmlFor="text" className='inputLabel'>Voice options:</label>
          {voices.length > 0 && (
            <select className='voiceSelect' onChange={(e) => setSelectedVoice(voices.find((v) => v.name === e.target.value) || null)}>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name} className='voiceOption'>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className='inputButton'>
        <button onClick={speak} className='speakButton'>Speak</button>
      </div>
    </div>
  )
}

export default App
