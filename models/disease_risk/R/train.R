# ==============================================================================
# Disease Risk Prediction - Model Training Pipeline
# Smart Agriculture Intelligence Dashboard
# ==============================================================================

suppressPackageStartupMessages({
  if (!requireNamespace("randomForest", quietly = TRUE)) {
    install.packages("randomForest", repos = "https://cloud.r-project.org", quiet = TRUE)
  }
  if (!requireNamespace("jsonlite", quietly = TRUE)) {
    install.packages("jsonlite", repos = "https://cloud.r-project.org", quiet = TRUE)
  }
  library(randomForest)
  library(jsonlite)
})

# Find and source preprocess.R
source_preprocess <- function() {
  candidates <- c(
    "models/disease_risk/R/preprocess.R",
    "R/preprocess.R",
    "preprocess.R",
    "/Users/arpitpatel/Desktop/GCF/models/disease_risk/R/preprocess.R"
  )
  found <- candidates[file.exists(candidates)][1]
  if (is.na(found)) stop("Could not locate preprocess.R")
  source(found)
}

source_preprocess()

train_model <- function(output_dir = "models/disease_risk/model") {
  cat("=========================================================\n")
  cat("🌱 Starting Crop Disease Risk Model Training\n")
  cat("=========================================================\n")

  # 1. Load and prepare dataset
  data_obj <- load_and_preprocess_data()
  train_data <- data_obj$train
  test_data <- data_obj$test
  levels_list <- list(
    Plant_Type = levels(train_data$Plant_Type),
    Leaf_Color = levels(train_data$Leaf_Color),
    Disease_Status = levels(train_data$Disease_Status)
  )

  # 2. Train Random Forest Model with Stratified Sampling
  cat("\nFitting Random Forest Classifier (ntree = 200, stratified sampling, importance = TRUE)...\n")
  set.seed(42)
  tb <- table(train_data$Disease_Status)
  min_n <- tb["Severe Infection"]
  
  # Sample sizes ensuring minority infection classes get robust tree representations
  strat_samples <- c(
    Healthy = as.numeric(min_n * 2),
    `Mild Infection` = as.numeric(min_n * 1.5),
    `Severe Infection` = as.numeric(min_n)
  )

  rf_model <- randomForest(
    Disease_Status ~ Plant_Type + Leaf_Color + Leaf_Spot_Size + Humidity + Temperature,
    data = train_data,
    ntree = 200,
    strata = train_data$Disease_Status,
    sampsize = strat_samples,
    importance = TRUE,
    keep.forest = TRUE
  )
  print(rf_model)

  # 3. Model Evaluation on Test Set
  cat("\nEvaluating on holdout test set (N =", nrow(test_data), ")...\n")
  predictions <- predict(rf_model, newdata = test_data)
  pred_probs <- predict(rf_model, newdata = test_data, type = "prob")

  cm <- table(Actual = test_data$Disease_Status, Predicted = predictions)
  cat("\nConfusion Matrix:\n")
  print(cm)

  # Accuracy
  accuracy <- sum(diag(cm)) / sum(cm)
  cat(sprintf("\nOverall Accuracy: %.4f (%.2f%%)\n", accuracy, accuracy * 100))

  # Precision, Recall, F1 for each class
  classes <- levels(test_data$Disease_Status)
  class_metrics <- list()
  precision_vec <- c()
  recall_vec <- c()
  f1_vec <- c()

  for (cls in classes) {
    tp <- cm[cls, cls]
    fp <- sum(cm[, cls]) - tp
    fn <- sum(cm[cls, ]) - tp

    precision <- if ((tp + fp) > 0) tp / (tp + fp) else 0
    recall <- if ((tp + fn) > 0) tp / (tp + fn) else 0
    f1 <- if ((precision + recall) > 0) 2 * (precision * recall) / (precision + recall) else 0

    precision_vec <- c(precision_vec, precision)
    recall_vec <- c(recall_vec, recall)
    f1_vec <- c(f1_vec, f1)

    class_metrics[[cls]] <- list(
      precision = round(as.numeric(precision), 4),
      recall = round(as.numeric(recall), 4),
      f1_score = round(as.numeric(f1), 4),
      support = as.numeric(sum(cm[cls, ]))
    )
    cat(sprintf("  [%s] Precision: %.4f | Recall: %.4f | F1: %.4f\n", cls, precision, recall, f1))
  }

  macro_f1 <- mean(f1_vec)
  cat(sprintf("Macro-averaged F1 Score: %.4f\n", macro_f1))

  # 4. Feature Importance
  cat("\nCalculating Feature Importance...\n")
  imp <- importance(rf_model)
  print(imp)

  # Normalize MeanDecreaseGini to 0-100 scale for UI factor visualization
  raw_gini <- imp[, "MeanDecreaseGini"]
  norm_importance <- as.list(round((raw_gini / sum(raw_gini)) * 100, 2))

  # Friendly labels for features
  feature_labels <- list(
    Humidity = "Air Humidity",
    Temperature = "Ambient Temperature",
    Leaf_Spot_Size = "Leaf Spot Size",
    Leaf_Color = "Leaf Discoloration",
    Plant_Type = "Crop Species"
  )

  importance_list <- list()
  for (feat in names(norm_importance)) {
    importance_list[[feat]] <- list(
      label = if (!is.null(feature_labels[[feat]])) feature_labels[[feat]] else feat,
      percentage = norm_importance[[feat]],
      score = round(imp[feat, "MeanDecreaseGini"], 2)
    )
  }

  # 5. Save Artifacts
  if (!dir.exists(output_dir)) {
    dir.create(output_dir, recursive = TRUE)
  }

  model_file <- file.path(output_dir, "disease_model.rds")
  saveRDS(list(
    model = rf_model,
    levels = levels_list,
    features = data_obj$feature_names,
    feature_importance = importance_list,
    trained_at = as.character(Sys.time()),
    metrics = list(
      accuracy = round(accuracy, 4),
      macro_f1 = round(macro_f1, 4),
      class_metrics = class_metrics
    )
  ), file = model_file)
  cat("\nModel successfully saved to:", model_file, "\n")

  # Write feature_importance.json for fast reference
  write_json(importance_list, file.path(output_dir, "feature_importance.json"), auto_unbox = TRUE, pretty = TRUE)
  
  # Write metrics.json
  metrics_output <- list(
    accuracy = round(accuracy, 4),
    macro_f1 = round(macro_f1, 4),
    class_metrics = class_metrics,
    test_samples = nrow(test_data),
    train_samples = nrow(train_data)
  )
  write_json(metrics_output, file.path(output_dir, "metrics.json"), auto_unbox = TRUE, pretty = TRUE)

  cat("Metrics and feature importance saved as JSON in:", output_dir, "\n")
  cat("=========================================================\n")
}

if (!interactive()) {
  train_model()
}
