# Model Training Script for Crop Yield Regression in R
# Trains a Multiple Linear Regression model on cleaned crop yield data,
# computes evaluation metrics (R-squared, RMSE, MAE), and serializes the model artifact.

suppressPackageStartupMessages({
  library(jsonlite)
})

cat("=== Starting Crop Yield Model Training ===\n")

# File paths
clean_path <- "models/crop_yield/data/crop_yield_cleaned.csv"
model_path <- "models/crop_yield/model/crop_yield_model.rds"
metrics_path <- "models/crop_yield/model/metrics.json"

if (!file.exists(clean_path)) {
  stop(paste("Cleaned dataset not found at:", clean_path))
}

# Read cleaned dataset
df <- read.csv(clean_path, stringsAsFactors = FALSE)
cat(sprintf("Loaded dataset with %d observations.\n", nrow(df)))

# Train/Test Split (80% Train, 20% Test)
set.seed(42)
n <- nrow(df)
train_indices <- sample(1:n, size = round(0.8 * n))
train_data <- df[train_indices, ]
test_data  <- df[-train_indices, ]

cat(sprintf("Train set: %d samples, Test set: %d samples.\n", nrow(train_data), nrow(test_data)))

# Fit Linear Regression Model
model <- lm(yield ~ rainfall + fertilizer + temperature + nitrogen + phosphorus + potassium, data = train_data)

# Print Summary
model_summary <- summary(model)
cat("\n--- Model Summary ---\n")
print(model_summary)

# Evaluate on Test Set
test_preds <- predict(model, newdata = test_data)
test_actuals <- test_data$yield

# Performance Metrics
rmse <- sqrt(mean((test_preds - test_actuals)^2))
mae  <- mean(abs(test_preds - test_actuals))

# R-squared calculation
ss_total <- sum((test_actuals - mean(test_actuals))^2)
ss_res   <- sum((test_actuals - test_preds)^2)
r2_test  <- 1 - (ss_res / ss_total)
r2_train <- model_summary$r.squared

cat("\n--- Test Set Evaluation --- \n")
cat(sprintf("Train R²: %.4f\n", r2_train))
cat(sprintf("Test R²:  %.4f\n", r2_test))
cat(sprintf("RMSE:     %.4f\n", rmse))
cat(sprintf("MAE:      %.4f\n", mae))

# Feature Coefficients
coef_vals <- as.list(coef(model))

# Store Metrics JSON
metrics <- list(
  model_type = "Multiple Linear Regression",
  target = "yield",
  unit = "Q/acre",
  train_samples = nrow(train_data),
  test_samples = nrow(test_data),
  train_r2 = round(r2_train, 4),
  test_r2 = round(r2_test, 4),
  rmse = round(rmse, 4),
  mae = round(mae, 4),
  coefficients = coef_vals,
  feature_names = c("rainfall", "fertilizer", "temperature", "nitrogen", "phosphorus", "potassium"),
  feature_ranges = list(
    rainfall = list(min = min(df$rainfall), max = max(df$rainfall), mean = round(mean(df$rainfall), 2)),
    fertilizer = list(min = min(df$fertilizer), max = max(df$fertilizer), mean = round(mean(df$fertilizer), 2)),
    temperature = list(min = min(df$temperature), max = max(df$temperature), mean = round(mean(df$temperature), 2)),
    nitrogen = list(min = min(df$nitrogen), max = max(df$nitrogen), mean = round(mean(df$nitrogen), 2)),
    phosphorus = list(min = min(df$phosphorus), max = max(df$phosphorus), mean = round(mean(df$phosphorus), 2)),
    potassium = list(min = min(df$potassium), max = max(df$potassium), mean = round(mean(df$potassium), 2))
  )
)

# Save RDS Model
saveRDS(model, model_path)
cat(sprintf("Saved trained model to: %s\n", model_path))

# Save Metrics JSON
jsonlite::write_json(metrics, metrics_path, auto_unbox = TRUE, pretty = TRUE)
cat(sprintf("Saved metrics to: %s\n", metrics_path))

cat("=== Model Training Complete ===\n")
