use actix_web::{HttpResponse, body::BoxBody};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub success: bool,
    pub message: String,
}

impl ErrorResponse {
    pub fn unauthorized() -> HttpResponse<BoxBody> {
        HttpResponse::Unauthorized().json(ErrorResponse {
            success: false,
            message: "Unauthorized. Invalid or missing token.".to_string(),
        })
    }

    pub fn not_found(resource: &str) -> HttpResponse<BoxBody> {
        HttpResponse::NotFound().json(ErrorResponse {
            success: false,
            message: format!("{} not found", resource),
        })
    }

    pub fn bad_request(message: &str) -> HttpResponse<BoxBody> {
        HttpResponse::BadRequest().json(ErrorResponse {
            success: false,
            message: message.to_string(),
        })
    }

    pub fn internal_error() -> HttpResponse<BoxBody> {
        HttpResponse::InternalServerError().json(ErrorResponse {
            success: false,
            message: "Internal server error".to_string(),
        })
    }
}
