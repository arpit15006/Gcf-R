@echo off
echo ====================================================
echo  🌱 Smart Agriculture - Crop Recommendation Pipeline
echo ====================================================
echo.

echo [1/2] Running Model Training...
Rscript models/crop_recommendation/R/train.R
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Model training failed.
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Running Sample Prediction Test (Rice Sample)...
Rscript models/crop_recommendation/R/predict.R 90 42 43 20.87 82.0 6.5 202.93
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Prediction test failed.
    exit /b %ERRORLEVEL%
)

echo.
echo ✅ Crop Recommendation ML Pipeline executed successfully!
echo ====================================================
