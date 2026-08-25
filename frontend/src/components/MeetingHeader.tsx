import React from 'react';
import type { Meeting, Participant } from '../types';

interface MeetingHeaderProps {
  meeting: Meeting;
  participants: Participant[];
  onCopyLink?: () => void;
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  meeting,
  participants,
  onCopyLink,
}) => {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Meeting Info */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{meeting.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Started {formatTime(meeting.started_at || meeting.created_at)}
            </span>
          </div>
        </div>

        {/* Right: Meeting ID and Copy Button */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 px-4 py-2 rounded-lg">
            <p className="text-xs text-neutral-600">Meeting ID</p>
            <p className="font-mono font-bold text-neutral-900">{meeting.meeting_id}</p>
          </div>
          {onCopyLink && (
            <button
              onClick={onCopyLink}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              title="Copy meeting link"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a2 2 0 11-4 0 2 2 0 014 0zM15 16.5a2 2 0 11-4 0 2 2 0 014 0z" />
                <path d="M1.3 6.5h15.4a1.3 1.3 0 00-1.3-1.3H2.6A1.3 1.3 0 001.3 6.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingHeader;
