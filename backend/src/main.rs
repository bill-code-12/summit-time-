use actix_web::{web, App, HttpServer, middleware, error};
use actix_cors::Cors;
use dotenv::dotenv;
use std::env;
use log::info;

mod handlers;
mod models;
mod services;
mod middleware as custom_middleware;
mod db;
mod errors;
mod websocket;

use db::Database;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Get environment variables
    let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let server_port: u16 = env::var("SERVER_PORT")
        .unwrap_or_else(|_| "8000".to_string())
        .parse()
        .expect("SERVER_PORT must be a valid u16");
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let firebase_project_id = env::var("FIREBASE_PROJECT_ID").expect("FIREBASE_PROJECT_ID must be set");

    // Initialize database
    let db = Database::new(&database_url)
        .await
        .expect("Failed to initialize database");

    info!("Starting Summit Time API on {}:{}", server_host, server_port);
    info!("Firebase Project: {}", firebase_project_id);

    // Start HTTP server
    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://localhost:5173")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec!["Content-Type", "Authorization"])
            .supports_credentials();

        App::new()
            .app_data(web::Data::new(db.clone()))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .wrap(custom_middleware::FirebaseAuthMiddleware)
            // Health check
            .route("/health", web::get().to(handlers::health::health_check))
            // Meetings routes
            .service(
                web::scope("/api/meetings")
                    .route("", web::post().to(handlers::meetings::create_meeting))
                    .route("", web::get().to(handlers::meetings::list_meetings))
                    .route("/{meeting_id}", web::get().to(handlers::meetings::get_meeting))
                    .route("/{meeting_id}/join", web::post().to(handlers::meetings::join_meeting))
                    .route("/{meeting_id}/leave", web::post().to(handlers::meetings::leave_meeting))
                    .route("/{meeting_id}/end", web::post().to(handlers::meetings::end_meeting))
                    .route("/{meeting_id}/participants", web::get().to(handlers::meetings::get_participants))
                    .route("/{meeting_id}/messages", web::get().to(handlers::messages::get_messages))
                    .route("/{meeting_id}/messages", web::post().to(handlers::messages::send_message))
            )
            // WebSocket route
            .route("/ws/{meeting_id}", web::get().to(websocket::ws_handler))
    })
    .bind(format!("{}:{}", server_host, server_port))?
    .run()
    .await
}
