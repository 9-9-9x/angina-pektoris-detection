# Flow Issues — Remaining

## Fixed

- [x] #1 `config/services.php` ignores `.env` — now uses `env()`
- [x] #2 Settings pages unreachable — added "Pengaturan" to sidebar
- [x] #3 AppLayout ignores breadcrumbs prop — added optional prop
- [x] #4 Duplicate patients on `/classify` — firstOrCreate by nama + user_id
- [x] #5 No DB transaction — wrapped in `DB::transaction()`
- [x] #6 Double health-check + no fallback — try predict, fallback to mock
- [x] #7 Train/serve duration mismatch — save median in model artifact (needs `uv run python model.py` to retrain)
- [x] #8 `features_used` stores raw input — now stores processed features from ML API

## Medium — Pending

- [ ] #9 `store()` has no `max:50` on `durasi_nyeri` but `classify()` does — inconsistent validation
- [ ] #10 Inline validation instead of Form Request classes — inconsistent with settings controllers
- [ ] #11 Mock prediction threshold off-by-one — score=50 → 0.5 → "Bukan Angina" (should use `>=`)
- [ ] #12 `home` route (`/`) missing `verified` middleware — unverified users see app shell but can't navigate
- [ ] #13 "Simpan" button on classification-result.tsx is a no-op — prediction already saved server-side
- [ ] #14 `classification-history.tsx` discards `risk_level` — fetched from backend but not rendered
- [ ] #15 No User model relationships — missing `patients()` and `predictions()` hasMany

## Low — Pending

- [ ] #16 `welcome.tsx` is orphaned — no route renders it (dead code)
- [ ] #17 Inconsistent route reference styles — some Wayfinder, some hardcoded strings
- [ ] #18 ML API has no auth, no rate limiting, CORS allows all origins
- [ ] #19 No `no_rm` race condition handling — concurrent creates could hit unique constraint
- [ ] #20 Exception details leaked in ML API error responses

## Pre-existing TypeScript Errors (5)

- `app-header-layout.tsx` — passes breadcrumbs to component that doesn't accept it
- `patients/create.tsx` — Wayfinder RouteDefinition type mismatch
- `patients/edit.tsx` — same
- `patients/show.tsx` — same
- `predictions/create.tsx` — same

## Pre-existing Test Failure (1)

- `ExampleTest` — expects `GET /` → 200, gets 302 (unauthenticated redirect)
