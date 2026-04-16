# Role System Design

## Overview

Three-role system: Patient (default), Doctor, Admin. Users register as patient, admin assigns roles. Same dashboard for all roles. Patients and doctors can run classification. Admin is read-only (management only).

## Roles

| Role | Register As | Can Do |
|------|-------------|--------|
| Patient | Default on registration | Classify (ML prediction), view own data/history |
| Doctor | Assigned by admin | Classify for patients, view all patients/predictions, add verdict on predictions |
| Admin | Assigned by admin | View everything (read-only), manage users (change role, delete) |

## Database Changes

### Migration 1: Add role to users

```php
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['patient', 'doctor', 'admin'])->default('patient')->after('email');
});
```

### Migration 2: Add verdict to predictions

```php
Schema::table('predictions', function (Blueprint $table) {
    $table->enum('doctor_verdict', ['Angina Pektoris', 'Bukan Angina Pektoris', 'Perlu Pemeriksaan Lanjut'])->nullable()->after('features_used');
    $table->text('doctor_notes')->nullable()->after('doctor_verdict');
    $table->foreignId('verdict_by')->nullable()->constrained('users')->nullOnDelete()->after('doctor_notes');
    $table->timestamp('verdict_at')->nullable()->after('verdict_by');
});
```

No new tables.

## Backend

### EnsureRole Middleware

New file: `app/Http/Middleware/EnsureRole.php`

```php
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! in_array($request->user()->role, $roles)) {
            abort(403);
        }
        return $next($request);
    }
}
```

Registered as `role` alias in `bootstrap/app.php`.

### User Model Changes

- Add `role` to `$fillable` and `casts()` (enum cast)
- Helper methods: `isPatient()`, `isDoctor()`, `isAdmin()`
- Relationship: `verdicts()` — hasMany Prediction where `verdict_by = user->id`

### Policy Updates

**PatientPolicy:**
- `view` — patient: own only. doctor/admin: any.
- `update`, `delete` — patient: own only. admin: any. doctor: deny.

**PredictionPolicy:**
- `view` — patient: own only. doctor/admin: any.
- `addVerdict` (new) — doctor only.

### Routes

```
# Existing — add role middleware
GET/POST /classify          → role:patient,doctor

# New — doctor verdict
POST /predictions/{prediction}/verdict → role:doctor

# New — admin user management
GET    /admin/users          → role:admin (index)
PATCH  /admin/users/{user}/role → role:admin (updateRole)
DELETE /admin/users/{user}   → role:admin (destroy)
```

### PredictionVerdictController

- `store(Request, Prediction)` — validate `doctor_verdict` (required, in:3 options) + `doctor_notes` (nullable, string, max:1000)
- Set `verdict_by`, `verdict_at`
- Policy: `addVerdict` — doctor only
- Redirect back with flash

### Admin/UserController

- `index()` — all users paginated (15), ordered by latest
- `updateRole(Request, User)` — validate role enum, update
- `destroy(User)` — delete user (cascades via foreign keys)

## Frontend

### TypeScript Types

`types/auth.ts` — add to User type:
```typescript
role: 'patient' | 'doctor' | 'admin';
```

### HandleInertiaRequests

Already shares `auth.user`. Ensure `role` is included in shared data (automatic via User model attribute).

### App Sidebar

Filter nav items by role:
- **Patient**: all current items
- **Doctor**: Home, About, Dashboard, Data Pasien, Mulai Klasifikasi, Riwayat Klasifikasi, Pengaturan
- **Admin**: same as doctor + "Manajemen Pengguna" linking to `/admin/users`

### Prediction Detail Page (`predictions/show.tsx`)

If user is doctor and no verdict exists:
- shadcn Select dropdown: "Angina Pektoris" / "Bukan Angina Pektoris" / "Perlu Pemeriksaan Lanjut"
- shadcn Textarea for notes (optional)
- Submit button: POST to `/predictions/{id}/verdict`

If verdict exists:
- Show verdict value as badge
- Show doctor name, notes, timestamp

### Admin Users Page (`admin/users/index.tsx`)

- shadcn Table: columns = name, email, role (badge), actions
- Role column: shadcn Select dropdown for role change (PATCH on change)
- Actions: delete button with shadcn AlertDialog confirmation
- Match existing page styling (same Tailwind patterns as patients/index.tsx)

### Read-only Handling

Admin: hide create/edit/classify buttons. Read-only access except user management.
Doctor: full access to classify, read-only on other patients' data, can add verdict.

## Files Summary

| Type | New | Modified |
|------|-----|----------|
| Migration | `add_role_to_users`, `add_verdict_to_predictions` | — |
| Middleware | `EnsureRole.php` | `bootstrap/app.php` |
| Model | — | `User.php` |
| Policy | — | `PatientPolicy.php`, `PredictionPolicy.php` |
| Controller | `PredictionVerdictController.php`, `Admin/UserController.php` | — |
| Routes | — | `web.php` |
| Frontend | `admin/users/index.tsx` | `app-sidebar.tsx`, `predictions/show.tsx`, `types/auth.ts` |

## Out of Scope

- Role selection at registration
- Permission tables / Spatie package
- Audit log
- Separate dashboards per role
- Email notifications for role changes
