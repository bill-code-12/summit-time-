use tokio_postgres::Client;
use deadpool_postgres::{Pool, Config, ManagerConfig, RecyclingMethod};
use std::sync::Arc;
use crate::models::{Meeting, Participant, Message};
use log::info;

#[derive(Clone)]
pub struct Database {
    pool: Arc<Pool>,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let mut cfg = Config::from_str(database_url)?;
        cfg.manager = Some(ManagerConfig {
            recycling_method: RecyclingMethod::Fast,
        });

        let pool = cfg.create_pool(None)?;
        info!("Database pool created");

        let db = Self {
            pool: Arc::new(pool),
        };

        // Run migrations
        db.run_migrations().await?;

        Ok(db)
    }

    async fn run_migrations(&self) -> Result<(), Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;

        // Create tables
        client.execute(
            "CREATE TABLE IF NOT EXISTS meetings (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                meeting_id TEXT NOT NULL UNIQUE,
                host_id TEXT NOT NULL,
                status TEXT NOT NULL,
                started_at TIMESTAMP,
                ended_at TIMESTAMP,
                created_at TIMESTAMP NOT NULL,
                updated_at TIMESTAMP NOT NULL
            )",
            &[],
        ).await?;

        client.execute(
            "CREATE TABLE IF NOT EXISTS participants (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                meeting_id TEXT NOT NULL,
                is_host BOOLEAN NOT NULL,
                is_muted BOOLEAN NOT NULL DEFAULT false,
                camera_on BOOLEAN NOT NULL DEFAULT true,
                screen_sharing BOOLEAN NOT NULL DEFAULT false,
                joined_at TIMESTAMP NOT NULL,
                left_at TIMESTAMP,
                FOREIGN KEY (meeting_id) REFERENCES meetings(id)
            )",
            &[],
        ).await?;

        client.execute(
            "CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                meeting_id TEXT NOT NULL,
                sender_id TEXT NOT NULL,
                sender_name TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP NOT NULL,
                FOREIGN KEY (meeting_id) REFERENCES meetings(id)
            )",
            &[],
        ).await?;

        info!("Database migrations completed");
        Ok(())
    }

    pub async fn create_meeting(&self, meeting: &Meeting) -> Result<(), Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        client.execute(
            "INSERT INTO meetings (id, title, description, meeting_id, host_id, status, started_at, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            &[&meeting.id, &meeting.title, &meeting.description, &meeting.meeting_id, &meeting.host_id, &meeting.status, &meeting.started_at, &meeting.created_at, &meeting.updated_at],
        ).await?;
        Ok(())
    }

    pub async fn get_meeting(&self, meeting_id: &str) -> Result<Option<Meeting>, Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        let rows = client.query(
            "SELECT id, title, description, meeting_id, host_id, status, started_at, ended_at, created_at, updated_at FROM meetings WHERE id = $1",
            &[&meeting_id],
        ).await?;

        Ok(rows.first().map(|row| Meeting {
            id: row.get(0),
            title: row.get(1),
            description: row.get(2),
            meeting_id: row.get(3),
            host_id: row.get(4),
            status: row.get(5),
            started_at: row.get(6),
            ended_at: row.get(7),
            created_at: row.get(8),
            updated_at: row.get(9),
        }))
    }

    pub async fn get_user_meetings(&self, user_id: &str) -> Result<Vec<Meeting>, Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        let rows = client.query(
            "SELECT id, title, description, meeting_id, host_id, status, started_at, ended_at, created_at, updated_at FROM meetings WHERE host_id = $1 ORDER BY created_at DESC",
            &[&user_id],
        ).await?;

        Ok(rows.iter().map(|row| Meeting {
            id: row.get(0),
            title: row.get(1),
            description: row.get(2),
            meeting_id: row.get(3),
            host_id: row.get(4),
            status: row.get(5),
            started_at: row.get(6),
            ended_at: row.get(7),
            created_at: row.get(8),
            updated_at: row.get(9),
        }).collect())
    }

    pub async fn add_participant(&self, participant: &Participant) -> Result<(), Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        client.execute(
            "INSERT INTO participants (id, user_id, name, meeting_id, is_host, joined_at) VALUES ($1, $2, $3, $4, $5, $6)",
            &[&participant.id, &participant.user_id, &participant.name, &participant.meeting_id, &participant.is_host, &participant.joined_at],
        ).await?;
        Ok(())
    }

    pub async fn get_participants(&self, meeting_id: &str) -> Result<Vec<Participant>, Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        let rows = client.query(
            "SELECT id, user_id, name, meeting_id, is_host, is_muted, camera_on, screen_sharing, joined_at, left_at FROM participants WHERE meeting_id = $1 AND left_at IS NULL",
            &[&meeting_id],
        ).await?;

        Ok(rows.iter().map(|row| Participant {
            id: row.get(0),
            user_id: row.get(1),
            name: row.get(2),
            meeting_id: row.get(3),
            is_host: row.get(4),
            is_muted: row.get(5),
            camera_on: row.get(6),
            screen_sharing: row.get(7),
            joined_at: row.get(8),
            left_at: row.get(9),
        }).collect())
    }

    pub async fn remove_participant(&self, meeting_id: &str, user_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        client.execute(
            "UPDATE participants SET left_at = NOW() WHERE meeting_id = $1 AND user_id = $2",
            &[&meeting_id, &user_id],
        ).await?;
        Ok(())
    }

    pub async fn end_meeting(&self, meeting_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        client.execute(
            "UPDATE meetings SET status = 'ended', ended_at = NOW() WHERE id = $1",
            &[&meeting_id],
        ).await?;
        Ok(())
    }

    pub async fn create_message(&self, message: &Message) -> Result<(), Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        client.execute(
            "INSERT INTO messages (id, meeting_id, sender_id, sender_name, content, timestamp) VALUES ($1, $2, $3, $4, $5, $6)",
            &[&message.id, &message.meeting_id, &message.sender_id, &message.sender_name, &message.content, &message.timestamp],
        ).await?;
        Ok(())
    }

    pub async fn get_messages(&self, meeting_id: &str) -> Result<Vec<Message>, Box<dyn std::error::Error>> {
        let client = self.pool.get().await?;
        let rows = client.query(
            "SELECT id, meeting_id, sender_id, sender_name, content, timestamp FROM messages WHERE meeting_id = $1 ORDER BY timestamp ASC",
            &[&meeting_id],
        ).await?;

        Ok(rows.iter().map(|row| Message {
            id: row.get(0),
            meeting_id: row.get(1),
            sender_id: row.get(2),
            sender_name: row.get(3),
            content: row.get(4),
            timestamp: row.get(5),
        }).collect())
    }
}
