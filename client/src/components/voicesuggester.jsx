import React, { useState } from "react";
import axios from "axios";

const VoiceSuggester = () => {
  const [transcript, setTranscript] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
      fetchSuggestions(speechText);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const fetchSuggestions = async (text) => {
    try {
      const res = await axios.post("/api/ai-suggest", { query: text });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  return (
    <div className="voice-suggester">
      <h2>🎤 AI Job Suggester</h2>
      <button onClick={startListening} disabled={listening}>
        {listening ? "Listening..." : "Speak Your Job Preference"}
      </button>
      {transcript && <p><strong>You said:</strong> {transcript}</p>}
      {suggestions && (
        <div>
          <h3>💡 Suggestions</h3>
          <pre>{suggestions}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceSuggester;
