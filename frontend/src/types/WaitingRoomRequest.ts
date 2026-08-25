export default interface WaitingRoomRequest {
  id: string;
  meeting_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
}
