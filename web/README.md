# Angina Pektoris Detection - Web Application

Laravel + React + Inertia.js web application for predicting Angina Pektoris using Machine Learning.

## 🚀 Quick Start

### Prerequisites

1. PHP 8.2+
2. Composer
3. Node.js 18+
4. SQLite (or MySQL)
5. FastAPI ML Service running on port 8000

### Installation

```bash
# Navigate to web directory
cd web

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Build frontend assets
npm run build

# Or for development with hot reload
npm run dev
```

### Running the Application

```bash
# Terminal 1: Start Laravel development server
php artisan serve

# Terminal 2: Start FastAPI ML service (from ml directory)
cd ../ml
source .venv/bin/activate
uvicorn api:app --reload --port 8000

# Terminal 3: Build frontend (if using npm run dev)
npm run dev
```

Access the application at: http://localhost:8000

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
- View prediction history per patient

### 3. Prediction
- Input clinical data (12 features)
- Call FastAPI ML service
- Display prediction result with:
  - Risk level (LOW/MODERATE/HIGH)
  - Probability percentage
  - Medical disclaimer
- Save prediction history

### 4. Dashboard
- Statistics cards (total patients, predictions, etc.)
- Recent predictions
- Risk distribution

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

### ML Service Not Found
```
Error: ML API health check failed
```
**Solution**: Make sure FastAPI is running on port 8000

### Database Locked
```
SQLSTATE[HY000]: General error: 5 database is locked
```
**Solution**: Restart the Laravel server

### Migration Failed
```bash
php artisan migrate:fresh --seed
```

## 📚 Tech Stack

- **Backend**: Laravel 11, PHP 8.2+
- **Frontend**: React 18, TypeScript, Inertia.js
- **UI**: Tailwind CSS, shadcn/ui
- **Database**: SQLite (default) / MySQL
- **ML Integration**: FastAPI (Python)

## 📝 License

MIT License - For educational and research purposes only.
