import React from 'react';
import type { WaitingRoomRequest } from '../types';
import Button from './Button';

interface WaitingRoomProps {
  requests: WaitingRoomRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  requests,
  onApprove,
  onReject,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Waiting Room</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Requests List */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {requests.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">
              No one waiting to join
            </p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">
                    {request.user_name}
                  </p>
                  <p className="text-sm text-neutral-600 truncate">
                    {request.user_email}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Requested {new Date(request.requested_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onApprove(request.id)}
                    title="Approve"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onReject(request.id)}
                    title="Reject"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
