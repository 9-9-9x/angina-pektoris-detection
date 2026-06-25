# Revision Plan: No-Login Patient Flow

## DB Migrations (2 new files)
- `predictions`: add `kode_unik` (unique), `jam_skrining`, `tgl_skrining`, `untuk_diri_sendiri`
- `predictions` + `patients`: `user_id` → nullable

## Models
- `Prediction` — add new fields to `$fillable`

## Backend
- `routes/web.php`
  - `/`, `/about`, `/classify`, `/classify/result` → public (no auth)
  - Add public route `/skrining/{kode}` for lookup
  - Post-login redirect → dashboard directly
- `PredictionController.php`
  - `classify()` — remove all `auth()->id()`, generate `kode_unik`, save `jam_skrining`, `tgl_skrining`, `untuk_diri_sendiri`
  - `result()` — remove `$this->authorize`
  - Add method `lookupByKode()`
  - `history()` — for doctor: filter only acc'd predictions (`doctor_verdict IS NOT NULL`)

## Frontend
- `classification.tsx` — add step `jam` + `tgl skrining`; add choice **"untuk diri sendiri / orang lain"** at start; switch to public layout
- `classification-result.tsx` — display `kode_unik` prominently
- New page `pages/skrining/lookup.tsx` — public form to search by kode unik
- `predictions/print.tsx` — remove doctor signature, patient name only
- `auth/login.tsx` — redesign UI
- `dashboard.tsx` / `classification-history.tsx` — add search by kode unik; history filtered by verdict

## ML
- `api.py` — `min(3, ...)` → `min(5, ...)` for 5 RF trees
