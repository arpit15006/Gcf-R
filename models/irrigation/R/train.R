#!/usr/bin/env Rscript
# =============================================================================
# train.R — Irrigation Requirement Classification
# Person 5: Train Random Forest (ranger) classifier
#
# Predicts: Irrigation_Need  ∈  {Low, Medium, High}
# Metrics:  Accuracy, Confusion Matrix, Per-class Precision/Recall/F1
# Output:   models/irrigation/model/irrigation_rf_model.rds
# =============================================================================

cat("=== Irrigation Model Training ===\n\n")

# --- Install / load packages ------------------------------------------------
if (!requireNamespace("ranger", quietly = TRUE)) {
  install.packages("ranger", repos = "https://cloud.r-project.org")
}
library(ranger)

# --- Paths -------------------------------------------------------------------
# Robust script-dir detection for Rscript invocation
get_script_dir <- function() {
  args <- commandArgs(trailingOnly = FALSE)
  file_arg <- grep("^--file=", args, value = TRUE)
  if (length(file_arg) > 0) {
    return(dirname(normalizePath(sub("^--file=", "", file_arg[1]))))
  }
  return(getwd())
}
script_dir <- get_script_dir()
base_dir   <- normalizePath(file.path(script_dir, ".."))
model_dir  <- file.path(base_dir, "model")

# --- Load preprocessed data --------------------------------------------------
meta       <- readRDS(file.path(model_dir, "preprocess_meta.rds"))
train_data <- readRDS(file.path(model_dir, "train_data.rds"))
test_data  <- readRDS(file.path(model_dir, "test_data.rds"))

cat("Train rows:", nrow(train_data), "\n")
cat("Test  rows:", nrow(test_data), "\n\n")

# --- Train Random Forest (classification) ------------------------------------
cat("Training Random Forest with ranger...\n")
set.seed(42)

# Use probability = TRUE so we can get class probabilities at prediction time
rf_model <- ranger(
  formula         = Irrigation_Need ~ .,
  data            = train_data,
  num.trees       = 500,
  probability     = TRUE,
  importance      = "impurity",
  seed            = 42
)

cat("  OOB prediction error (1 - accuracy):", round(rf_model$prediction.error, 4), "\n")
cat("  OOB accuracy:", round(1 - rf_model$prediction.error, 4), "\n\n")

# --- Evaluate on test set ----------------------------------------------------
cat("Evaluating on test set...\n")
pred_obj <- predict(rf_model, data = test_data)

# pred_obj$predictions is a matrix of probabilities (rows × classes)
pred_classes <- factor(
  colnames(pred_obj$predictions)[apply(pred_obj$predictions, 1, which.max)],
  levels = levels(test_data$Irrigation_Need)
)

actual <- test_data$Irrigation_Need

# Overall accuracy
accuracy <- mean(pred_classes == actual)
cat("\n  Test Accuracy:", round(accuracy, 4), "\n\n")

# Confusion matrix
cat("Confusion Matrix:\n")
conf_matrix <- table(Predicted = pred_classes, Actual = actual)
print(conf_matrix)
cat("\n")

# Per-class metrics
classes <- levels(actual)
cat("Per-class metrics:\n")
cat(sprintf("  %-8s  Precision  Recall  F1\n", "Class"))
cat("  ", strrep("-", 40), "\n")

for (cls in classes) {
  tp <- sum(pred_classes == cls & actual == cls)
  fp <- sum(pred_classes == cls & actual != cls)
  fn <- sum(pred_classes != cls & actual == cls)

  precision <- if (tp + fp > 0) tp / (tp + fp) else 0
  recall    <- if (tp + fn > 0) tp / (tp + fn) else 0
  f1        <- if (precision + recall > 0) 2 * precision * recall / (precision + recall) else 0

  cat(sprintf("  %-8s  %.4f     %.4f  %.4f\n", cls, precision, recall, f1))
}
cat("\n")

# Feature importance (top 10)
cat("Top 10 feature importances (impurity):\n")
imp <- sort(rf_model$variable.importance, decreasing = TRUE)
top10 <- head(imp, 10)
for (i in seq_along(top10)) {
  cat(sprintf("  %2d. %-28s %.2f\n", i, names(top10)[i], top10[i]))
}
cat("\n")

# --- Save model --------------------------------------------------------------
model_path <- file.path(model_dir, "irrigation_rf_model.rds")
saveRDS(rf_model, model_path)
cat("Model saved:", model_path, "\n")

cat("\n=== Training complete ===\n")
