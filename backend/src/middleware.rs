use actix_web::{HttpRequest, HttpResponse, body::BoxBody};
use log::warn;
use std::future::{ready, Ready};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures::future::LocalBoxFuture;

pub struct FirebaseAuthMiddleware;

impl<S, B> Transform<S, ServiceRequest> for FirebaseAuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<BoxBody>;
    type Error = Error;
    type InitError = ();
    type Transform = FirebaseAuthMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(FirebaseAuthMiddlewareService { service }))
    }
}

pub struct FirebaseAuthMiddlewareService<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for FirebaseAuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<BoxBody>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        // Skip auth for health check
        if req.path() == "/health" {
            let fut = self.service.call(req);
            return Box::pin(async move {
                let res = fut.await?;
                Ok(res.map_into_boxed_body())
            });
        }

        // Extract token from Authorization header
        let token = req
            .headers()
            .get("Authorization")
            .and_then(|h| h.to_str().ok())
            .and_then(|h| h.strip_prefix("Bearer "))
            .map(|s| s.to_string());

        match token {
            Some(token) => {
                // TODO: Verify Firebase token
                // For now, we'll accept any token
                req.extensions_mut().insert(token);
                let fut = self.service.call(req);
                Box::pin(async move {
                    let res = fut.await?;
                    Ok(res.map_into_boxed_body())
                })
            }
            None => {
                warn!("Missing authorization token");
                Box::pin(async move {
                    Ok(ServiceResponse::new(
                        req.into_parts().0,
                        HttpResponse::Unauthorized().json(serde_json::json!({
                            "success": false,
                            "message": "Missing authorization token"
                        })),
                    ).map_into_boxed_body())
                })
            }
        }
    }
}
