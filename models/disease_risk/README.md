# 🦠 Disease Risk Prediction Model

## Overview
The **Disease Risk Prediction** module provides data-driven diagnostics and risk stratification for agricultural crops based on plant characteristics and ambient climate conditions.

This module is owned by **Person 4** (Backend & Machine Learning) and **Person 1** (Dashboard & Navigation).

---

## Dataset Documentation

### Source
- **File**: `plant_disease_data.csv` (located in `models/disease_risk/data/plant_disease_data.csv` and project root)
- **Observations**: 2,500 agricultural field samples
- **Attributes**: 7 features (1 identifier, 2 categorical factors, 3 continuous numeric metrics, 1 categorical target)

### Feature Schema
| Variable | Type | Range / Categories | Description |
| :--- | :--- | :--- | :--- |
| `Plant_ID` | Identifier | `PLANT_0001` - `PLANT_2500` | Sample identifier (dropped during training) |
| `Plant_Type` | Categorical | `Corn`, `Potato`, `Rice`, `Tomato`, `Wheat` | Cultivated crop species |
| `Leaf_Color` | Categorical | `Brown`, `Green`, `Yellow` | Observable foliar pigmentation |
| `Leaf_Spot_Size` | Numeric | `0.01` – `10.00` cm | Diameter of observable leaf lesions |
| `Humidity` | Numeric | `30.04%` – `90.00%` | Relative atmospheric humidity percentage |
| `Temperature` | Numeric | `15.00°C` – `35.00°C` | Ambient canopy temperature |
| `Disease_Status` | Target | `Healthy`, `Mild Infection`, `Severe Infection` | Agronomic diagnosis of disease presence |

### Target Mapping & Risk Levels
- **Healthy**: `LOW` Risk — No significant fungal or bacterial outbreak detected.
- **Mild Infection**: `MEDIUM` Risk — Early or localized infection requiring monitoring and preventive intervention.
- **Severe Infection**: `HIGH` Risk — Critical pathology requiring immediate crop protection and treatment.

### Dataset Distribution & Limitations
- **Class Imbalance**: The dataset contains 1,744 Healthy (69.8%), 500 Mild Infection (20.0%), and 256 Severe Infection (10.2%) records.
- **Limitations**: The environmental features exhibit overlapping distributions across disease states. To prevent the classifier from collapsing exclusively into majority-class predictions ("Healthy"), stratified sampling (`sampsize`) is utilized during tree induction to ensure balanced exposure across disease severity classes.

---

## Machine Learning Architecture

The model is built in **R** using a **Random Forest Classifier** (`randomForest` package):
- **Number of Trees (`ntree`)**: 200
- **Sampling**: Stratified class representation
- **Splits (`mtry`)**: 2 variables tried per node split
- **Feature Importance**: Evaluated via Mean Decrease in Gini impurity and Mean Decrease in Accuracy.

### Model Metrics (Holdout Evaluation)
- **Overall Accuracy**: ~60.4%
- **Healthy Class F1**: ~0.76
- **Feature Importance Hierarchy**:
  1. Air Humidity (`Humidity`)
  2. Ambient Temperature (`Temperature`)
  3. Leaf Spot Size (`Leaf_Spot_Size`)
  4. Crop Species (`Plant_Type`)
  5. Leaf Discoloration (`Leaf_Color`)

---

## File Structure & Usage

```text
models/disease_risk/
├── data/
│   └── plant_disease_data.csv      # Cleaned training dataset
├── R/
│   ├── preprocess.R                # Data ingestion, validation, and encoding
│   ├── train.R                     # Model training, metric logging, and serialization
│   └── predict.R                   # Clean CLI and JSON inference engine
├── model/
│   ├── disease_model.rds           # Serialized Random Forest model bundle
│   ├── feature_importance.json     # Normalized feature importance scores
│   └── metrics.json                # Holdout test metrics
└── README.md                       # Module documentation
```

### Running the R Pipeline Manually

1. **Preprocess data**:
   ```bash
   Rscript models/disease_risk/R/preprocess.R
   ```

2. **Train model**:
   ```bash
   Rscript models/disease_risk/R/train.R
   ```

3. **Inference test**:
   ```bash
   Rscript models/disease_risk/R/predict.R '{"crop":"Corn","leaf_color":"Brown","leaf_spot_size":3.8,"humidity":69.49,"temperature":30.68}'
   ```
