# 🌾 Smart Agriculture Intelligence Dashboard

AI-powered agricultural decision support system integrating predictive agronomic analytics, environmental risk modeling, and crop health diagnostics.

---

## 🏛️ Project Architecture

```text
React + TypeScript + Tailwind CSS + shadcn/ui
                     │
                     │ REST API
                     ▼
                 Flask API (Port 5001)
                     │
                     ▼
                 R Models
                     │
                     ▼
               Prediction JSON
                     │
                     ▼
             React Dashboard
```

---

## 👥 Team Responsibilities (6-Person Team)

| Role | Member | Responsibilities | Status |
| :--- | :--- | :--- | :--- |
| **Person 1** | Arpit Patel | Main Dashboard, Global Navigation/Layout, Central API Infrastructure | **Completed** |
| **Person 4** | Arpit Patel | Flask Backend Engine, Disease Risk R Model, End-to-End Disease Page | **Completed** |
| **Person 2** | Teammate | Crop Recommendation (`models/crop_recommendation/`) | In Development |
| **Person 3** | Teammate | Crop Yield Prediction (`models/crop_yield/`) | In Development |
| **Person 5** | Teammate | Irrigation Requirement (`models/irrigation/`) | In Development |
| **Person 6** | Teammate | Weather Risk (`models/weather_risk/`) | In Development |

---

## 📁 Repository Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # Navbar, Layout shell
│   │   │   ├── shared/            # ModelCard, ErrorBanner
│   │   │   ├── disease-risk/      # DiseaseInputForm, DiseaseRiskResult, RiskIndicator
│   │   │   └── ui/                # Official shadcn/ui components
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx      # Main agriculture dashboard
│   │   │   ├── PlaceholderModel.tsx # Teammate route placeholders
│   │   │   └── disease-risk/      # DiseaseRisk.tsx
│   │   ├── services/
│   │   │   └── api.ts             # Central API service client
│   │   ├── types/
│   │   │   └── index.ts           # Strict TypeScript contracts
│   │   ├── App.tsx                # React Router setup
│   │   ├── main.tsx
│   │   └── index.css              # Agri theme tokens
│   ├── package.json
│   └── vite.config.ts             # Vite proxy & Tailwind v4
│
├── backend/
│   ├── app/
│   │   ├── __init__.py            # Flask factory & CORS configuration
│   │   ├── config.py              # Environment & model paths
│   │   └── routes/
│   │       ├── health.py          # GET /api/health
│   │       └── disease_risk.py    # POST /api/models/disease-risk/predict
│   ├── run.py                     # Entry point (port 5001)
│   └── requirements.txt
│
├── models/
│   ├── crop_recommendation/
│   │   └── README.md              # Module placeholder (Person 2)
│   ├── crop_yield/
│   │   └── README.md              # Module placeholder (Person 3)
│   ├── disease_risk/
│   │   ├── data/
│   │   │   └── plant_disease_data.csv # Real agricultural disease dataset
│   │   ├── R/
│   │   │   ├── preprocess.R       # Preprocessing & encoding
│   │   │   ├── train.R            # Random Forest training & evaluation
│   │   │   └── predict.R          # Real-time CLI/JSON inference engine
│   │   ├── model/
│   │   │   ├── feature_importance.json # Evaluated Gini feature importance
│   │   │   └── metrics.json       # Holdout accuracy, recall, precision, F1
│   │   └── README.md              # Full dataset & model documentation
│   ├── irrigation/
│   │   └── README.md              # Module placeholder (Person 5)
│   └── weather_risk/
│       └── README.md              # Module placeholder (Person 6)
│
├── plant_disease_data.csv         # Root dataset copy
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ & **npm**
- **Python** 3.9+
- **R** 4.x with packages `randomForest` and `jsonlite`

### 2. Machine Learning Model (R)
```bash
# In the repository root:
Rscript models/disease_risk/R/train.R
```
This trains the stratified Random Forest model on `models/disease_risk/data/plant_disease_data.csv` and generates `models/disease_risk/model/disease_model.rds`.

### 3. Backend (Flask)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```
Backend runs on `http://localhost:5001`.
- Health Check: `GET http://localhost:5001/api/health`
- Disease Prediction: `POST http://localhost:5001/api/models/disease-risk/predict`

### 4. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 API Contract: Disease Risk Prediction

### Request
`POST /api/models/disease-risk/predict`
```json
{
  "crop": "Corn",
  "leaf_color": "Brown",
  "leaf_spot_size": 3.8,
  "humidity": 69.49,
  "temperature": 30.68
}
```

### Response
```json
{
  "prediction": "Mild Infection",
  "risk_level": "MEDIUM",
  "probability": 0.67,
  "probabilities": {
    "Healthy": 0.245,
    "Mild Infection": 0.67,
    "Severe Infection": 0.085
  },
  "feature_importance": {
    "Humidity": { "label": "Air Humidity", "percentage": 28.6, "score": 159.87 },
    "Temperature": { "label": "Ambient Temperature", "percentage": 28.27, "score": 157.99 },
    "Leaf_Spot_Size": { "label": "Leaf Spot Size", "percentage": 28.2, "score": 157.64 },
    "Plant_Type": { "label": "Crop Species", "percentage": 9.27, "score": 51.82 },
    "Leaf_Color": { "label": "Leaf Discoloration", "percentage": 5.66, "score": 31.61 }
  },
  "timestamp": "2026-09-19 11:21:09.532519"
}
```
