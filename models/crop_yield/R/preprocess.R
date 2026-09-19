# Preprocessing Script for Crop Yield Dataset
# Cleans raw dataset, handles missing values/string artifacts, normalizes column names, and saves processed CSV.

suppressPackageStartupMessages({
  library(jsonlite)
})

cat("=== Starting Crop Yield Preprocessing ===\n")

# File paths
raw_path <- "models/crop_yield/data/crop_yield_raw.csv"
clean_path <- "models/crop_yield/data/crop_yield_cleaned.csv"

if (!file.exists(raw_path)) {
  stop(paste("Raw data file not found at:", raw_path))
}

# Read raw dataset
df <- read.csv(raw_path, stringsAsFactors = FALSE)

cat(sprintf("Loaded raw dataset with %d rows and %d columns.\n", nrow(df), ncol(df)))

# Rename columns to clean, standard identifiers
colnames(df) <- c("rainfall", "fertilizer", "temperature", "nitrogen", "phosphorus", "potassium", "yield")

# Convert columns to numeric, coercing non-numeric strings (e.g. ':') to NA
df$rainfall <- as.numeric(df$rainfall)
df$fertilizer <- as.numeric(df$fertilizer)
df$temperature <- as.numeric(df$temperature)
df$nitrogen <- as.numeric(df$nitrogen)
df$phosphorus <- as.numeric(df$phosphorus)
df$potassium <- as.numeric(df$potassium)
df$yield <- as.numeric(df$yield)

# Remove rows where target variable 'yield' is missing
initial_rows <- nrow(df)
df <- df[!is.na(df$yield), ]
cat(sprintf("Removed %d rows missing target 'yield'. Remaining: %d rows.\n", initial_rows - nrow(df), nrow(df)))

# Impute missing predictor values using column median
feature_cols <- c("rainfall", "fertilizer", "temperature", "nitrogen", "phosphorus", "potassium")
for (col in feature_cols) {
  na_count <- sum(is.na(df[[col]]))
  if (na_count > 0) {
    med_val <- median(df[[col]], na.rm = TRUE)
    df[[col]][is.na(df[[col]])] <- med_val
    cat(sprintf("Imputed %d missing values in '%s' with median value: %.2f\n", na_count, col, med_val))
  }
}

# Save cleaned dataset
write.csv(df, clean_path, row.names = FALSE)
cat(sprintf("Cleaned dataset successfully saved to: %s (%d rows)\n", clean_path, nrow(df)))
cat("=== Preprocessing Complete ===\n")
