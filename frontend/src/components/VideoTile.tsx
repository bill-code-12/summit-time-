import React from 'react';
import type { Participant } from '../types';

interface VideoTileProps {
  participant: Participant;
  isLocal?: boolean;
  isMuted?: boolean;
  isCameraOff?: boolean;
  onMute?: () => void;
  onUnmute?: () => void;
  onCameraToggle?: () => void;
}

const VideoTile: React.FC<VideoTileProps> = ({
  participant,
  isLocal = false,
  isMuted = false,
  isCameraOff = false,
  onMute,
  onUnmute,
  onCameraToggle,
}) => {
  return (
    <div className="relative w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden group">
      {/* Video Stream */}
      {!isCameraOff ? (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {participant.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-white font-semibold text-sm">{participant.name}</p>
          </div>
        </div>
      )}

      {/* Overlay with participant info and controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="truncate">
              <p className="text-white font-semibold text-sm">{participant.name}</p>
              {isLocal && <span className="text-xs text-primary-300">(You)</span>}
            </div>
          </div>
          <div className="flex gap-1">
            {isMuted && (
              <div className="bg-red-500 text-white rounded-full p-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.707 6.707a1 1 0 10-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293a1 1 0 00-1.414-1.414L10 9.586 6.707 6.707z" />
                </svg>
              </div>
            )}
            {isCameraOff && (
              <div className="bg-red-500 text-white rounded-full p-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screen sharing indicator */}
      {participant.screen_sharing && (
        <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold">
          🖥️ Sharing
        </div>
      )}
    </div>
  );
};

export default VideoTile;
