# Irrigation Requirement Prediction — Person 5

## Overview

3-class classification model that predicts **Irrigation Need** (Low / Medium / High) based on 19 soil, weather, crop, and farm features.

## Dataset

- **File:** `data/irrigation_prediction.csv`
- **Rows:** 10,000
- **Target:** `Irrigation_Need` (Low, Medium, High)

### Features

| Category | Feature | Type |
|----------|---------|------|
| Soil | Soil_Type | Categorical (Clay, Loamy, Sandy, Silt) |
| Soil | Soil_pH | Numeric |
| Soil | Soil_Moisture | Numeric |
| Soil | Organic_Carbon | Numeric |
| Soil | Electrical_Conductivity | Numeric |
| Weather | Temperature_C | Numeric |
| Weather | Humidity | Numeric |
| Weather | Rainfall_mm | Numeric |
| Weather | Sunlight_Hours | Numeric |
| Weather | Wind_Speed_kmh | Numeric |
| Crop | Crop_Type | Categorical (Cotton, Maize, Potato, Rice, Sugarcane, Wheat) |
| Crop | Crop_Growth_Stage | Categorical (Flowering, Harvest, Sowing, Vegetative) |
| Crop | Season | Categorical (Kharif, Rabi, Zaid) |
| Farm | Irrigation_Type | Categorical (Canal, Drip, Rainfed, Sprinkler) |
| Farm | Water_Source | Categorical (Groundwater, Rainwater, Reservoir, River) |
| Farm | Field_Area_hectare | Numeric |
| Farm | Mulching_Used | Categorical (Yes, No) |
| Farm | Previous_Irrigation_mm | Numeric |
| Farm | Region | Categorical (Central, East, North, South, West) |

## Model

- **Algorithm:** Random Forest (ranger)
- **Type:** Classification with probability output
- **Trees:** 500
- **Seed:** 42
- **Train/Test split:** 80/20

## Usage

### 1. Preprocess

```bash
Rscript models/irrigation/R/preprocess.R
```

### 2. Train

```bash
Rscript models/irrigation/R/train.R
```

### 3. Predict

```bash
# With default sample:
Rscript models/irrigation/R/predict.R

# With JSON input file:
Rscript models/irrigation/R/predict.R input.json
```

### Example output

```json
{
  "irrigation_need": "Low",
  "confidence": 0.87,
  "probabilities": {
    "Low": 0.87,
    "Medium": 0.10,
    "High": 0.03
  }
}
```

## Files

```
models/irrigation/
├── data/
│   └── irrigation_prediction.csv
├── R/
│   ├── preprocess.R
│   ├── train.R
│   └── predict.R
├── model/
│   ├── irrigation_rf_model.rds   (generated)
│   ├── preprocess_meta.rds       (generated)
│   ├── train_data.rds            (generated)
│   └── test_data.rds             (generated)
├── scripts/
└── README.md
```

## API Endpoint

```
POST /api/models/irrigation/predict
```

See `backend/app/routes/irrigation.py` for details.
