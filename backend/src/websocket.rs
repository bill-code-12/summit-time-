use actix_web::{web, HttpRequest, HttpResponse};
use actix_ws::AggregatedMessage;
use log::info;

pub async fn ws_handler(
    req: HttpRequest,
    stream: web::Payload,
    path: web::Path<String>,
) -> Result<HttpResponse, actix_web::Error> {
    let meeting_id = path.into_inner();
    info!("WebSocket connection for meeting: {}", meeting_id);

    let (res, session, _stream) = actix_ws::handle(&req, stream)?;

    actix_rt::spawn(async move {
        // Handle WebSocket messages for video signaling
        // TODO: Implement WebRTC signaling
    });

    Ok(res)
}
