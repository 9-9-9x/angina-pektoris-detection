# Role System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three-role system (Patient, Doctor, Admin) with role-based navigation, doctor verdicts, and admin user management.

**Architecture:** Enum column on users table, single EnsureRole middleware, updated policies for role-aware authorization. Doctor verdict stored as columns on predictions table. Frontend filters sidebar by role, shows verdict form for doctors, shows user management for admins.

**Tech Stack:** Laravel 12, Inertia.js v2, React 19, TypeScript, shadcn/ui, Tailwind CSS

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `database/migrations/2026_04_16_000001_add_role_to_users_table.php` | Add role enum column |
| `database/migrations/2026_04_16_000002_add_verdict_to_predictions_table.php` | Add doctor verdict columns |
| `app/Http/Middleware/EnsureRole.php` | Check user role against allowed roles |
| `app/Http/Controllers/PredictionVerdictController.php` | Handle doctor verdict submission |
| `app/Http/Controllers/Admin/UserController.php` | Admin user management (list, role change, delete) |
| `resources/js/pages/admin/users/index.tsx` | Admin user management page |

### Modified Files
| File | Change |
|------|--------|
| `bootstrap/app.php` | Register `role` middleware alias |
| `app/Models/User.php` | Add role to fillable/casts, add helper methods, add verdicts relationship |
| `app/Models/Prediction.php` | Add verdict fillable/casts, add verdictBy relationship |
| `app/Policies/PatientPolicy.php` | Role-aware view/update/delete |
| `app/Policies/PredictionPolicy.php` | Role-aware view + addVerdict |
| `routes/web.php` | Add role middleware to classify, add verdict route, add admin routes |
| `resources/js/types/auth.ts` | Add role to User type |
| `resources/js/components/app-sidebar.tsx` | Filter nav items by role |
| `resources/js/pages/predictions/show.tsx` | Show verdict form for doctors, show verdict for all |
| `app/Http/Controllers/PredictionController.php` | Role-aware dashboard/history queries |

---

### Task 1: Add role enum to users table

**Files:**
- Create: `database/migrations/2026_04_16_000001_add_role_to_users_table.php`

- [ ] **Step 1: Create migration**

```bash
cd /Users/ucilmenangis/Documents/Kerja/freelance/angina-pektoris-detection/web
php artisan make:migration add_role_to_users_table --no-interaction
```

- [ ] **Step 2: Write migration content**

Replace the generated migration file content with:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['patient', 'doctor', 'admin'])->default('patient')->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
```

- [ ] **Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration runs without error.

- [ ] **Step 4: Commit**

```bash
git add database/migrations/2026_04_16_000001_add_role_to_users_table.php
git commit -m "feat: add role enum column to users table"
```

---

### Task 2: Add verdict columns to predictions table

**Files:**
- Create: `database/migrations/2026_04_16_000002_add_verdict_to_predictions_table.php`

- [ ] **Step 1: Create migration**

```bash
cd /Users/ucilmenangis/Documents/Kerja/freelance/angina-pektoris-detection/web
php artisan make:migration add_verdict_to_predictions_table --no-interaction
```

- [ ] **Step 2: Write migration content**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('predictions', function (Blueprint $table) {
            $table->enum('doctor_verdict', ['Angina Pektoris', 'Bukan Angina Pektoris', 'Perlu Pemeriksaan Lanjut'])->nullable()->after('features_used');
            $table->text('doctor_notes')->nullable()->after('doctor_verdict');
            $table->foreignId('verdict_by')->nullable()->constrained('users')->nullOnDelete()->after('doctor_notes');
            $table->timestamp('verdict_at')->nullable()->after('verdict_by');
        });
    }

    public function down(): void
    {
        Schema::table('predictions', function (Blueprint $table) {
            $table->dropForeign(['verdict_by']);
            $table->dropColumn(['doctor_verdict', 'doctor_notes', 'verdict_by', 'verdict_at']);
        });
    }
};
```

- [ ] **Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration runs without error.

- [ ] **Step 4: Commit**

```bash
git add database/migrations/2026_04_16_000002_add_verdict_to_predictions_table.php
git commit -m "feat: add doctor verdict columns to predictions table"
```

---

### Task 3: Update User model

**Files:**
- Modify: `app/Models/User.php`

- [ ] **Step 1: Add role to fillable, casts, helper methods, and verdicts relationship**

Update `app/Models/User.php` to:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isPatient(): bool
    {
        return $this->role === 'patient';
    }

    public function isDoctor(): bool
    {
        return $this->role === 'doctor';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function verdicts(): HasMany
    {
        return $this->hasMany(Prediction::class, 'verdict_by');
    }
}
```

- [ ] **Step 2: Run pint**

Run: `vendor/bin/pint --dirty --format agent`
Expected: Files formatted.

- [ ] **Step 3: Commit**

```bash
git add app/Models/User.php
git commit -m "feat: add role helpers and verdicts relationship to User model"
```

---

### Task 4: Update Prediction model

**Files:**
- Modify: `app/Models/Prediction.php`

- [ ] **Step 1: Read current Prediction model**

Read: `app/Models/Prediction.php` to see current fillable and casts.

- [ ] **Step 2: Add verdict fields to fillable, casts, and verdictBy relationship**

Add to `$fillable` array: `'doctor_verdict'`, `'doctor_notes'`, `'verdict_by'`, `'verdict_at'`

Add to `casts()` method: `'verdict_at' => 'datetime'`

Add relationship method:

```php
public function verdictBy(): \Illuminate\Database\Eloquent\Relations\BelongsTo
{
    return $this->belongsTo(User::class, 'verdict_by');
}
```

- [ ] **Step 3: Run pint**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 4: Commit**

```bash
git add app/Models/Prediction.php
git commit -m "feat: add verdict fields and relationship to Prediction model"
```

---

### Task 5: Create EnsureRole middleware

**Files:**
- Create: `app/Http/Middleware/EnsureRole.php`
- Modify: `bootstrap/app.php`

- [ ] **Step 1: Create middleware**

```bash
cd /Users/ucilmenangis/Documents/Kerja/freelance/angina-pektoris-detection/web
php artisan make:middleware EnsureRole --no-interaction
```

- [ ] **Step 2: Write middleware content**

Replace generated file with:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! in_array($request->user()?->role, $roles)) {
            abort(403);
        }

        return $next($request);
    }
}
```

- [ ] **Step 3: Register middleware alias in bootstrap/app.php**

Add to the `->withMiddleware()` callback, before the closing `});`:

```php
$middleware->alias([
    'role' => \App\Http\Middleware\EnsureRole::class,
]);
```

The full `withMiddleware` block becomes:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

    $middleware->web(append: [
        HandleAppearance::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
    ]);

    $middleware->alias([
        'role' => \App\Http\Middleware\EnsureRole::class,
    ]);
})
```

- [ ] **Step 4: Run pint**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 5: Commit**

```bash
git add app/Http/Middleware/EnsureRole.php bootstrap/app.php
git commit -m "feat: add EnsureRole middleware and register alias"
```

---

### Task 6: Update policies for role-based authorization

**Files:**
- Modify: `app/Policies/PatientPolicy.php`
- Modify: `app/Policies/PredictionPolicy.php`

- [ ] **Step 1: Update PatientPolicy**

Replace `app/Policies/PatientPolicy.php` with:

```php
<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;

class PatientPolicy
{
    public function view(User $user, Patient $patient): bool
    {
        if ($user->isAdmin() || $user->isDoctor()) {
            return true;
        }

        return $user->id === $patient->user_id;
    }

    public function update(User $user, Patient $patient): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $patient->user_id;
    }

    public function delete(User $user, Patient $patient): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $patient->user_id;
    }
}
```

- [ ] **Step 2: Update PredictionPolicy**

Replace `app/Policies/PredictionPolicy.php` with:

```php
<?php

namespace App\Policies;

use App\Models\Prediction;
use App\Models\User;

class PredictionPolicy
{
    public function view(User $user, Prediction $prediction): bool
    {
        if ($user->isAdmin() || $user->isDoctor()) {
            return true;
        }

        return $user->id === $prediction->user_id;
    }

    public function addVerdict(User $user, Prediction $prediction): bool
    {
        return $user->isDoctor();
    }
}
```

- [ ] **Step 3: Run pint**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 4: Commit**

```bash
git add app/Policies/PatientPolicy.php app/Policies/PredictionPolicy.php
git commit -m "feat: update policies for role-based authorization"
```

---

### Task 7: Update routes with role middleware

**Files:**
- Modify: `routes/web.php`

- [ ] **Step 1: Add role middleware to classify routes and new admin/verdict routes**

Update `routes/web.php`. Inside the `Route::middleware(['auth', 'verified'])->group(function () {` block, change classify routes to include role middleware, and add new routes.

Replace these lines:

```php
    // Classification form (GET)
    Route::get('/classify', [PredictionController::class, 'showClassifyForm'])
        ->name('classify');

    // Classification form submission (POST)
    Route::post('/classify', [PredictionController::class, 'classify'])
        ->name('classify.store');
```

With:

```php
    // Classification form (GET) — patient and doctor only
    Route::get('/classify', [PredictionController::class, 'showClassifyForm'])
        ->middleware('role:patient,doctor')
        ->name('classify');

    // Classification form submission (POST) — patient and doctor only
    Route::post('/classify', [PredictionController::class, 'classify'])
        ->middleware('role:patient,doctor')
        ->name('classify.store');
```

Add these new routes inside the same middleware group, after the predictions routes:

```php
    // Doctor verdict on prediction
    Route::post('predictions/{prediction}/verdict', [PredictionVerdictController::class, 'store'])
        ->middleware('role:doctor')
        ->name('predictions.verdict');

    // Admin user management
    Route::middleware('role:admin')->group(function () {
        Route::get('admin/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
        Route::patch('admin/users/{user}/role', [App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('admin.users.update-role');
        Route::delete('admin/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');
    });
```

Add the import at the top of the file (after existing use statements):

```php
use App\Http\Controllers\PredictionVerdictController;
```

- [ ] **Step 2: Run pint**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 3: Commit**

```bash
git add routes/web.php
git commit -m "feat: add role middleware to classify routes, add verdict and admin routes"
```

---

### Task 8: Create PredictionVerdictController

**Files:**
- Create: `app/Http/Controllers/PredictionVerdictController.php`

- [ ] **Step 1: Create controller**

```bash
cd /Users/ucilmenangis/Documents/Kerja/freelance/angina-pektoris-detection/web
php artisan make:controller PredictionVerdictController --no-interaction
```

- [ ] **Step 2: Write controller content**

Replace generated file with:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionVerdictController extends Controller
{
    public function store(Request $request, Prediction $prediction)
    {
        $this->authorize('addVerdict', $prediction);

        $validated = $request->validate([
            'doctor_verdict' => 'required|in:Angina Pektoris,Bukan Angina Pektoris,Perlu Pemeriksaan Lanjut',
            'doctor_notes' => 'nullable|string|max:1000',
        ]);

        $prediction->update([
            'doctor_verdict' => $validated['doctor_verdict'],
            'doctor_notes' => $validated['doctor_notes'],
            'verdict_by' => auth()->id(),
            'verdict_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Verdict berhasil disimpan');
    }
}
```

- [ ] **Step 3: Run pint**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 4: Commit**

```bash
git add app/Http/Controllers/PredictionVerdictController.php
git commit -m "feat: add PredictionVerdictController for doctor verdicts"
```

---

### Task 9: Create Admin UserController

**Files:**
- Create: `app/Http/Controllers/Admin/UserController.php`

- [ ] **Step 1: Create controller**

```bash
cd /Users/ucilmenangis/Documents/Kerja/freelance/angina-pektoris-detection/web
mkdir -p app/Http/Controllers/Admin
php artisan make:controller Admin/UserController --no-interaction
```

If `make:controller` doesn't support `Admin/UserController` syntax, manually create the file.

- [ ] **Step 2: Write controller content**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(15);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:patient,doctor,admin',
        ]);

        $user->update(['role' => $validated['role']]);

        return redirect()->back()->with('success', "Role {$user->name} berhasil diubah menjadi {$validated['role']}");
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus akun sendiri');
        }

        $user->delete();

        return redirect()->back()->with('success', "User {$user->name} berhasil dihapus");
    }
}
```

- [ ] **Step 3: Run pint**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 4: Commit**

```bash
git add app/Http/Controllers/Admin/UserController.php
git commit -m "feat: add Admin UserController for user management"
```

---

### Task 10: Update PredictionController for role-aware queries

**Files:**
- Modify: `app/Http/Controllers/PredictionController.php`

- [ ] **Step 1: Update dashboard() method to show all data for doctor/admin**

In `dashboard()` method, change the queries to be role-aware. Replace the stats and recentPredictions logic:

```php
    public function dashboard()
    {
        $user = auth()->user();

        $query = Prediction::query();
        $patientQuery = Patient::query();

        // Patient sees only own data, doctor/admin sees all
        if ($user->isPatient()) {
            $query->where('user_id', $user->id);
            $patientQuery->where('user_id', $user->id);
        }

        $anginaCount = (clone $query)
            ->where('prediction_result', 'Angina Pektoris')
            ->count();

        $nonAnginaCount = (clone $query)
            ->where('prediction_result', 'Bukan Angina Pektoris')
            ->count();

        $stats = [
            'total_patients' => $patientQuery->count(),
            'angina_count' => $anginaCount,
            'non_angina_count' => $nonAnginaCount,
        ];

        $recentPredictions = (clone $query)
            ->with('patient')
            ->latest()
            ->limit(4)
            ->get()
            ->map(function ($prediction) {
                return [
                    'id' => $prediction->id,
                    'patient' => [
                        'nama' => $prediction->patient->nama,
                        'umur' => $prediction->usia,
                    ],
                    'prediction_result' => $prediction->hasil_klasifikasi,
                    'risk_level' => $prediction->risk_level,
                    'created_at' => $prediction->created_at->toISOString(),
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentPredictions' => $recentPredictions,
        ]);
    }
```

- [ ] **Step 2: Update history() method for role-aware queries**

Replace `history()` method:

```php
    public function history()
    {
        $query = Prediction::with('patient')->latest();

        if (auth()->user()->isPatient()) {
            $query->where('user_id', auth()->id());
        }

        $predictions = $query->get()->map(function ($prediction) {
            return [
                'id' => $prediction->id,
                'nama' => $prediction->patient->nama,
                'umur' => $prediction->usia,
                'hasil' => $prediction->hasil_klasifikasi,
                'risk_level' => $prediction->risk_level,
                'created_at' => $prediction->created_at->toISOString(),
            ];
        });

        return Inertia::render('classification-history', [
            'classifications' => $predictions,
        ]);
    }
```

- [ ] **Step 3: Update index() method for role-aware queries**

Replace `index()` method:

```php
    public function index()
    {
        $query = Prediction::with(['patient', 'user'])->latest();

        if (auth()->user()->isPatient()) {
            $query->where('user_id', auth()->id());
        }

        $predictions = $query->paginate(15);

        return Inertia::render('predictions/index', [
            'predictions' => $predictions,
        ]);
    }
```

- [ ] **Step 4: Update result() and show() to share verdict data**

In `result()` method, add verdict info to the response. After the `'result'` array, add:

```php
'verdict' => $prediction->verdict_by ? [
    'verdict' => $prediction->doctor_verdict,
    'notes' => $prediction->doctor_notes,
    'doctor_name' => $prediction->verdictBy?->name,
    'verdict_at' => $prediction->verdict_at?->toISOString(),
] : null,
```

In `show()` method, load the `verdictBy` relationship:

```php
    public function show(Prediction $prediction)
    {
        $this->authorize('view', $prediction);

        $prediction->load(['patient', 'verdictBy']);

        return Inertia::render('predictions/show', [
            'prediction' => $prediction,
        ]);
    }
```

- [ ] **Step 5: Run pint**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/PredictionController.php
git commit -m "feat: role-aware queries in PredictionController"
```

---

### Task 11: Update frontend TypeScript types

**Files:**
- Modify: `resources/js/types/auth.ts`

- [ ] **Step 1: Add role to User type**

In `resources/js/types/auth.ts`, add `role` field to the User type. Update the User type:

```typescript
export type Role = 'patient' | 'doctor' | 'admin';

export type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/types/auth.ts
git commit -m "feat: add Role type and role field to User type"
```

---

### Task 12: Update app sidebar for role-based navigation

**Files:**
- Modify: `resources/js/components/app-sidebar.tsx`

- [ ] **Step 1: Add role filtering to nav items**

Replace `resources/js/components/app-sidebar.tsx` with:

```typescript
import { Link, usePage } from '@inertiajs/react';
import { Home, Info, LayoutDashboard, ClipboardList, History, Users, Settings, Shield, UserCog } from 'lucide-react';
import type { SharedData } from '@/types';
import type { Role } from '@/types/auth';
import { cn } from '@/lib/utils';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    activePrefix?: string;
    roles?: Role[];
}

const navItems: NavItem[] = [
    { title: 'Home', href: '/', icon: Home, roles: ['patient', 'doctor', 'admin'] },
    { title: 'About', href: '/about', icon: Info, roles: ['patient', 'doctor', 'admin'] },
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['patient', 'doctor', 'admin'] },
    { title: 'Data Pasien', href: '/patients', icon: Users, roles: ['patient', 'doctor', 'admin'] },
    { title: 'Mulai Klasifikasi', href: '/classify', icon: ClipboardList, roles: ['patient', 'doctor'] },
    { title: 'Riwayat Klasifikasi', href: '/history', icon: History, roles: ['patient', 'doctor', 'admin'] },
    { title: 'Pengaturan', href: '/settings/profile', icon: Settings, activePrefix: '/settings', roles: ['patient', 'doctor', 'admin'] },
    { title: 'Manajemen Pengguna', href: '/admin/users', icon: UserCog, activePrefix: '/admin/users', roles: ['admin'] },
];

export function AppSidebar() {
    const { url, auth } = usePage<SharedData>();
    const userRole = auth.user.role as Role;

    const visibleItems = navItems.filter((item) => !item.roles || item.roles.includes(userRole));

    return (
        <aside className="w-64 bg-gradient-to-b from-slate-50 to-blue-50 border-r border-slate-200 min-h-[calc(100vh-64px)]">
            <nav className="p-4 space-y-2">
                {visibleItems.map((item) => {
                    const isActive = item.activePrefix
                        ? url.startsWith(item.activePrefix)
                        : url === item.href || (item.href !== '/' && url.startsWith(item.href + '/'));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-slate-700 text-white shadow-md"
                                    : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run types`
Expected: No new errors (existing Wayfinder errors may remain).

- [ ] **Step 3: Commit**

```bash
git add resources/js/components/app-sidebar.tsx
git commit -m "feat: role-based sidebar navigation filtering"
```

---

### Task 13: Add verdict UI to prediction show page

**Files:**
- Modify: `resources/js/pages/predictions/show.tsx`

- [ ] **Step 1: Add verdict section to predictions/show.tsx**

Add these imports at the top (alongside existing imports):

```typescript
import { useForm } from '@inertiajs/react';
```

Add to the `Prediction` interface:

```typescript
  doctor_verdict: string | null;
  doctor_notes: string | null;
  verdict_by: number | null;
  verdict_at: string | null;
  verdict_by_user?: {
    id: number;
    name: string;
  } | null;
```

Update the `Props` interface:

```typescript
interface Props {
  prediction: Prediction;
  auth: {
    user: {
      role: string;
    };
  };
}
```

Update the component signature:

```typescript
export default function PredictionsShow({ prediction, auth }: Props) {
```

Add verdict form logic inside the component, before the return:

```typescript
  const { data, setData, post, processing } = useForm({
    doctor_verdict: '',
    doctor_notes: '',
  });

  const submitVerdict = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/predictions/${prediction.id}/verdict`);
  };
```

Add verdict section JSX before the "Action Buttons" div. This goes right above `{/* Action Buttons */}`:

```typescript
        {/* Doctor Verdict Section */}
        {auth.user.role === 'doctor' && !prediction.doctor_verdict && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Verdict Dokter</CardTitle>
              <CardDescription>Berikan verdict Anda untuk prediksi ini</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitVerdict} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Verdict</label>
                  <select
                    value={data.doctor_verdict}
                    onChange={(e) => setData('doctor_verdict', e.target.value)}
                    className="w-full mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Pilih verdict...</option>
                    <option value="Angina Pektoris">Angina Pektoris</option>
                    <option value="Bukan Angina Pektoris">Bukan Angina Pektoris</option>
                    <option value="Perlu Pemeriksaan Lanjut">Perlu Pemeriksaan Lanjut</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Catatan (opsional)</label>
                  <textarea
                    value={data.doctor_notes}
                    onChange={(e) => setData('doctor_notes', e.target.value)}
                    className="w-full mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Tambahkan catatan..."
                  />
                </div>
                <Button type="submit" disabled={processing || !data.doctor_verdict}>
                  Simpan Verdict
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Show existing verdict */}
        {prediction.doctor_verdict && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Verdict Dokter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="text-base px-4 py-1 border-green-400 text-green-700">
                {prediction.doctor_verdict}
              </Badge>
              {prediction.doctor_notes && (
                <p className="text-slate-700 mt-2">{prediction.doctor_notes}</p>
              )}
              {prediction.verdict_by_user && (
                <p className="text-sm text-slate-500 mt-2">
                  Oleh: {prediction.verdict_by_user.name}
                  {prediction.verdict_at && (
                    <> &middot; {new Date(prediction.verdict_at).toLocaleString('id-ID')}</>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        )}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run types`

- [ ] **Step 3: Commit**

```bash
git add resources/js/pages/predictions/show.tsx
git commit -m "feat: add doctor verdict form and display to prediction show page"
```

---

### Task 14: Create admin user management page

**Files:**
- Create: `resources/js/pages/admin/users/index.tsx`

- [ ] **Step 1: Create directory and page file**

```bash
mkdir -p resources/js/pages/admin/users
```

- [ ] **Step 2: Write admin users page**

Create `resources/js/pages/admin/users/index.tsx`:

```typescript
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Users, Trash2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '@/types/auth';

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function AdminUsersIndex({ users }: Props) {
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const getRoleBadge = (role: Role) => {
        const styles: Record<Role, string> = {
            patient: 'bg-blue-100 text-blue-700',
            doctor: 'bg-green-100 text-green-700',
            admin: 'bg-purple-100 text-purple-700',
        };
        const labels: Record<Role, string> = {
            patient: 'Pasien',
            doctor: 'Dokter',
            admin: 'Admin',
        };
        return { style: styles[role], label: labels[role] };
    };

    const changeRole = (userId: number, role: Role) => {
        const form = useForm({ role });
        form.patch(`/admin/users/${userId}/role`);
    };

    const deleteUser = (userId: number) => {
        const form = useForm({});
        form.delete(`/admin/users/${userId}`);
        setDeleteConfirmId(null);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />

            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
                        <p className="text-slate-600 mt-1">Kelola role dan hapus pengguna</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                        <div>Nama</div>
                        <div>Email</div>
                        <div>Role</div>
                        <div>Terdaftar</div>
                        <div className="text-center">Aksi</div>
                    </div>

                    <div className="divide-y divide-slate-200">
                        {users.data.length > 0 ? (
                            users.data.map((user) => {
                                const roleInfo = getRoleBadge(user.role);
                                return (
                                    <div key={user.id} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-slate-50">
                                        <div className="text-slate-800 font-medium">{user.name}</div>
                                        <div className="text-slate-600">{user.email}</div>
                                        <div>
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeRole(user.id, e.target.value as Role)}
                                                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                                            >
                                                <option value="patient">Pasien</option>
                                                <option value="doctor">Dokter</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className="text-slate-600 text-sm">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </div>
                                        <div className="flex justify-center">
                                            {deleteConfirmId === user.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="bg-red-100 hover:bg-red-200 text-red-700"
                                                        onClick={() => deleteUser(user.id)}
                                                    >
                                                        Konfirmasi
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDeleteConfirmId(null)}
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="bg-red-100 hover:bg-red-200 text-red-700"
                                                    onClick={() => setDeleteConfirmId(user.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                <p>Belum ada data pengguna</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/users?page=${page}`}
                                className={`px-4 py-2 rounded-lg ${
                                    page === users.current_page
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-8 text-center text-slate-500 text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run types`

- [ ] **Step 4: Commit**

```bash
git add resources/js/pages/admin/users/index.tsx
git commit -m "feat: add admin user management page"
```

---

### Task 15: Verify and test

- [ ] **Step 1: Run pint on all changed PHP files**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 2: Run TypeScript check**

Run: `npm run types`
Expected: Same 5 pre-existing errors or fewer. No new errors.

- [ ] **Step 3: Run existing tests**

Run: `php artisan test --compact`
Expected: Same 1 pre-existing failure (ExampleTest). No new failures.

- [ ] **Step 4: Build frontend**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Manual test — create admin user via tinker**

```bash
php artisan tinker
```

```php
$user = User::first();
$user->update(['role' => 'admin']);
```

Then login as that user, verify:
- Sidebar shows "Manajemen Pengguna"
- Sidebar shows "Mulai Klasifikasi" hidden for admin
- `/admin/users` page loads with user list
- Can change user role
- Can delete user (not self)

- [ ] **Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: role system polish and fixes"
```
