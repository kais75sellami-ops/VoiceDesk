import React, { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ApiResponse } from '../types';

interface AudioPlayerProps {
  audioData: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Convert base64 to blob URL
    const binaryString = atob(audioData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    audioUrlRef.current = url;

    // Create audio element
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      URL.revokeObjectURL(url);
    };
  }, [audioData]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleDownload = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `voicedesk-${timestamp}.mp3`;

      const response = await invoke<ApiResponse<string>>('save_audio_file', {
        base64Audio: audioData,
        defaultFilename: filename,
      });

      if (response.success) {
        setSaveMessage('File saved successfully!');
        setTimeout(() => setSaveMessage(null), 3000);
      } else if (response.error !== 'Save cancelled') {
        setSaveMessage(response.error || 'Failed to save file');
      }
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-player">
      <div className="audio-controls">
        <button className="control-button" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <button className="control-button" onClick={handleStop} title="Stop">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6H18V18H6V6Z" fill="currentColor" />
          </svg>
        </button>

        <div className="time-display">{formatTime(currentTime)}</div>

        <input
          type="range"
          className="seek-bar"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
        />

        <div className="time-display">{formatTime(duration)}</div>

        <button
          className="download-button"
          onClick={handleDownload}
          disabled={isSaving}
          title="Download MP3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z"
              fill="currentColor"
            />
          </svg>
          {isSaving ? 'Saving...' : 'Download'}
        </button>
      </div>

      {saveMessage && (
        <div className={saveMessage.includes('success') ? 'success-message' : 'error-message'}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
