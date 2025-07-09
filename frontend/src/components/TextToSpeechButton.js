import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from './Loader';

function TextToSpeechButton({ text }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [playing, setPlaying] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const audioRef = useRef(null);

  const API_KEY = "sk_d024ab1a39d913d35f5cf5afb7bf5494b4c5e4450eac29bf"; // Your ElevenLabs API key
  const VOICE_MAP = {
    en: "EXAVITQu4vr4xnSDxMaL", // English voice
    hi: "TxGEqnHWrfWFTfGW9XjX", // Hindi voice
  };

  const generateAudio = async () => {
    setLoading(true);
    setAudioUrl(null);

    try {
      const voiceId = VOICE_MAP[language];
      console.log("Generating audio with voice ID:", voiceId);
      console.log("Language:", language);
      console.log("Text length:", text.length);
      
      // Use fetch instead of axios for better CORS handling
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': API_KEY,
          },
          body: JSON.stringify({
            text: text.slice(0, 2500), // Limit text length to avoid API limits
            model_id: language === "hi" ? "eleven_multilingual_v2" : "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.75,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      console.log("Response received:", response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Response:", errorData);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorData}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
    } catch (error) {
      console.error("TTS Error Details:", error);
      
      // Check if user is logged in
      const currentUser = JSON.parse(localStorage.getItem('openscroll_current_user'));
      
      let errorMsg = "";
      if (error.message.includes('401') || error.message.includes('quota')) {
        if (!currentUser) {
          errorMsg = "Please login first to use the text-to-speech feature. You'll need to add credits to your account after logging in.";
        } else {
          errorMsg = "No credits available for text-to-speech. Please add credits to your account to continue using this feature.";
        }
      } else if (error.message.includes('429')) {
        errorMsg = "Rate limit exceeded. Please try again later.";
      } else if (error.message.includes('400')) {
        errorMsg = "Invalid request. Please check your text.";
      } else if (error.message.includes('CORS')) {
        errorMsg = "CORS error. Please try again.";
      } else {
        errorMsg = "Failed to generate audio. Please try again.";
      }
      
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <>
      {/* Listen Button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: "#d0f330",
          color: "#111",
          border: "none",
          padding: "0.5rem 1.1rem",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
        Listen
      </button>

      {/* Fullscreen Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              position: "absolute",
              top: "500px", // <-- Push the modal towards the top
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(15, 15, 30, 0.92)",
              border: "1px solid #d0f33088",
              borderRadius: "16px",
              padding: "2rem",
              width: "90%",
              maxWidth: "420px",
              boxShadow: "0 0 20px #d0f33055",
              color: "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setAudioUrl(null);
                setPlaying(false);
              }}
              style={{
                position: "absolute",
                top: "0.6rem",
                right: "0.8rem",
                background: "transparent",
                border: "none",
                fontSize: "1.4rem",
                color: "#d0f330",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>

            <h2 style={{ color: "#d0f330", marginBottom: "1rem" }}>
              Select Language
            </h2>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "1rem",
                background: "#111",
                color: "#fff",
                border: "1px solid #444",
              }}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>

            <button
              onClick={generateAudio}
              disabled={loading}
              style={{
                width: "100%",
                background: "#d0f330",
                color: "#111",
                padding: "0.6rem 1.2rem",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                marginBottom: "1rem",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Generating..." : "Generate Audio"}
            </button>

            {/* Audio Player Inline */}
            {audioUrl && (
              <div style={{ marginTop: "1rem" }}>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button
                    onClick={togglePlay}
                    style={{
                      background: "#111",
                      color: "#d0f330",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid #d0f33055",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {playing ? "⏸ Pause" : "▶️ Play"}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="1"
                    style={{
                      flex: 1,
                      height: "4px",
                      background: "#d0f33044",
                      borderRadius: "2px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                    onChange={(e) => {
                      const vol = parseFloat(e.target.value);
                      if (audioRef.current) audioRef.current.volume = vol;
                    }}
                  />
                  <span style={{ fontSize: "0.8rem", color: "#999", minWidth: "60px" }}>
                    Volume
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
          }}
          onClick={() => setShowErrorModal(false)}
        >
          <div
            style={{
              position: "absolute",
              top: "500px", // Same positioning as main TTS modal
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(15, 15, 30, 0.92)",
              border: "1px solid #d0f33088",
              borderRadius: "16px",
              padding: "2rem",
              width: "90%",
              maxWidth: "420px",
              boxShadow: "0 0 20px #d0f33055",
              color: "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#d0f330", marginBottom: "1rem", textAlign: "center" }}>
              ⚠️ Text-to-Speech Error
            </h3>
            <p style={{ marginBottom: "1.5rem", lineHeight: "1.5" }}>
              {errorMessage}
            </p>
            {(() => {
              const currentUser = JSON.parse(localStorage.getItem('openscroll_current_user'));
              
              if (!currentUser) {
                // User not logged in - show Cancel and Login buttons
                return (
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      onClick={() => setShowErrorModal(false)}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowErrorModal(false);
                        navigate('/login');
                      }}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        backgroundColor: "#d0f330",
                        color: "#111",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Login
                    </button>
                  </div>
                );
              } else {
                // User is logged in but no credits - show only OK button
                return (
                  <button
                    onClick={() => setShowErrorModal(false)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "#d0f330",
                      color: "#111",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    OK
                  </button>
                );
              }
            })()}
          </div>
        </div>
      )}
    </>
  );
}

export default TextToSpeechButton;