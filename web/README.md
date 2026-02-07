# Angina Pektoris Detection - Web Application

Laravel + React + Inertia.js web application for predicting Angina Pektoris using Machine Learning.

## 🚀 Quick Start

### Prerequisites

1. PHP 8.2+
2. Composer
3. Node.js 18+
4. SQLite (or MySQL)
5. Python 3.11+ with FastAPI

### Architecture Overview

This project has **two main components**:

```
┌─────────────────┐     HTTP      ┌─────────────────┐
│   Laravel Web   │◄──────────────►│  FastAPI ML     │
│   (Port 8000)   │                │  (Port 8000)    │
└─────────────────┘                └─────────────────┘
                                          │
                                          ▼ Load
                                    ┌─────────────┐
                                    │ angina_     │
                                    │ model.pkl   │
                                    │ (Trained)   │
                                    └─────────────┘
```

**Web App (Laravel + React)** - User interface, patient management, displays results
**ML Service (FastAPI)** - Loads trained model, serves predictions via HTTP API

### Step 1: Train the Model (One-time)

```bash
cd ml
source .venv/bin/activate

# Train and save the model
python model.py

# Output: angina_model.pkl (trained model file)
```

### Step 2: Start ML API Service

```bash
cd ml
source .venv/bin/activate

# Start the prediction API (keep running)
uvicorn api:app --reload --port 8000
```

### Step 3: Setup Web Application

```bash
cd web

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate

# Build frontend
npm run build
# Or for development: npm run dev
```

### Step 4: Start Web Server

```bash
cd web
php artisan serve
```

### Access the Application

- **Web App:** http://localhost:8000
- **ML API Docs:** http://localhost:8000/docs

### Complete Development Setup (4 Terminals)

```bash
# Terminal 1: ML API (must be running first)
cd ml && source .venv/bin/activate && uvicorn api:app --reload --port 8000

# Terminal 2: Laravel Server
cd web && php artisan serve

# Terminal 3: Frontend Build (hot reload)
cd web && npm run dev

# Terminal 4: (Optional) Retrain model
cd ml && source .venv/bin/activate && python model.py
```

## 📁 Project Structure

```
web/
├── app/
│   ├── Http/Controllers/     # Controllers
│   │   ├── PatientController.php
│   │   └── PredictionController.php
│   ├── Models/               # Eloquent Models
│   │   ├── Patient.php
│   │   └── Prediction.php
│   ├── Policies/             # Authorization Policies
│   ├── Services/             # Business Logic
│   │   └── AnginaPredictionService.php
│   └── ...
├── database/migrations/      # Database migrations
├── resources/js/
│   ├── pages/                # React Pages
│   │   ├── patients/         # Patient CRUD pages
│   │   ├── predictions/      # Prediction pages
│   │   └── dashboard.tsx
│   ├── components/           # Reusable components
│   └── layouts/              # Page layouts
└── routes/web.php            # Application routes
```

## 📋 Features

### 1. Authentication
- Login/Register using Laravel Fortify
- Email verification
- Password reset

### 2. Patient Management
- Add new patient
- View patient details
- Edit patient information
- Delete patient with confirmation
- View prediction history per patient

### 3. Prediction
- Input clinical data (12 features)
- Call FastAPI ML service
- Display prediction result with:
  - Risk level (LOW/MODERATE/HIGH) - color coded
  - Probability percentage
  - Confidence level
  - Medical disclaimer
- Save prediction history
- **Print / PDF Export** - Generate printable report with signatures

### 4. Dashboard
- Statistics cards (total patients, predictions, high-risk count)
- Recent predictions
- Risk distribution

### 5. Reports
- View all predictions history
- Print individual prediction reports
- Filter and search predictions

## 🔗 API Integration

The web app communicates with the FastAPI ML service via HTTP:

```php
// Service configuration in .env
ML_API_URL=http://localhost:8000
ML_API_TIMEOUT=30
```

### Endpoints Used

- `GET /health` - Check ML service status
- `POST /predict` - Get prediction for patient data

## 🗄️ Database Schema

### Patients Table
- `id`, `nama`, `no_rm` (Medical Record Number)
- `tanggal_lahir`, `jenis_kelamin`
- `alamat`, `telepon`
- `user_id` (who created the patient)

### Predictions Table
- Clinical inputs (usia, tekanan_darah, symptoms, etc.)
- Prediction results (result, probability, risk_level)
- Relationships: `patient_id`, `user_id`

## 🎨 UI Components

Uses shadcn/ui components:
- Button, Card, Input, Select
- Badge, Alert, Table
- Dialog, Dropdown, etc.

## ⚠️ Important Notes

1. **ML Service Required**: The web app requires the FastAPI service to be running on port 8000
2. **Medical Disclaimer**: All predictions include a medical disclaimer
3. **Authorization**: Users can only see their own patients and predictions

## 🐛 Troubleshooting

### "ML Service Tidak Tersedia" / "ML API returned error status"

**Cause:** The FastAPI ML service is not running

**Solution:**
```bash
cd ml
source .venv/bin/activate
uvicorn api:app --reload --port 8000
```

**Remember:** You need to run BOTH services:
1. `api.py` - The ML prediction service (keeps running)
2. `model.py` - Only for training, not for serving!

### Model file not found

**Cause:** `angina_model.pkl` doesn't exist

**Solution:** Train the model first:
```bash
cd ml
source .venv/bin/activate
python model.py
```

### Database Locked
```
SQLSTATE[HY000]: General error: 5 database is locked
```
**Solution:** Restart the Laravel server

### Migration Failed
```bash
php artisan migrate:fresh
```

## 📚 Tech Stack

- **Backend**: Laravel 11, PHP 8.2+
- **Frontend**: React 18, TypeScript, Inertia.js
- **UI**: Tailwind CSS, shadcn/ui
- **Database**: SQLite (default) / MySQL
- **ML Integration**: FastAPI (Python)

## 🖼️ Pages Overview

1. **Dashboard** - Statistics cards, recent predictions, risk distribution
2. **Patients List** - View all patients with search functionality
3. **Patient Detail** - Patient info, prediction history, edit/delete options
4. **Add Patient** - Form to register new patient
5. **Edit Patient** - Update patient information
6. **Prediction Form** - Input 12 clinical features
7. **Prediction Result** - Color-coded risk level with medical disclaimer
8. **Print/PDF Report** - Printable report with patient data, results, and signature lines
9. **Predictions History** - All predictions with filter and search

## 📝 License

MIT License - For educational and research purposes only.
