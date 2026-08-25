export default interface Meeting {
  id: string;
  title: string;
  description?: string;
  meeting_id: string;
  host_id: string;
  status: 'active' | 'ended';
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}
