pub mod health {
    use actix_web::HttpResponse;
    use serde_json::json;

    pub async fn health_check() -> HttpResponse {
        HttpResponse::Ok().json(json!({
            "status": "ok",
            "message": "Summit Time API is running"
        }))
    }
}

pub mod meetings {
    use actix_web::{web, HttpRequest, HttpResponse};
    use crate::models::{Meeting, CreateMeetingRequest, ApiResponse, Participant};
    use crate::db::Database;
    use crate::errors::ErrorResponse;

    pub async fn create_meeting(
        req: HttpRequest,
        db: web::Data<Database>,
        body: web::Json<CreateMeetingRequest>,
    ) -> HttpResponse {
        // Get user ID from token (stored in extensions)
        let user_id = match req.extensions().get::<String>() {
            Some(token) => "user_from_token".to_string(), // TODO: Extract from Firebase token
            None => return ErrorResponse::unauthorized(),
        };

        let meeting = Meeting::new(
            body.title.clone(),
            body.description.clone(),
            user_id,
        );

        match db.create_meeting(&meeting).await {
            Ok(_) => HttpResponse::Created().json(ApiResponse::ok(
                meeting,
                "Meeting created successfully".to_string(),
            )),
            Err(_) => ErrorResponse::internal_error(),
        }
    }

    pub async fn list_meetings(
        req: HttpRequest,
        db: web::Data<Database>,
    ) -> HttpResponse {
        // Get user ID from token
        let user_id = match req.extensions().get::<String>() {
            Some(token) => "user_from_token".to_string(),
            None => return ErrorResponse::unauthorized(),
        };

        match db.get_user_meetings(&user_id).await {
            Ok(meetings) => HttpResponse::Ok().json(ApiResponse::ok(
                meetings,
                "Meetings retrieved successfully".to_string(),
            )),
            Err(_) => ErrorResponse::internal_error(),
        }
    }

    pub async fn get_meeting(
        _req: HttpRequest,
        db: web::Data<Database>,
        path: web::Path<String>,
    ) -> HttpResponse {
        let meeting_id = path.into_inner();

        match db.get_meeting(&meeting_id).await {
            Ok(Some(meeting)) => HttpResponse::Ok().json(ApiResponse::ok(
                meeting,
                "Meeting retrieved successfully".to_string(),
            )),
            Ok(None) => ErrorResponse::not_found("Meeting"),
            Err(_) => ErrorResponse::internal_error(),
        }
    }

    pub async fn join_meeting(
        req: HttpRequest,
        db: web::Data<Database>,
        path: web::Path<String>,
    ) -> HttpResponse {
        let meeting_id = path.into_inner();
        let user_id = "user_from_token".to_string(); // TODO: Extract from Firebase token

        let participant = Participant::new(
            user_id,
            "User Name".to_string(), // TODO: Get from Firebase
            meeting_id.clone(),
            false,
        );

        match db.add_participant(&participant).await {
            Ok(_) => HttpResponse::Ok().json(ApiResponse::ok(
                participant,
                "Joined meeting successfully".to_string(),
            )),
            Err(_) => ErrorResponse::internal_error(),
        }
    }

    pub async fn leave_meeting(
        _req: HttpRequest,
        db: web::Data<Database>,
        path: web::Path<String>,
    ) -> HttpResponse {
        let meeting_id = path.into_inner();
        let user_id = "user_from_token".to_string();

        match db.remove_participant(&meeting_id, &user_id).await {
            Ok(_) => HttpResponse::Ok().json(ApiResponse::ok(
                serde_json::json!({}),
                "Left meeting successfully".to_string(),
            )),
            Err(_) => ErrorResponse::internal_error(),
        }
    }

    pub async fn end_meeting(
        _req: HttpRequest,
        db: web::Data<Database>,
        path: web::Path<String>,
    ) -> HttpResponse {
        let meeting_id = path.into_inner();

        match db.end_meeting(&meeting_id).await {
            Ok(_) => HttpResponse::Ok().json(ApiResponse::ok(
                serde_json::json!({}),
                "Meeting ended successfully".to_string(),
            )),
            Err(_) => ErrorResponse::internal_error(),
        }
    }

    pub async fn get_participants(
        _req: HttpRequest,
        db: web::Data<Database>,
        path: web::Path<String>,
    ) -> HttpResponse {
        let meeting_id = path.into_inner();

        match db.get_participants(&meeting_id).await {
            Ok(participants) => HttpResponse::Ok().json(ApiResponse::ok(
                participants,
                "Participants retrieved successfully".to_string(),
            )),
            Err(_) => ErrorResponse::internal_error(),
        }
    }
}

pub mod messages {
    use actix_web::{web, HttpRequest, HttpResponse};
    use crate::models::{Message, SendMessageRequest, ApiResponse};
    use crate::db::Database;
    use crate::errors::ErrorResponse;

    pub async fn get_messages(
        _req: HttpRequest,
        db: web::Data<Database>,
        path: web::Path<String>,
    ) -> HttpResponse {
        let meeting_id = path.into_inner();

        match db.get_messages(&meeting_id).await {
            Ok(messages) => HttpResponse::Ok().json(ApiResponse::ok(
                messages,
                "Messages retrieved successfully".to_string(),
            )),
            Err(_) => ErrorResponse::internal_error(),
        }
    }

    pub async fn send_message(
        req: HttpRequest,
        db: web::Data<Database>,
        path: web::Path<String>,
        body: web::Json<SendMessageRequest>,
    ) -> HttpResponse {
        let meeting_id = path.into_inner();
        let sender_id = "user_from_token".to_string();
        let sender_name = "User Name".to_string();

        let message = Message::new(
            meeting_id,
            sender_id,
            sender_name,
            body.content.clone(),
        );

        match db.create_message(&message).await {
            Ok(_) => HttpResponse::Created().json(ApiResponse::ok(
                message,
                "Message sent successfully".to_string(),
            )),
            Err(_) => ErrorResponse::internal_error(),
        }
    }
}
