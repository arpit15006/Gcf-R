#!/usr/bin/env Rscript
# =============================================================================
# preprocess.R — Irrigation Requirement Prediction
# Person 5: Preprocessing pipeline
#
# Responsibilities:
#   1. Load irrigation_prediction.csv
#   2. Check and handle missing / invalid values
#   3. Convert categorical columns to factors
#   4. Split data 80% train / 20% test (reproducible seed)
#   5. Save preprocessing metadata + split datasets as .rds
# =============================================================================

cat("=== Irrigation Preprocessing Pipeline ===\n\n")

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
data_path  <- file.path(base_dir, "data", "irrigation_prediction.csv")
model_dir  <- file.path(base_dir, "model")

if (!dir.exists(model_dir)) dir.create(model_dir, recursive = TRUE)

# --- Load data ---------------------------------------------------------------
cat("Loading dataset:", data_path, "\n")
df <- read.csv(data_path, stringsAsFactors = FALSE)
cat("  Rows:", nrow(df), " Columns:", ncol(df), "\n\n")

# --- Check for missing values ------------------------------------------------
cat("Missing values per column:\n")
na_counts <- colSums(is.na(df))
print(na_counts[na_counts > 0])
if (all(na_counts == 0)) cat("  None found.\n")

# Remove rows with any NA (if any exist)
n_before <- nrow(df)
df <- df[complete.cases(df), ]
n_after <- nrow(df)
if (n_before != n_after) {
  cat("  Removed", n_before - n_after, "rows with missing values.\n")
}
cat("\n")

# --- Define column roles -----------------------------------------------------
categorical_cols <- c(
  "Soil_Type", "Crop_Type", "Crop_Growth_Stage", "Season",
  "Irrigation_Type", "Water_Source", "Mulching_Used", "Region"
)

numeric_cols <- c(
  "Soil_pH", "Soil_Moisture", "Organic_Carbon", "Electrical_Conductivity",
  "Temperature_C", "Humidity", "Rainfall_mm", "Sunlight_Hours",
  "Wind_Speed_kmh", "Field_Area_hectare", "Previous_Irrigation_mm"
)

target_col <- "Irrigation_Need"

# --- Convert categorical columns to factors ----------------------------------
cat("Converting categorical columns to factors...\n")
for (col in categorical_cols) {
  df[[col]] <- as.factor(df[[col]])
  cat("  ", col, ":", nlevels(df[[col]]), "levels ->",
      paste(levels(df[[col]]), collapse = ", "), "\n")
}

# Convert target to factor with explicit level ordering
df[[target_col]] <- factor(df[[target_col]], levels = c("Low", "Medium", "High"))
cat("  ", target_col, ":", nlevels(df[[target_col]]), "levels ->",
    paste(levels(df[[target_col]]), collapse = ", "), "\n\n")

# --- Verify numeric columns --------------------------------------------------
cat("Verifying numeric columns...\n")
for (col in numeric_cols) {
  df[[col]] <- as.numeric(df[[col]])
}
cat("  All numeric columns validated.\n\n")

# --- Target distribution -----------------------------------------------------
cat("Target distribution:\n")
print(table(df[[target_col]]))
cat("\n")

# --- Train / Test split (80/20, reproducible) --------------------------------
set.seed(42)
n <- nrow(df)
train_idx <- sample(seq_len(n), size = floor(0.8 * n))
test_idx  <- setdiff(seq_len(n), train_idx)

train_data <- df[train_idx, ]
test_data  <- df[test_idx, ]

cat("Train set:", nrow(train_data), "rows\n")
cat("Test  set:", nrow(test_data), "rows\n\n")

# --- Save preprocessing metadata --------------------------------------------
# Store factor levels so predict.R can apply identical encoding
factor_levels <- list()
for (col in categorical_cols) {
  factor_levels[[col]] <- levels(df[[col]])
}
factor_levels[[target_col]] <- levels(df[[target_col]])

preprocess_meta <- list(
  categorical_cols = categorical_cols,
  numeric_cols     = numeric_cols,
  target_col       = target_col,
  factor_levels    = factor_levels,
  feature_cols     = c(categorical_cols, numeric_cols)
)

saveRDS(preprocess_meta, file.path(model_dir, "preprocess_meta.rds"))
cat("Saved: preprocess_meta.rds\n")

saveRDS(train_data, file.path(model_dir, "train_data.rds"))
cat("Saved: train_data.rds\n")

saveRDS(test_data, file.path(model_dir, "test_data.rds"))
cat("Saved: test_data.rds\n\n")

cat("=== Preprocessing complete ===\n")
