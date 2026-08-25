use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Meeting {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub meeting_id: String,
    pub host_id: String,
    pub status: String, // "active" or "ended"
    pub started_at: Option<DateTime<Utc>>,
    pub ended_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Meeting {
    pub fn new(title: String, description: Option<String>, host_id: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            title,
            description,
            meeting_id: Self::generate_meeting_id(),
            host_id,
            status: "active".to_string(),
            started_at: Some(now),
            ended_at: None,
            created_at: now,
            updated_at: now,
        }
    }

    pub fn generate_meeting_id() -> String {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        (0..6)
            .map(|_| {
                let idx = rng.gen_range(0..36);
                if idx < 10 {
                    (b'0' + idx as u8) as char
                } else {
                    (b'a' + (idx - 10) as u8) as char
                }
            })
            .collect()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Participant {
    pub id: String,
    pub user_id: String,
    pub name: String,
    pub meeting_id: String,
    pub is_host: bool,
    pub is_muted: bool,
    pub camera_on: bool,
    pub screen_sharing: bool,
    pub joined_at: DateTime<Utc>,
    pub left_at: Option<DateTime<Utc>>,
}

impl Participant {
    pub fn new(user_id: String, name: String, meeting_id: String, is_host: bool) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            user_id,
            name,
            meeting_id,
            is_host,
            is_muted: false,
            camera_on: true,
            screen_sharing: false,
            joined_at: Utc::now(),
            left_at: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub meeting_id: String,
    pub sender_id: String,
    pub sender_name: String,
    pub content: String,
    pub timestamp: DateTime<Utc>,
}

impl Message {
    pub fn new(
        meeting_id: String,
        sender_id: String,
        sender_name: String,
        content: String,
    ) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            meeting_id,
            sender_id,
            sender_name,
            content,
            timestamp: Utc::now(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: T,
}

impl<T> ApiResponse<T> {
    pub fn ok(data: T, message: String) -> Self {
        Self {
            success: true,
            message,
            data,
        }
    }

    pub fn error(message: String) -> Self
    where
        T: Default,
    {
        Self {
            success: false,
            message,
            data: T::default(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateMeetingRequest {
    pub title: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SendMessageRequest {
    pub content: String,
}
