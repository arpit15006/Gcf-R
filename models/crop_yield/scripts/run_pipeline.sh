#!/usr/bin/env bash
# End-to-end training & prediction pipeline execution script for Crop Yield model

set -e

echo "================================================="
echo "  Crop Yield Prediction ML Pipeline Execution    "
echo "================================================="

# Locate Rscript binary
RSCRIPT_BIN=""
if command -v Rscript &> /dev/null; then
    RSCRIPT_BIN="Rscript"
elif [ -f "$HOME/.local/bin/micromamba" ]; then
    RSCRIPT_BIN="$HOME/.local/bin/micromamba run -n crop-env Rscript"
else
    echo "Error: Rscript binary not found."
    exit 1
fi

echo "Using Rscript runner: $RSCRIPT_BIN"

# Step 1: Preprocess Dataset
echo ""
echo "[Step 1/3] Running dataset preprocessing..."
$RSCRIPT_BIN models/crop_yield/R/preprocess.R

# Step 2: Train Regression Model
echo ""
echo "[Step 2/3] Training Crop Yield Linear Regression Model..."
$RSCRIPT_BIN models/crop_yield/R/train.R

# Step 3: Run Test Prediction
echo ""
echo "[Step 3/3] Running sample prediction..."
$RSCRIPT_BIN models/crop_yield/R/predict.R '{"rainfall": 1200, "fertilizer": 75, "temperature": 28, "nitrogen": 80, "phosphorus": 25, "potassium": 20}'

echo ""
echo "================================================="
echo " Pipeline execution completed successfully!       "
echo "================================================="
