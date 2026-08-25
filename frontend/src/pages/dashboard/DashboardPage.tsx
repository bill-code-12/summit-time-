import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useMeetingStore } from '../../store';
import { meetingsAPI } from '../../services/api';
import Button from '../../components/Button';
import type { Meeting } from '../../types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [meetingLoading, setMeetingLoading] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const response = await meetingsAPI.list();
      setMeetings(response.data.data);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle.trim()) return;

    setMeetingLoading(true);
    try {
      const response = await meetingsAPI.create(newMeetingTitle);
      const meeting = response.data.data;
      setMeetings([...meetings, meeting]);
      setNewMeetingTitle('');
      setShowCreateModal(false);
      navigate(`/meeting/${meeting.id}`);
    } catch (error) {
      console.error('Failed to create meeting:', error);
    } finally {
      setMeetingLoading(false);
    }
  };

  const handleJoinMeeting = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-neutral-600 mt-1">
                You have {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => setShowCreateModal(true)}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM11 7a1 1 0 11-2 0 1 1 0 012 0zM8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414-1.414l-2-2z" clipRule="evenodd" />
                </svg>
                New Meeting
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-8 w-8 mx-auto text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-neutral-600">Loading meetings...</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-neutral-300">
            <svg className="w-16 h-16 mx-auto text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No meetings yet</h3>
            <p className="text-neutral-600 mb-6">Create your first meeting to get started</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Meeting
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2 truncate">
                    {meeting.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-1">
                    ID: <span className="font-mono">{meeting.meeting_id}</span>
                  </p>
                  <p className="text-sm text-neutral-600 mb-4">
                    Created {new Date(meeting.created_at).toLocaleDateString()}
                  </p>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleJoinMeeting(meeting.id)}
                  >
                    Join Meeting
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900">Create New Meeting</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateMeeting} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  placeholder="e.g., Team Standup"
                  className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={meetingLoading}
                  className="flex-1"
                  disabled={!newMeetingTitle.trim()}
                >
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
