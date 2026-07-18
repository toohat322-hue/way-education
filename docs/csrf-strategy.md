# CSRF Strategy

## Architecture

This project uses cookie-based authentication for the admin dashboard. Because the frontend is a Single Page Application (SPA) that communicates with the backend API (`/api/*`), we use an HTTP-only cookie to store the JWT refresh token and a short-lived access token.

This makes the application immune to XSS token theft but exposes it to Cross-Site Request Forgery (CSRF).

## Protection Mechanisms

To defend against CSRF, we use a two-layered approach instead of traditional synchronizer tokens.

### 1. SameSite Cookies

Our auth cookies (`accessToken`, `refreshToken`) are configured with:

- `SameSite: "strict"` (Admin Flow)
- `HttpOnly: true`

This means the browser will **not** send the authentication cookies if a cross-origin site initiates a request to our API (e.g., via a hidden form submission or malicious link).

### 2. Custom Header Validation (X-Requested-With)

For defense-in-depth, especially against legacy browser behavior or scenarios where `SameSite` might be insufficient, we use the `CsrfGuard`.

**How it works:**
- Modern browsers enforce a strict Same-Origin Policy (SOP).
- Cross-origin requests (like a `<form>` submission from `evil.com` to our API) can be triggered, but browsers will **not** allow custom headers to be attached to those requests unless explicitly permitted by CORS.
- Our frontend (`lib/api.js`) automatically attaches `X-Requested-With: XMLHttpRequest` to every API call.
- Our backend `CsrfGuard` intercepts all mutating methods (`POST`, `PUT`, `PATCH`, `DELETE`).
- If the `X-Requested-With` header is missing, the request is rejected with a `403 Forbidden`.

### Why this is sufficient

Because a malicious site cannot force a victim's browser to send the `X-Requested-With` custom header, any cross-site request forgery attempt will lack this header and be rejected by the backend guard, even if the cookies were somehow sent.

## Testing

When testing API endpoints via tools like Postman or Curl, you must explicitly include the header:

```bash
curl -X POST http://localhost:8000/api/cms/universities \
  -H "X-Requested-With: XMLHttpRequest" \
  -H "Content-Type: application/json" \
  -b "accessToken=..." \
  -d '{"name": "Test"}'
```
