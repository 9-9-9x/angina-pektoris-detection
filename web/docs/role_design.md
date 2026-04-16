# Role System Design

## Roles

### User/Patient
- Fill klasifikasi form with health data
- Get ML prediction results (Angina/Bukan Angina)
- View own classification history
- Already built: `/classify`, `/classify/result`, `/history`

### Doctor
- View patient data (klasifikasi answers filled by patient)
- Determine whether patient is affected or not (doctor's verdict, separate from ML prediction)
- Not built yet

### Admin
- Manage patient data (all patients)
- Manage doctor data
- Not built yet

## Implementation Notes

- Add `role` enum column to `users` table: `admin`, `doctor`, `patient`
- Create middleware for role-based access
- Update policies: admin sees all, doctor sees patient classifications, patient sees own only
- Doctor needs a "verdict" feature — override or confirm ML prediction
- Figma has separate screens: "Dashboard Admin", "Home Admin", "Login As Admin/Doctor"
- Owner confirmed: minimal scope for now, just these 3 roles
