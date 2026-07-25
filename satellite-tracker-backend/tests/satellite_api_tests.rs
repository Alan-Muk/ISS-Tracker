use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use tower::ServiceExt;

use satellite_tracker_backend::{routes::create_router, state::AppState};

#[tokio::test]
async fn satellites_endpoint_returns_ok() {
    let state = AppState::new();

    let app = create_router(state);

    let response = app
        .oneshot(
            Request::builder()
                .uri("/satellites")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}
