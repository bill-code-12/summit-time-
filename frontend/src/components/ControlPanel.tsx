import React from 'react';
import Button from './Button';

interface ControlPanelProps {
  isMuted: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  onMicToggle: () => void;
  onCameraToggle: () => void;
  onScreenShare: () => void;
  onChat: () => void;
  onEndCall: () => void;
  isHost?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isMuted,
  isCameraOn,
  isScreenSharing,
  onMicToggle,
  onCameraToggle,
  onScreenShare,
  onChat,
  onEndCall,
  isHost = false,
}) => {
  return (
    <div className="bg-neutral-900 border-t border-neutral-800 px-4 py-4 flex items-center justify-center gap-3 flex-wrap">
      {/* Microphone Control */}
      <Button
        variant={isMuted ? 'danger' : 'ghost'}
        size="lg"
        onClick={onMicToggle}
        className="text-white hover:bg-neutral-800"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.707 6.707a1 1 0 10-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293a1 1 0 00-1.414-1.414L10 9.586 6.707 6.707z" />
            </svg>
            Muted
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
              <path d="M5.5 9.643a5.5 5.5 0 019 0M9.171 4.313A2 2 0 0110.828 4h.344a2 2 0 011.657.657m0 0A2 2 0 0114 5.828v.344a2 2 0 01-.657 1.657m0 0a2 2 0 01-1.657.657h-.344a2 2 0 01-1.657-.657m0 0A2 2 0 006 5.828v-.344a2 2 0 01.657-1.657" />
            </svg>
            Mic
          </>
        )}
      </Button>

      {/* Camera Control */}
      <Button
        variant={!isCameraOn ? 'danger' : 'ghost'}
        size="lg"
        onClick={onCameraToggle}
        className="text-white hover:bg-neutral-800"
        title={isCameraOn ? 'Camera On' : 'Camera Off'}
      >
        {!isCameraOn ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.707 6.707a1 1 0 10-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293a1 1 0 00-1.414-1.414L10 9.586 6.707 6.707z" />
            </svg>
            Camera Off
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            Camera
          </>
        )}
      </Button>

      {/* Screen Share */}
      <Button
        variant={isScreenSharing ? 'primary' : 'ghost'}
        size="lg"
        onClick={onScreenShare}
        className="text-white hover:bg-neutral-800"
        title="Share Screen"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
        </svg>
        Share Screen
      </Button>

      {/* Chat */}
      <Button
        variant="ghost"
        size="lg"
        onClick={onChat}
        className="text-white hover:bg-neutral-800"
        title="Chat"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
        </svg>
        Chat
      </Button>

      {/* End Call - Always Red */}
      <div className="ml-auto">
        <Button
          variant="danger"
          size="lg"
          onClick={onEndCall}
          title={isHost ? 'End Meeting' : 'Leave Meeting'}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15.5 1.5a3 3 0 013 3v5.828a3 3 0 01-.883 2.117L15 13.172A9 9 0 105 5a3 3 0 013-3h7.5z" />
          </svg>
          {isHost ? 'End Meeting' : 'Leave'}
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
