# Laravel backend reference (not wired up)

This app has **no backend today** — the admin dashboard persists everything
(universities, programs, majors, FAQs) to the browser's `localStorage` via
`src/admin/DataContext.jsx` / `src/admin/storage.js`. Image "uploads" in
`src/admin/ImageUploadField.jsx` (single cover/logo image) and
`src/admin/GalleryUploadField.jsx` (multi-photo gallery, with drag & drop,
per-photo replace/delete, and client-side type/size validation) just resize
the file and inline it as a data URL (see `src/admin/imageUpload.js`).

This document is a **reference** for when/if a real backend gets built. None
of the code below is imported or run by this repo — it's a starting point to
copy into an actual Laravel project. The React side would need real changes
(see "Frontend integration" at the bottom) to talk to it.

## 1. Migrations

```php
// database/migrations/2026_01_01_000000_create_universities_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // maps to the frontend "id" (e.g. "iau")
            $table->string('name');
            $table->string('cover_image_path')->nullable();
            $table->string('logo_path')->nullable();
            $table->json('gallery')->nullable(); // array of storage paths/URLs

            $table->string('city_en');
            $table->string('city_ar');
            $table->string('country_en'); // "Türkiye" | "N. Cyprus"
            $table->string('country_ar');
            $table->string('type_en');    // "Public" | "Private"
            $table->string('type_ar');

            $table->unsignedInteger('tuition');       // $/yr
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('reviews')->default(0);
            $table->unsignedInteger('ranking')->nullable();
            $table->string('founded')->nullable();
            $table->string('students_count')->nullable();
            $table->string('intl_students')->nullable();
            $table->string('language_en')->nullable();
            $table->string('language_ar')->nullable();
            $table->unsignedTinyInteger('scholarship')->default(0); // %
            $table->string('gpa_req')->nullable();

            $table->text('about_en')->nullable();
            $table->text('about_ar')->nullable();
            $table->json('docs_en')->nullable(); // array of required-document strings
            $table->json('docs_ar')->nullable();

            // Contact information
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_website')->nullable();

            // Social media links
            $table->string('social_facebook')->nullable();
            $table->string('social_instagram')->nullable();
            $table->string('social_linkedin')->nullable();

            // Admin toggles
            $table->boolean('featured')->default(false);
            $table->boolean('active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
```

```php
// database/migrations/2026_01_01_000001_create_programs_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Separate table (not a JSON column) specifically so programs get
        // real CRUD endpoints -- add/edit/delete/reorder without rewriting
        // the whole university record each time.
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained()->cascadeOnDelete();
            $table->string('name_en');
            $table->string('name_ar');
            $table->unsignedInteger('fee'); // $/yr
            $table->string('icon_name')->default('GraduationCap'); // matches src/admin/iconRegistry.js
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
```

## 2. Models

```php
// app/Models/University.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    protected $fillable = [
        'slug', 'name', 'cover_image_path', 'logo_path', 'gallery',
        'city_en', 'city_ar', 'country_en', 'country_ar', 'type_en', 'type_ar',
        'tuition', 'rating', 'reviews', 'ranking', 'founded',
        'students_count', 'intl_students', 'language_en', 'language_ar',
        'scholarship', 'gpa_req', 'about_en', 'about_ar', 'docs_en', 'docs_ar',
        'contact_phone', 'contact_email', 'contact_website',
        'social_facebook', 'social_instagram', 'social_linkedin',
        'featured', 'active',
    ];

    protected $casts = [
        'gallery' => 'array',
        'docs_en' => 'array',
        'docs_ar' => 'array',
        'featured' => 'boolean',
        'active' => 'boolean',
        'rating' => 'float',
    ];

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class)->orderBy('sort_order');
    }

    // Public-facing queries should always go through this scope -- mirrors
    // `publicUniversities` in src/admin/DataContext.jsx on the frontend.
    public function scopePublic($query)
    {
        return $query->where('active', true)->orderByDesc('featured');
    }
}
```

```php
// app/Models/Program.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Program extends Model
{
    protected $fillable = ['name_en', 'name_ar', 'fee', 'icon_name', 'sort_order'];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }
}
```

## 3. Form request validation

```php
// app/Http/Requests/UniversityRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UniversityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage-universities') ?? false;
    }

    public function rules(): array
    {
        // `sometimes` on update (PATCH) vs required on create (POST) -- adjust
        // per-route if you want stricter create-only requirements.
        return [
            'name' => ['required', 'string', 'max:255'],
            'city_en' => ['required', 'string'],
            'city_ar' => ['required', 'string'],
            'country_en' => ['required', 'in:Türkiye,N. Cyprus'],
            'type_en' => ['required', 'in:Public,Private'],
            'tuition' => ['required', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'scholarship' => ['nullable', 'integer', 'between:0,100'],

            'contact_phone' => ['nullable', 'string', 'max:30'],
            'contact_email' => ['nullable', 'email'],
            'contact_website' => ['nullable', 'url'],
            'social_facebook' => ['nullable', 'url'],
            'social_instagram' => ['nullable', 'url'],
            'social_linkedin' => ['nullable', 'url'],

            'featured' => ['boolean'],
            'active' => ['boolean'],
        ];
    }
}
```

## 4. Controllers

```php
// app/Http/Controllers/Api/UniversityController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UniversityRequest;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UniversityController extends Controller
{
    // Admin dashboard lists everything; public site should call a separate
    // route (or pass ?public=1) that applies University::public().
    public function index(Request $request)
    {
        $query = University::with('programs');
        if ($request->boolean('public')) {
            $query->public();
        }
        return $query->get();
    }

    public function store(UniversityRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $university = University::create($data);
        return response()->json($university, 201);
    }

    public function show(University $university)
    {
        return $university->load('programs');
    }

    public function update(UniversityRequest $request, University $university)
    {
        $university->update($request->validated());
        return $university->fresh('programs');
    }

    public function destroy(University $university)
    {
        $university->delete();
        return response()->noContent();
    }
}
```

```php
// app/Http/Controllers/Api/ProgramController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\University;
use Illuminate\Http\Request;

// Nested under a university: /api/universities/{university}/programs
// This is the CRUD surface for "available programs" -- add/edit/delete.
class ProgramController extends Controller
{
    public function store(Request $request, University $university)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string'],
            'name_ar' => ['required', 'string'],
            'fee' => ['required', 'integer', 'min:0'],
            'icon_name' => ['nullable', 'string'],
        ]);
        $program = $university->programs()->create($data);
        return response()->json($program, 201);
    }

    public function update(Request $request, University $university, Program $program)
    {
        $data = $request->validate([
            'name_en' => ['sometimes', 'string'],
            'name_ar' => ['sometimes', 'string'],
            'fee' => ['sometimes', 'integer', 'min:0'],
            'icon_name' => ['sometimes', 'string'],
        ]);
        $program->update($data);
        return $program;
    }

    public function destroy(University $university, Program $program)
    {
        $program->delete();
        return response()->noContent();
    }
}
```

```php
// app/Http/Controllers/Api/UploadController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// Real equivalent of src/admin/imageUpload.js's client-side resize: here the
// file actually lands on disk/S3 and the response URL is what gets saved on
// the university (cover_image_path / logo_path), instead of a data: URL.
class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'], // 5MB
        ]);

        $path = $request->file('image')->store('universities', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
        ], 201);
    }
}
```

## 5. Routes

```php
// routes/api.php
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\UniversityController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('universities', UniversityController::class);
    Route::apiResource('universities.programs', ProgramController::class)
        ->shallow() // /programs/{program} for update/destroy instead of nested
        ->except(['index', 'show']);
    Route::post('uploads', UploadController::class . '@store');
});

// Public, read-only, no auth -- what the marketing site would actually fetch.
Route::get('public/universities', function () {
    return \App\Models\University::public()->with('programs')->get();
});
```

## 6. Gallery images (dedicated table + real file storage)

`src/admin/GalleryUploadField.jsx` manages a whole gallery of photos with its
own add/replace/delete actions, so on the backend it deserves the same
treatment as `programs` above: a real table with its own rows and IDs (not a
JSON array column on `universities`), and files that land in
`storage/app/public` instead of being inlined as data URLs.

```php
// database/migrations/2026_01_01_000002_create_gallery_images_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained()->cascadeOnDelete();
            $table->string('disk')->default('public');
            $table->string('path'); // e.g. "universities/3/gallery/xyz123.jpg"
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
    }
};
```

```php
// app/Models/GalleryImage.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class GalleryImage extends Model
{
    protected $fillable = ['disk', 'path', 'sort_order'];

    // Lets API responses include a ready-to-use <img src> without the
    // frontend having to know the storage disk/URL scheme.
    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }
}
```

Add `public function galleryImages() { return $this->hasMany(GalleryImage::class)->orderBy('sort_order'); }`
to `University` (alongside the existing `programs()` relation from section 2).

```php
// app/Http/Controllers/Api/GalleryImageController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

// Nested under a university: /api/universities/{university}/gallery-images
// CUSTOMIZE:
//   - Storage path: change the `store()` call's first argument
//     ("universities/{$university->id}/gallery") to reorganize files on disk.
//   - Validation rules: `mimes:jpg,jpeg,png,webp` and `max:5120` (KB) mirror
//     ALLOWED_IMAGE_TYPES / ALLOWED_MAX_SIZE_MB in src/admin/imageUpload.js --
//     keep both sides in sync if you change the limit.
//   - Disk: swap 'public' for 's3' (with the S3 filesystem configured in
//     config/filesystems.php) to serve images from cloud storage instead of
//     the app server's local disk.
class GalleryImageController extends Controller
{
    // Supports uploading several files in one request (matches
    // GalleryUploadField's drag-and-drop-many-at-once UX): send as
    // multipart/form-data with repeated "images[]" fields.
    public function store(Request $request, University $university)
    {
        $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $created = collect($request->file('images'))->map(function ($file) use ($university) {
            $path = $file->store("universities/{$university->id}/gallery", 'public');
            return $university->galleryImages()->create(['disk' => 'public', 'path' => $path]);
        });

        return response()->json($created, 201);
    }

    // "Edit" = replace the file behind an existing gallery entry, keeping its
    // id/sort_order -- mirrors the per-thumbnail "Replace" button in
    // GalleryUploadField.jsx, which is the same interaction, not a separate
    // add + delete.
    public function update(Request $request, University $university, GalleryImage $galleryImage)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        Storage::disk($galleryImage->disk)->delete($galleryImage->path);
        $path = $request->file('image')->store("universities/{$university->id}/gallery", 'public');
        $galleryImage->update(['path' => $path]);

        return $galleryImage;
    }

    public function destroy(University $university, GalleryImage $galleryImage)
    {
        Storage::disk($galleryImage->disk)->delete($galleryImage->path);
        $galleryImage->delete();
        return response()->noContent();
    }
}
```

```php
// routes/api.php (add alongside the group from section 5)
use App\Http\Controllers\Api\GalleryImageController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('universities/{university}/gallery-images', [GalleryImageController::class, 'store']);
    Route::post('gallery-images/{galleryImage}', [GalleryImageController::class, 'update']); // POST not PATCH: multipart file uploads
    Route::delete('gallery-images/{galleryImage}', [GalleryImageController::class, 'destroy']);
});
```

Don't forget `php artisan storage:link` (once, per environment) so
`storage/app/public` is actually reachable at `/storage/...` URLs -- without
it, the `url` accessor on `GalleryImage` points at files the web server
can't serve.

## Frontend integration (what would actually need to change here)

This repo's admin already has the right shape for this swap — `useData()`
(`src/admin/useData.js`) is the single seam every component reads/writes
through. To go from localStorage to this API:

1. In `src/admin/DataContext.jsx`, replace the `useCollection` localStorage
   logic with `fetch("/api/universities")` in a `useEffect`, and make
   `addUniversity`/`updateUniversity`/`removeUniversity` `async` functions
   that `POST`/`PATCH`/`DELETE` to the API instead of calling `saveOverride`.
   Every component calling `useData()` stays the same.
2. In `src/admin/ImageUploadField.jsx`, swap `fileToResizedDataUrl` (in
   `src/admin/imageUpload.js`) for a `fetch("/api/uploads", { method: "POST", body: formData })`
   call that returns `{ url }` -- the component's `onChange(url)` call site
   doesn't need to change, only what produces the string.
3. Program add/edit/delete in `UniversityFormModal.jsx` (`addMajorRow` /
   `updateMajorRow` / `removeMajorRow`) would call the new
   `/api/universities/{id}/programs` endpoints instead of mutating local
   form state directly -- or keep mutating local state and only sync to the
   API on the form's final "Save changes" submit, matching the current
   "edit everything, save once" UX.
4. Add loading/error states around these `fetch` calls -- today's
   `useCollection` is synchronous (reads localStorage instantly), a real API
   introduces network latency and failure modes the current code doesn't
   have to handle.
5. In `src/admin/GalleryUploadField.jsx`, `processFiles`/`handleReplaceInputChange`
   currently call `fileToResizedDataUrl` directly and push the result straight
   into local form state. With this backend, `processFiles` would instead
   `POST` a `FormData` of the accepted files to
   `/api/universities/{id}/gallery-images`, `removeAt` would `DELETE
   /api/gallery-images/{id}`, and the "Replace" flow would `POST` to
   `/api/gallery-images/{id}`. The component's client-side `validateImageFile`
   check can stay as an instant UX check -- keep the server-side validation
   in `GalleryImageController` too, since client-side checks are trivially
   bypassable.
