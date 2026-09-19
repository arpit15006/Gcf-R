# Preprocessing module for Crop Recommendation ML Pipeline
# Handles data loading, schema validation, type casting, missing value checks, and data scaling/formatting.

preprocess_crop_data <- function(file_path) {
  if (!file.exists(file_path)) {
    stop(paste("Data file not found at:", file_path))
  }
  
  df <- read.csv(file_path, stringsAsFactors = FALSE)
  
  # Required columns
  required_cols <- c("N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label")
  missing_cols <- setdiff(required_cols, names(df))
  
  if (length(missing_cols) > 0) {
    stop(paste("Missing required columns in dataset:", paste(missing_cols, collapse = ", ")))
  }
  
  # Remove rows with NA values in required columns
  df <- df[complete.cases(df[, required_cols]), ]
  
  # Convert features to numeric
  feature_cols <- c("N", "P", "K", "temperature", "humidity", "ph", "rainfall")
  for (col in feature_cols) {
    df[[col]] <- as.numeric(df[[col]])
  }
  
  # Convert target label to factor
  df$label <- as.factor(trimws(df$label))
  
  cat(sprintf("[preprocess.R] Successfully preprocessed %d samples across %d classes.\n", nrow(df), length(levels(df$label))))
  return(df)
}

validate_predict_input <- function(N, P, K, temperature, humidity, ph, rainfall) {
  # Parse inputs to numeric values
  n_val <- as.numeric(N)
  p_val <- as.numeric(P)
  k_val <- as.numeric(K)
  temp_val <- as.numeric(temperature)
  hum_val <- as.numeric(humidity)
  ph_val <- as.numeric(ph)
  rain_val <- as.numeric(rainfall)
  
  if (any(is.na(c(n_val, p_val, k_val, temp_val, hum_val, ph_val, rain_val)))) {
    stop("Invalid input: All features (N, P, K, temperature, humidity, ph, rainfall) must be valid numbers.")
  }
  
  new_data <- data.frame(
    N = n_val,
    P = p_val,
    K = k_val,
    temperature = temp_val,
    humidity = hum_val,
    ph = ph_val,
    rainfall = rain_val
  )
  
  return(new_data)
}
