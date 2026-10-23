import { useEffect, useRef, useState, useCallback } from "react";
import miloScenes from "../data/miloScenes";
import Milo3DScene from "./Milo3DScene";
import MiloMoonIllustration from "./MiloMoonIllustration";

const femaleVoiceRegex = /female|woman|samantha|zira|aria|jenny|susan|linda|karen|victoria|siri|catherine|zoe|fiona/i;
const maleVoiceRegex = /male|man|daniel|david|george|james|oliver|junior|alex|tom|guy/i;
const editableTarget = "input, select, textarea, [contenteditable='true']";

export default function MiloAnimatedStory() {
  const [storyStage, setStoryStage] = useState("intro"); // "intro", "story", "ending"
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playMode, setPlayMode] = useState("idle"); // "idle", "playing"
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [viewMode, setViewMode] = useState("3d"); // "3d" or "art"
  const [cameraMode, setCameraMode] = useState("cinematic"); // "cinematic" or "orbit"
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0x, 1.25x, 1.5x
  const [talking, setTalking] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [speechMessage, setSpeechMessage] = useState("");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [pitchOffset, setPitchOffset] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);

  const scene = miloScenes[sceneIndex] || miloScenes[0];
  const speechAvailable = typeof window !== "undefined"
    && "speechSynthesis" in window
    && "SpeechSynthesisUtterance" in window;

  const cancelSpeechRef = useRef(false);
  const lineTimerRef = useRef(null);
  // Load available browser voices
  useEffect(() => {
    if (!speechAvailable) return undefined;
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      setSelectedVoiceURI((curr) => {
        if (curr && voices.some((v) => v.voiceURI === curr)) return curr;
        const defaultVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en")) || voices[0];
        return defaultVoice ? defaultVoice.voiceURI : "";
      });
    };

    updateVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", updateVoices);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", updateVoices);
  }, [speechAvailable]);

  // Character-specific voice tuning
  const getCharacterVoiceConfig = useCallback((character) => {
    const defaultVoice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI)
      || availableVoices.find((v) => v.lang.toLowerCase().startsWith("en"))
      || availableVoices[0]
      || null;

    const femaleVoice = availableVoices.find((v) => v.lang.toLowerCase().startsWith("en") && femaleVoiceRegex.test(`${v.name} ${v.voiceURI}`))
      || defaultVoice;
    const maleVoice = availableVoices.find((v) => v.lang.toLowerCase().startsWith("en") && maleVoiceRegex.test(`${v.name} ${v.voiceURI}`))
      || defaultVoice;

    if (character === "Milo") {
      return {
        voice: maleVoice || defaultVoice,
        pitch: Math.min(2.0, Math.max(0.5, 1.42 + pitchOffset)),
        rate: Math.min(1.5, Math.max(0.6, 0.98 * speedMultiplier)),
      };
    }
    if (character === "Mara") {
      return {
        voice: femaleVoice || defaultVoice,
        pitch: Math.min(2.0, Math.max(0.5, 1.68 + pitchOffset)),
        rate: Math.min(1.5, Math.max(0.6, 1.02 * speedMultiplier)),
      };
    }
    if (character === "Mother") {
      return {
        voice: femaleVoice || defaultVoice,
        pitch: Math.min(2.0, Math.max(0.5, 1.02 + pitchOffset)),
        rate: Math.min(1.5, Math.max(0.6, 0.94 * speedMultiplier)),
      };
    }
    if (character === "Doctor") {
      return {
        voice: maleVoice || defaultVoice,
        pitch: Math.min(2.0, Math.max(0.5, 0.98 + pitchOffset)),
        rate: Math.min(1.5, Math.max(0.6, 0.92 * speedMultiplier)),
      };
    }
    if (character === "Moon") {
      // The Talking Moon: gentle, deep, wise, mature cadence
      return {
        voice: maleVoice || defaultVoice,
        pitch: Math.min(2.0, Math.max(0.5, 0.82 + pitchOffset)),
        rate: Math.min(1.5, Math.max(0.6, 0.88 * speedMultiplier)),
      };
    }
    // Narrator
    return {
      voice: defaultVoice,
      pitch: Math.min(2.0, Math.max(0.5, 1.15 + pitchOffset)),
      rate: Math.min(1.5, Math.max(0.6, 0.95 * speedMultiplier)),
    };
  }, [availableVoices, selectedVoiceURI, pitchOffset, speedMultiplier]);

  // Clean stop for audio and timers
  const stopPlayback = useCallback(() => {
    cancelSpeechRef.current = true;
    if (lineTimerRef.current) {
      clearTimeout(lineTimerRef.current);
      lineTimerRef.current = null;
    }
    if (speechAvailable) {
      window.speechSynthesis.cancel();
    }
    setPlayMode("idle");
    setTalking("");
    setIsSpeaking(false);
    setActiveLineIndex(-1);
  }, [speechAvailable]);

  // Global unmount cleanup
  useEffect(() => () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Sequence dialogue turns for current scene
  useEffect(() => {
    if (storyStage !== "story" || playMode !== "playing") return undefined;

    cancelSpeechRef.current = false;
    const lines = [
      { character: "Narrator", line: scene.narration.join(" ") },
      ...scene.dialogue,
    ];

    let currentLineIdx = 0;

    const playNextLine = () => {
      if (cancelSpeechRef.current) return;

      if (currentLineIdx >= lines.length) {
        // Scene complete
        setTalking("");
        setIsSpeaking(false);
        setActiveLineIndex(-1);
        setSpeechProgress(1);

        if (sceneIndex < miloScenes.length - 1) {
          lineTimerRef.current = setTimeout(() => {
            if (!cancelSpeechRef.current) {
              setSceneIndex((prev) => prev + 1);
            }
          }, 1100);
        } else {
          // Final scene complete -> transition into ending credits
          setPlayMode("idle");
          lineTimerRef.current = setTimeout(() => {
            setStoryStage("ending");
          }, 1400);
        }
        return;
      }

      const activeEntry = lines[currentLineIdx];
      setActiveLineIndex(currentLineIdx);
      setSpeechProgress(currentLineIdx / lines.length);

      // Silent mode fallback
      if (!audioEnabled || !speechAvailable) {
        setTalking(activeEntry.character);
        setIsSpeaking(true);
        const readingMs = Math.max(2800, activeEntry.line.length * 68);
        lineTimerRef.current = setTimeout(() => {
          if (!cancelSpeechRef.current) {
            currentLineIdx += 1;
            playNextLine();
          }
        }, readingMs);
        return;
      }

      // Web Speech API
      const { voice, pitch, rate } = getCharacterVoiceConfig(activeEntry.character);
      const utterance = new SpeechSynthesisUtterance(activeEntry.line);
      if (voice) utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.onstart = () => {
        if (!cancelSpeechRef.current) {
          setTalking(activeEntry.character);
          setIsSpeaking(true);
          setSpeechMessage(`Speaking: ${activeEntry.character}`);
        }
      };

      utterance.onend = () => {
        if (cancelSpeechRef.current) return;
        setIsSpeaking(false);
        currentLineIdx += 1;
        lineTimerRef.current = setTimeout(playNextLine, 350);
      };

      utterance.onerror = (e) => {
        if (cancelSpeechRef.current || e.error === "canceled" || e.error === "interrupted") return;
        setIsSpeaking(false);
        setSpeechMessage("Voice playback is unavailable. The story will continue with captions.");
        currentLineIdx += 1;
        lineTimerRef.current = setTimeout(playNextLine, 400);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNextLine();

    return () => {
      cancelSpeechRef.current = true;
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
      if (speechAvailable) window.speechSynthesis.cancel();
      setTalking("");
      setIsSpeaking(false);
    };
  }, [storyStage, playMode, sceneIndex, audioEnabled, speechAvailable, scene, getCharacterVoiceConfig]);

  const togglePlayback = () => {
    if (playMode === "idle") {
      setPlayMode("playing");
      setSpeechMessage(audioEnabled ? "Starting story playback…" : "Silent playback active.");
    } else {
      stopPlayback();
      setSpeechMessage("Story paused.");
    }
  };

  const goToScene = (index) => {
    stopPlayback();
    setSpeechProgress(0);
    const target = Math.max(0, Math.min(miloScenes.length - 1, index));
    setSceneIndex(target);
    setStoryStage("story");
  };

  const replayScene = () => {
    stopPlayback();
    setTimeout(() => {
      setPlayMode("playing");
    }, 120);
  };

  const startStoryFromIntro = () => {
    setStoryStage("story");
    setSceneIndex(0);
    setPlayMode("playing");
  };

  const restartEntireStory = () => {
    stopPlayback();
    setSceneIndex(0);
    setStoryStage("story");
    setTimeout(() => {
      setPlayMode("playing");
    }, 150);
  };

  const scrollToKidsCorner = () => {
    const el = document.getElementById("kids-catalogue-heading") || document.querySelector(".kids-heading");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const cycleZoom = () => {
    setZoomLevel((curr) => {
      if (curr === 1.0) return 1.25;
      if (curr === 1.25) return 1.5;
      return 1.0;
    });
  };

  const onKeyDown = (event) => {
    if (event.target.closest(editableTarget) || event.target.closest("button, a")) return;
    if (event.code === "Space") {
      event.preventDefault();
      if (storyStage === "intro") startStoryFromIntro();
      else if (storyStage === "story") togglePlayback();
    } else if (event.key === "ArrowLeft" && storyStage === "story") {
      event.preventDefault();
      goToScene(sceneIndex - 1);
    } else if (event.key === "ArrowRight" && storyStage === "story") {
      event.preventDefault();
      goToScene(sceneIndex + 1);
    }
  };

  const activeSpokenLine = activeLineIndex === 0
    ? { character: "Narrator", line: scene.narration.join(" ") }
    : activeLineIndex > 0 && scene.dialogue[activeLineIndex - 1]
      ? scene.dialogue[activeLineIndex - 1]
      : null;

  return (
    <section
      className="milo-player"
      aria-labelledby="milo-player-heading"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* Header with Camera, Zoom & Stage Status */}
      <div className="milo-player-heading">
        <div>
          <span className="kids-overline">COVEILLA ORIGINAL 3D CARTOON</span>
          <h3 id="milo-player-heading">Milo and the Moon</h3>
        </div>
        <div className="milo-heading-actions">
          {storyStage === "story" && viewMode === "3d" && (
            <div className="milo-camera-toggle" role="group" aria-label="Camera direction mode">
              <button
                type="button"
                className={`milo-toggle-btn ${cameraMode === "cinematic" ? "is-active" : ""}`}
                onClick={() => setCameraMode("cinematic")}
                aria-pressed={cameraMode === "cinematic"}
                title="Cinematic director camera cuts and pans"
              >
                🎬 Cinematic
              </button>
              <button
                type="button"
                className={`milo-toggle-btn ${cameraMode === "orbit" ? "is-active" : ""}`}
                onClick={() => setCameraMode("orbit")}
                aria-pressed={cameraMode === "orbit"}
                title="Interactive 3D orbit using mouse or touch"
              >
                🔄 Free Orbit
              </button>
              <button
                type="button"
                className="milo-toggle-btn milo-zoom-btn"
                onClick={cycleZoom}
                title={`Camera zoom: ${zoomLevel}x. Click to zoom in.`}
              >
                🔍 {zoomLevel}x
              </button>
            </div>
          )}

          {storyStage === "story" && (
            <div className="milo-view-toggle" role="group" aria-label="Display mode">
              <button
                type="button"
                className={`milo-toggle-btn ${viewMode === "3d" ? "is-active" : ""}`}
                onClick={() => setViewMode("3d")}
                aria-pressed={viewMode === "3d"}
              >
                🌟 3D Scene
              </button>
              <button
                type="button"
                className={`milo-toggle-btn ${viewMode === "art" ? "is-active" : ""}`}
                onClick={() => setViewMode("art")}
                aria-pressed={viewMode === "art"}
              >
                🖼️ Artwork
              </button>
            </div>
          )}

          {storyStage === "story" && (
            <span className="milo-scene-count">{sceneIndex + 1} / {miloScenes.length}</span>
          )}
        </div>
      </div>

      {/* Main 3D Screen Area */}
      <div className="milo-player-screen">
        {storyStage === "intro" ? (
          <>
            <Milo3DScene sceneId="intro" cameraMode="cinematic" zoomLevel={1.0} />
            <div className="milo-intro-overlay" role="dialog" aria-labelledby="intro-title">
              <div className="milo-intro-badge">✨ COVEILLA KIDS PRESENTS</div>
              <h1 id="intro-title" className="milo-intro-title">Milo and the Moon</h1>
              <p className="milo-intro-subtitle">A story about love, loss, and finding light in the darkness.</p>
              <p className="milo-intro-credit">Written by Udofe Godscovenant Patrick</p>
              <span className="milo-intro-audience">A gentle animated story for ages 6–10</span>
              <div className="milo-intro-buttons">
                <button
                  type="button"
                  className="milo-btn-primary"
                  onClick={startStoryFromIntro}
                  aria-label="Begin animated story"
                >
                  ▶ Begin Story
                </button>
                <button
                  type="button"
                  className="milo-btn-secondary"
                  onClick={() => {
                    setStoryStage("story");
                    setSceneIndex(0);
                    setPlayMode("idle");
                  }}
                  aria-label="Skip introduction"
                >
                  Skip Intro ›
                </button>
              </div>
            </div>
          </>
        ) : storyStage === "ending" ? (
          <>
            <Milo3DScene sceneId="ending" cameraMode="cinematic" zoomLevel={1.0} />
            <div className="milo-ending-overlay" role="dialog" aria-labelledby="ending-title">
              <span className="milo-ending-tag">THE END</span>
              <h2 id="ending-title" className="milo-ending-title">Milo and the Moon</h2>
              <p className="milo-ending-author">Written by Udofe Godscovenant Patrick</p>
              <span className="milo-ending-age">A story for children aged 6–10</span>

              <div className="milo-ending-reflections">
                <p>
                  “This story helps children explore their emotions, understand grief, and begin to learn that death is a natural part of life. Through Milo's journey, children discover that sadness is okay, talking about our feelings can help, and the love and memories we share with others can remain meaningful even after a goodbye.”
                </p>
                <p>
                  “Everyone experiences loss differently. When you feel sad, confused, or worried, it is okay to talk to a trusted adult. You do not have to face difficult feelings alone.”
                </p>
                <p className="milo-ending-highlight">
                  <strong>A little reminder:</strong> “Love leaves memories that we can carry in our hearts.”
                </p>
              </div>

              <p className="milo-ending-motto">Created for young hearts and growing minds.</p>

              <div className="milo-ending-actions">
                <button
                  type="button"
                  className="milo-btn-primary"
                  onClick={restartEntireStory}
                  aria-label="Watch the story again"
                >
                  ↺ Watch Again
                </button>
                <button
                  type="button"
                  className="milo-btn-secondary"
                  onClick={scrollToKidsCorner}
                  aria-label="Return to Kids' Corner collection"
                >
                  🏠 Return to Kids’ Corner
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Active Story Scene */
          <>
            {viewMode === "3d" ? (
              <Milo3DScene
                sceneId={scene.id}
                talking={talking}
                isSpeaking={isSpeaking}
                speechProgress={speechProgress}
                cameraMode={cameraMode}
                zoomLevel={zoomLevel}
              />
            ) : scene.image ? (
              <figure className={`milo-photo-scene scene-photo-${scene.id}`} style={{ "--milo-photo": `url("${scene.image}")` }}>
                <div className="milo-photo-backdrop" aria-hidden="true" />
                <img className="milo-photo-image" src={scene.image} alt={scene.imageAlt} />
              </figure>
            ) : (
              <MiloMoonIllustration sceneId={scene.id} talking={talking} />
            )}

            {/* Live Subtitle Banner */}
            <div className="milo-screen-caption" aria-live="polite">
              <div className="milo-caption-top">
                <span className="milo-scene-tag">SCENE {String(sceneIndex + 1).padStart(2, "0")}</span>
                {isSpeaking && talking && (
                  <span className={`milo-speaking-badge speaking-${talking.toLowerCase()}`}>
                    🗣️ {talking} speaking
                  </span>
                )}
              </div>
              <h4>{scene.title}</h4>
              {activeSpokenLine && (
                <div className="milo-live-subtitle">
                  <span className="milo-sub-speaker">{activeSpokenLine.character}:</span>
                  <p className="milo-sub-text">“{activeSpokenLine.line}”</p>
                </div>
              )}
            </div>

            {/* In-Screen Glass Controls */}
            <div className="milo-glass-controls" aria-label="Story playback controls">
              <button
                type="button"
                onClick={() => goToScene(sceneIndex - 1)}
                disabled={sceneIndex === 0}
                aria-label="Previous scene"
                title="Previous scene"
              >
                ‹
              </button>
              <button
                type="button"
                className="milo-play-toggle"
                onClick={togglePlayback}
                aria-label={playMode === "playing" ? "Pause story" : "Play story"}
                title={playMode === "playing" ? "Pause" : "Play"}
              >
                {playMode === "playing" ? "❚❚" : "▶"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (sceneIndex === miloScenes.length - 1) setStoryStage("ending");
                  else goToScene(sceneIndex + 1);
                }}
                aria-label="Next scene"
                title="Next scene"
              >
                ›
              </button>
              <button
                type="button"
                onClick={replayScene}
                aria-label="Replay current scene"
                title="Replay scene"
              >
                ↺
              </button>
              <button
                type="button"
                className={`milo-sound-btn ${!audioEnabled ? "is-muted" : ""}`}
                onClick={() => {
                  if (audioEnabled) {
                    if (speechAvailable) window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                  setAudioEnabled((prev) => !prev);
                }}
                aria-label={audioEnabled ? "Mute character voices" : "Turn voices on"}
                aria-pressed={!audioEnabled}
                title={audioEnabled ? "Mute audio" : "Turn sound on"}
              >
                {audioEnabled ? "🔊 Sound on" : "🔇 Muted"}
              </button>
              <span className="milo-scene-count">{sceneIndex + 1} / {miloScenes.length}</span>
            </div>
          </>
        )}
      </div>

      {/* Story Progress Bar */}
      {storyStage === "story" && (
        <>
          <div className="milo-progress-label">
            <span>Story progress</span>
            <span>{Math.round(((sceneIndex + speechProgress) / miloScenes.length) * 100)}%</span>
          </div>
          <progress
            className="milo-progress"
            value={sceneIndex + speechProgress}
            max={miloScenes.length}
            aria-label={`Story progress ${Math.round(((sceneIndex + speechProgress) / miloScenes.length) * 100)} percent`}
          />
        </>
      )}

      {/* Story Narration & Transcript Box */}
      {storyStage === "story" && (
        <div className="milo-player-copy" aria-live="polite">
          <p className={`milo-narration ${activeLineIndex === 0 ? "is-active-line" : ""}`}>
            <strong>Storyteller:</strong> {scene.narration.join(" ")}
          </p>
          {scene.dialogue.length > 0 && (
            <div className="milo-dialogue" aria-label="Character dialogue">
              {scene.dialogue.map(({ character, line }, idx) => {
                const isCurrent = activeLineIndex === idx + 1;
                return (
                  <p
                    key={`${character}-${line}-${idx}`}
                    className={`milo-dialogue-line char-${character.toLowerCase()} ${isCurrent ? "is-active-line" : ""}`}
                  >
                    <strong className="milo-dialogue-speaker">{character}:</strong>
                    <span className="milo-dialogue-quote"> “{line}”</span>
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Voice & Speech Customization */}
      {storyStage === "story" && (
        <details className="milo-voice-panel">
          <summary>🎙️ Voice & Lip-Sync Settings</summary>
          {speechAvailable && availableVoices.length > 0 ? (
            <div className="milo-voice-grid">
              <label>
                Base Voice
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                >
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Pitch Tuning
                <output>{(1.4 + pitchOffset).toFixed(1)} (Milo) / {(1.7 + pitchOffset).toFixed(1)} (Mara) / {(0.8 + pitchOffset).toFixed(1)} (Moon)</output>
                <input
                  type="range"
                  min="-0.4"
                  max="0.4"
                  step="0.05"
                  value={pitchOffset}
                  onChange={(e) => setPitchOffset(parseFloat(e.target.value))}
                />
              </label>
              <label>
                Story Pace
                <output>{speedMultiplier.toFixed(2)}×</output>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={speedMultiplier}
                  onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                />
              </label>
              <p>
                Milo, Mara, Mother, Doctor Bennett, and the Talking Moon each use distinct pitch and cadence modulation for family-friendly audio performance.
              </p>
            </div>
          ) : (
            <p className="milo-speech-message">
              Speech synthesis voices are unavailable in this browser. Captions will automatically guide your storytime smoothly.
            </p>
          )}
        </details>
      )}

      {speechMessage && storyStage === "story" && (
        <p className="milo-speech-message" role="status">
          {speechMessage}
        </p>
      )}

      {/* Scene Navigation Row */}
      {storyStage === "story" && (
        <nav className="milo-scene-row" aria-label="Choose a story scene">
          {miloScenes.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={index === sceneIndex ? "is-current" : ""}
              onClick={() => goToScene(index)}
              aria-current={index === sceneIndex ? "step" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <small>3D Cartoon</small>
            </button>
          ))}
          <button
            type="button"
            className="milo-ending-nav-btn"
            onClick={() => setStoryStage("ending")}
            title="View meaningful ending reflection"
          >
            <span>★</span>
            <strong>Ending Credits</strong>
            <small>Reflection</small>
          </button>
        </nav>
      )}

      <p className="milo-shortcut-help">
        {storyStage === "intro"
          ? "Press Space or click Begin Story to start the adventure"
          : "Keyboard: Space to play/pause · ← and → to change scenes"}
      </p>
    </section>
  );
}
