import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore, useMeetingStore } from '../../store';
import { meetingsAPI, messagesAPI } from '../../services/api';
import {
  VideoTile,
  ControlPanel,
  ChatPanel,
  MeetingHeader,
  WaitingRoom,
} from '../../components';
import type { Meeting, Participant, Message } from '../../types';

const MeetingPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentMeeting, setCurrentMeeting, participants, addMessage, setMessages } = useMeetingStore();

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [waitingRoomOpen, setWaitingRoomOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMeetingData();
  }, [meetingId]);

  const fetchMeetingData = async () => {
    try {
      if (!meetingId) return;

      const [meetingRes, participantsRes, messagesRes] = await Promise.all([
        meetingsAPI.get(meetingId),
        meetingsAPI.getParticipants(meetingId),
        messagesAPI.getMessages(meetingId),
      ]);

      setCurrentMeeting(meetingRes.data.data);
      setMessages(messagesRes.data.data);
    } catch (error) {
      console.error('Failed to fetch meeting data:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!meetingId) return;
    try {
      const response = await messagesAPI.sendMessage(meetingId, content);
      addMessage(response.data.data);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLeaveMeeting = async () => {
    if (!meetingId) return;
    try {
      await meetingsAPI.leave(meetingId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to leave meeting:', error);
    }
  };

  const handleEndMeeting = async () => {
    if (!meetingId) return;
    try {
      await meetingsAPI.end(meetingId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to end meeting:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-neutral-900">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!currentMeeting) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-neutral-900">
        <div className="text-center text-white">
          <p className="text-lg">Meeting not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-neutral-900">
      {/* Meeting Header */}
      <MeetingHeader meeting={currentMeeting} participants={participants} />

      {/* Video Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
          {/* Local Video */}
          <VideoTile
            participant={{
              id: 'local',
              name: user?.name || 'You',
              meeting_id: currentMeeting.id,
              user_id: user?.id || '',
              joined_at: new Date().toISOString(),
              is_host: currentMeeting.host_id === user?.id,
              is_muted: isMuted,
              camera_on: isCameraOn,
              screen_sharing: isScreenSharing,
            }}
            isLocal
            isMuted={isMuted}
            isCameraOff={!isCameraOn}
          />

          {/* Remote Videos */}
          {participants.map((participant) => (
            <VideoTile
              key={participant.id}
              participant={participant}
              isMuted={participant.is_muted}
              isCameraOff={!participant.camera_on}
            />
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel
        isMuted={isMuted}
        isCameraOn={isCameraOn}
        isScreenSharing={isScreenSharing}
        onMicToggle={() => setIsMuted(!isMuted)}
        onCameraToggle={() => setIsCameraOn(!isCameraOn)}
        onScreenShare={() => setIsScreenSharing(!isScreenSharing)}
        onChat={() => setChatOpen(!chatOpen)}
        onEndCall={currentMeeting.host_id === user?.id ? handleEndMeeting : handleLeaveMeeting}
        isHost={currentMeeting.host_id === user?.id}
      />

      {/* Chat Panel */}
      <ChatPanel
        messages={[]}
        currentUserId={user?.id || ''}
        onSendMessage={handleSendMessage}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* Waiting Room */}
      <WaitingRoom
        requests={[]}
        onApprove={() => {}}
        onReject={() => {}}
        isOpen={waitingRoomOpen}
        onClose={() => setWaitingRoomOpen(false)}
      />
    </div>
  );
};

export default MeetingPage;
