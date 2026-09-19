#!/usr/bin/env Rscript
# =============================================================================
# predict.R — Irrigation Requirement Prediction (inference)
# Person 5
#
# Usage:
#   Rscript predict.R <input.json>
#   Rscript predict.R              (uses built-in sample for testing)
#
# Input JSON keys: the 19 feature columns
# Output JSON:
#   { "irrigation_need": "High",
#     "confidence": 0.87,
#     "probabilities": { "Low": 0.03, "Medium": 0.10, "High": 0.87 } }
# =============================================================================

# --- Install / load packages ------------------------------------------------
if (!requireNamespace("jsonlite", quietly = TRUE)) {
  install.packages("jsonlite", repos = "https://cloud.r-project.org")
}
if (!requireNamespace("ranger", quietly = TRUE)) {
  install.packages("ranger", repos = "https://cloud.r-project.org")
}
library(jsonlite)
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

# --- Load model + preprocessing metadata ------------------------------------
rf_model <- readRDS(file.path(model_dir, "irrigation_rf_model.rds"))
meta     <- readRDS(file.path(model_dir, "preprocess_meta.rds"))

# --- Read input --------------------------------------------------------------
args <- commandArgs(trailingOnly = TRUE)

if (length(args) >= 1) {
  input_path <- args[1]
  input_json <- fromJSON(readLines(input_path, warn = FALSE))
} else {
  # Default sample for quick testing
  input_json <- list(
    Soil_Type              = "Clay",
    Soil_pH                = 6.14,
    Soil_Moisture          = 36.48,
    Organic_Carbon         = 0.42,
    Electrical_Conductivity = 2.17,
    Temperature_C          = 21.9,
    Humidity               = 31.19,
    Rainfall_mm            = 1167.7,
    Sunlight_Hours         = 4.01,
    Wind_Speed_kmh         = 1.97,
    Crop_Type              = "Wheat",
    Crop_Growth_Stage      = "Vegetative",
    Season                 = "Rabi",
    Irrigation_Type        = "Rainfed",
    Water_Source            = "Reservoir",
    Field_Area_hectare     = 4.73,
    Mulching_Used          = "Yes",
    Previous_Irrigation_mm = 1.98,
    Region                 = "South"
  )
  cat("No input file provided — using built-in sample.\n\n", file = stderr())
}

# --- Build a single-row data frame with correct types ------------------------
row_list <- list()

# Categorical columns: convert to factors with the trained model's levels
for (col in meta$categorical_cols) {
  val <- as.character(input_json[[col]])
  row_list[[col]] <- factor(val, levels = meta$factor_levels[[col]])
}

# Numeric columns
for (col in meta$numeric_cols) {
  row_list[[col]] <- as.numeric(input_json[[col]])
}

new_data <- as.data.frame(row_list, stringsAsFactors = FALSE)

# --- Predict -----------------------------------------------------------------
pred <- predict(rf_model, data = new_data)

# pred$predictions is a 1-row probability matrix
probs     <- as.numeric(pred$predictions[1, ])
class_names <- colnames(pred$predictions)
names(probs) <- class_names

best_idx  <- which.max(probs)
best_class <- class_names[best_idx]
confidence <- round(probs[best_idx], 4)

# Round probabilities for clean output
prob_list <- as.list(round(probs, 4))

# --- Output JSON -------------------------------------------------------------
result <- list(
  irrigation_need = best_class,
  confidence      = confidence,
  probabilities   = prob_list
)

cat(toJSON(result, auto_unbox = TRUE, pretty = TRUE))
cat("\n")
