# 📈 Crop Yield Prediction Model (PERSON 3)

This directory contains the **R-based Machine Learning Regression Pipeline** for predicting crop yield based on environmental and soil parameters.

---

## 📁 Directory Structure

```text
models/crop_yield/
├── data/
│   ├── crop_yield_raw.csv        # Extracted raw dataset
│   └── crop_yield_cleaned.csv    # Preprocessed dataset (imputed & cleaned)
├── R/
│   ├── preprocess.R              # Cleans string artifacts and handles missing data
│   ├── train.R                   # Trains Multiple Linear Regression model
│   └── predict.R                 # Inference script with 95% prediction interval
├── model/
│   ├── crop_yield_model.rds      # Serialized R model artifact
│   └── metrics.json              # Model evaluation metrics & feature statistics
├── scripts/
│   └── run_pipeline.sh           # Automated script to run end-to-end ML workflow
└── README.md                     # Model documentation
```

---

## 📊 Dataset Overview

The dataset (`crop yield data sheet.xlsx`) contains **109 records** with 6 predictor features and 1 continuous target variable:

| Feature Name | Description | Data Type | Range / Unit |
| :--- | :--- | :--- | :--- |
| **`Rain Fall (mm)`** | Annual / Seasonal Rainfall | Numeric | 400.0 – 1300.0 mm |
| **`Fertilizer`** | Fertilizer application rate | Numeric | 50.0 – 80.0 kg/acre |
| **`Temperatue`** | Average Ambient Temperature | Numeric | 24.0 – 40.0 °C |
| **`Nitrogen (N)`** | Soil Nitrogen concentration | Numeric | 60.0 – 100.0 kg/ha |
| **`Phosphorus (P)`** | Soil Phosphorus concentration | Numeric | 10.0 – 40.0 kg/ha |
| **`Potassium (K)`** | Soil Potassium concentration | Numeric | 15.0 – 22.0 kg/ha |
| **`Yeild (Q/acre)`** | **Target variable**: Crop Yield | Numeric | **5.5 – 12.0 Quintals/acre** |

---

## 🧹 Preprocessing (`R/preprocess.R`)

- **Artifact Handling**: Converts non-numeric string values (e.g. `':'` in `Temperatue`) to `NA`.
- **Target Filtering**: Removes rows with missing target yield values (`99` clean rows retained).
- **Imputation**: Imputes missing predictor values using column medians to maintain sample size and distribution stability.
- **Normalization**: Standardizes column names (`rainfall`, `fertilizer`, `temperature`, `nitrogen`, `phosphorus`, `potassium`, `yield`).

---

## 🤖 Model Architecture & Evaluation (`R/train.R`)

A **Multiple Linear Regression (`lm`)** model is trained with an **80/20 train-test split** (`set.seed(42)`):

$$\text{Yield} = \beta_0 + \beta_1 \cdot \text{Rainfall} + \beta_2 \cdot \text{Fertilizer} + \beta_3 \cdot \text{Temperature} + \beta_4 \cdot \text{Nitrogen} + \beta_5 \cdot \text{Phosphorus} + \beta_6 \cdot \text{Potassium}$$

### Performance Metrics

- **Train $R^2$**: **88.17%**
- **Test $R^2$**: **89.48%**
- **RMSE**: **0.6369 Q/acre**
- **MAE**: **0.5150 Q/acre**

---

## 🔮 Inference & API Integration (`R/predict.R`)

Predictions are performed using `predict.R`, which accepts a JSON string payload via CLI or standard input and outputs JSON containing:

1. **Predicted Yield** (`predicted_yield`): Point prediction in **`Q/acre`** (Quintals/acre).
2. **Confidence / Prediction Interval**: 95% lower and upper bounds (`lower`, `upper`).
3. **Model Accuracy Metadata**: Test $R^2$ and RMSE.

### Example CLI Command:

```bash
Rscript models/crop_yield/R/predict.R '{"rainfall": 1200, "fertilizer": 75, "temperature": 28, "nitrogen": 80, "phosphorus": 25, "potassium": 20}'
```

### Example Output JSON:

```json
{
  "status": "success",
  "data": {
    "predicted_yield": 11.39,
    "unit": "Q/acre",
    "confidence_interval": {
      "lower": 9.9,
      "upper": 12.88,
      "level": "95%"
    },
    "model_metrics": {
      "r2": 0.8948,
      "rmse": 0.6369,
      "mae": 0.515
    }
  }
}
```

---

## 🚀 Running the Pipeline

To re-run the full pipeline (preprocess, train, and run test prediction):

```bash
./models/crop_yield/scripts/run_pipeline.sh
```
