# Backend auth migration (phase 1)

This project now uses server-backed admin authentication only.

## Frontend switch

1. Create `.env` from `.env.example`.
2. Set:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

3. Start frontend and backend.
4. Visit `/admin`.

The frontend uses these endpoints:

- `GET /api/auth/me` -> `200` when authenticated, `401` otherwise
- `POST /api/auth/login` with JSON `{ "password": "..." }` -> `200` on success, `401/422` on failure
- `POST /api/auth/logout` -> `204/200`

All requests use `credentials: include` so cookie-based sessions (e.g. Laravel Sanctum) work.

## Minimal Laravel contract

Example routes (adapt to your auth strategy):

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', function (Request $request) {
    $request->validate(['password' => ['required', 'string']]);

    $ok = hash_equals(config('admin.password'), (string) $request->password);
    if (! $ok) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    Auth::loginUsingId(1); // replace with real admin user flow
    $request->session()->regenerate();

    return response()->json(['ok' => true]);
});

Route::get('/auth/me', function (Request $request) {
    return $request->user()
        ? response()->json(['id' => $request->user()->id])
        : response()->json(['message' => 'Unauthenticated'], 401);
});

Route::post('/auth/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->noContent();
});
```

## Security checklist

- Keep admin credentials out of frontend bundles.
- Enable HTTPS and secure cookies.
- Apply CSRF protection for session-auth POST routes.
- Restrict admin routes with authorization middleware/policies.
- Add server-side validation for all write endpoints.
