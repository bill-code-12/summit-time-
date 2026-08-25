export default interface Participant {
  id: string;
  user_id: string;
  name: string;
  meeting_id: string;
  is_host: boolean;
  is_muted: boolean;
  camera_on: boolean;
  screen_sharing: boolean;
  joined_at: string;
  left_at?: string;
}
