import { useEffect, useRef, useState } from "react";

const PLAYLIST = [
  {
    title: "seasons — wave to earth",
    src: "/audio/seasons.mp3",
  },
  {
    title: "Superpowers — Daniel Caesar",
    src: "/audio/superpowers.mp3",
  },
];

const FLOATING_NOTES = [
  { symbol: "♪", x: -24, y: -64, delay: 0, duration: 2.3 },
  { symbol: "♫", x: 18, y: -72, delay: 0.5, duration: 2.6 },
  { symbol: "♩", x: -12, y: -60, delay: 1.0, duration: 2.1 },
  { symbol: "♬", x: 26, y: -80, delay: 1.4, duration: 2.8 },
  { symbol: "♪", x: -4, y: -70, delay: 1.8, duration: 2.4 },
];

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const isSeeking = useRef(false);

  const currentTrack = PLAYLIST[trackIndex];

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, trackIndex]);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (!isSeeking.current && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const prevTrack = () => {
    setTrackIndex((prev) => (prev === 0 ? PLAYLIST.length - 1 : prev - 1));
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="music-player-area print:hidden">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Expanded Music Player Card */}
      {isOpen && (
        <div className="music-card" role="dialog" aria-label="Music Player">
          <div className="music-card-head">
            <span className={`music-status ${isPlaying ? "is-playing" : ""}`}>
              {isPlaying ? "Now Playing" : "Paused"}
            </span>
            <button
              className="music-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close music player"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l10 10M13 3 3 13" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Rotating Vinyl */}
          <div className="music-vinyl-wrap">
            <div className={`music-vinyl ${isPlaying ? "is-spinning" : ""}`}>
              <div className="music-vinyl-groove-1" />
              <div className="music-vinyl-groove-2" />
              <div className="music-vinyl-groove-3" />
              <div className="music-vinyl-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Song Title */}
          <p className="music-title" title={currentTrack.title}>
            {currentTrack.title}
          </p>

          {/* Progress / Seek Bar */}
          <div className="music-seek-wrap">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              onMouseDown={() => (isSeeking.current = true)}
              onMouseUp={() => (isSeeking.current = false)}
              className="music-seek-bar"
              style={{ "--progress": `${progressPercent}%` }}
              aria-label="Seek track"
            />
            <div className="music-time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="music-controls">
            <button
              className="music-ctrl-btn"
              onClick={prevTrack}
              aria-label="Previous track"
              title="Previous song"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              className="music-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              className="music-ctrl-btn"
              onClick={nextTrack}
              aria-label="Next track"
              title="Next song"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Right Trigger Button */}
      <div className="music-player-btn-wrap">
        {/* Glow Ring and Floating Notes when playing and closed */}
        {isPlaying && !isOpen && (
          <>
            <div className="music-glow-ring" />
            <div className="music-floating-notes">
              {FLOATING_NOTES.map((note, idx) => (
                <span
                  key={idx}
                  className="music-float-note"
                  style={{
                    "--fly-x": `${note.x}px`,
                    "--fly-y": `${note.y}px`,
                    animationDuration: `${note.duration}s`,
                    animationDelay: `${note.delay}s`,
                    fontSize: `${13 + (idx % 3) * 3}px`,
                  }}
                >
                  {note.symbol}
                </span>
              ))}
            </div>
          </>
        )}

        <button
          className="music-player-toggle-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close music widget" : "Open music player"}
          title={isOpen ? "Close player" : "Play music"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
