# 🌱 Crop Recommendation Module (PERSON 2)

End-to-end Machine Learning pipeline for crop recommendation in the Smart Agriculture Intelligence Dashboard.

---

## 📊 1. Dataset Overview

- **Source File**: `models/crop_recommendation/data/Crop_recommendation.csv`
- **Total Records**: 2,200 observations
- **Target Classes**: 22 unique agricultural crops (`rice`, `maize`, `chickpea`, `kidneybeans`, `pigeonpeas`, `mothbeans`, `mungbean`, `blackgram`, `lentil`, `pomegranate`, `banana`, `mango`, `grapes`, `watermelon`, `muskmelon`, `apple`, `orange`, `papaya`, `coconut`, `cotton`, `jute`, `coffee`).
- **Class Distribution**: 100 samples per crop (balanced multi-class dataset).

---

## 🧪 2. Input Features Specification

| Feature Name | Description | Unit | Range in Dataset |
| :--- | :--- | :--- | :--- |
| `N` | Ratio of Nitrogen content in soil | kg/ha | 0 – 140 |
| `P` | Ratio of Phosphorus content in soil | kg/ha | 5 – 145 |
| `K` | Ratio of Potassium content in soil | kg/ha | 5 – 205 |
| `temperature` | Atmospheric temperature | °C | 8.82 – 43.68 |
| `humidity` | Relative atmospheric humidity | % | 14.25 – 99.98 |
| `ph` | Soil pH level | pH | 3.50 – 9.94 |
| `rainfall` | Total seasonal rainfall | mm | 20.21 – 298.56 |

---

## 🤖 3. Machine Learning Model Architecture

- **Language & Framework**: R (using native R `rpart` engine)
- **Algorithm**: Recursive Partitioning and Decision Trees (`rpart`)
- **Evaluation Accuracy**: **99.09%** on an 80/20 train-test split
- **Model Output**: Class prediction and normalized class probability distribution vector
- **Artifact Serialization**: `models/crop_recommendation/model/crop_model.rds`

---

## 🚀 4. How to Train the Model

To execute data preprocessing and model training:

```bash
# Run R training script directly
Rscript models/crop_recommendation/R/train.R

# Or run the Windows batch pipeline script
models/crop_recommendation/scripts/run_pipeline.bat
```

### Execution Steps:
1. `preprocess.R`: Validates CSV schema, casts types, and filters clean data.
2. `train.R`: Fits the `rpart` decision classifier and evaluates accuracy.
3. Saves serialized model to `models/crop_recommendation/model/crop_model.rds`.

---

## ⚡ 5. How Flask Calls the R Prediction Script

The Flask endpoint in `backend/app/routes/crop_recommendation.py` handles API requests without moving ML logic into Python:

1. **Request Intake**: Accepts JSON payload at `POST /api/models/crop-recommendation/predict`.
2. **Subprocess Bridge**: Executes `Rscript` with CLI arguments pointing to `models/crop_recommendation/R/predict.R`:
   ```bash
   Rscript models/crop_recommendation/R/predict.R <N> <P> <K> <temperature> <humidity> <ph> <rainfall>
   ```
3. **JSON Output Capture**: Reads stdout produced by `predict.R` containing `recommended_crop`, `confidence`, and `top_alternatives`.
4. **Response**: Returns HTTP 200 JSON payload to the React frontend.

---

## 📡 6. Expected API Request & Response Payload

### API Endpoint
`POST /api/models/crop-recommendation/predict`

### Sample Request Headers
```http
Content-Type: application/json
```

### Sample Request Body (Monsoon Rice Profile)
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.87,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.93
}
```

### Sample Response Body (200 OK)
```json
{
  "success": true,
  "recommended_crop": "rice",
  "confidence": 1.0000,
  "confidence_percentage": 100.00,
  "top_alternatives": [
    { "crop": "apple", "confidence": 0.0000 },
    { "crop": "banana", "confidence": 0.0000 },
    { "crop": "blackgram", "confidence": 0.0000 }
  ],
  "inputs": {
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87,
    "humidity": 82.0,
    "ph": 6.5,
    "rainfall": 202.93
  }
}
```

### Sample Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Missing required parameters: N, rainfall"
}
```

---

## 📂 7. Project Ownership Directory Structure

```text
models/crop_recommendation/
├── data/
│   └── Crop_recommendation.csv
├── R/
│   ├── preprocess.R
│   ├── train.R
│   └── predict.R
├── model/
│   └── crop_model.rds
├── scripts/
│   └── run_pipeline.bat
└── README.md

frontend/src/pages/crop-recommendation/
└── CropRecommendation.tsx

frontend/src/components/crop-recommendation/
├── CropInputForm.tsx
├── CropPredictionResult.tsx
└── CropModelInfo.tsx

backend/app/routes/
└── crop_recommendation.py
```
