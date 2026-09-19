# Prediction Script for Crop Yield Model in R
# Takes input JSON string as CLI argument or stdin, loads serialized R model (.rds),
# performs inference with 95% prediction interval, and outputs JSON formatted result.

suppressPackageStartupMessages({
  library(jsonlite)
})

# File paths
model_path <- "models/crop_yield/model/crop_yield_model.rds"
metrics_path <- "models/crop_yield/model/metrics.json"

# Helper function to return error JSON
error_exit <- function(msg) {
  res <- list(
    status = "error",
    message = msg
  )
  cat(jsonlite::toJSON(res, auto_unbox = TRUE))
  q(status = 1)
}

# Ensure model exists
if (!file.exists(model_path)) {
  error_exit(paste("Model file not found at:", model_path))
}

# Parse input JSON argument
args <- commandArgs(trailingOnly = TRUE)
input_json <- ""

if (length(args) > 0) {
  input_json <- args[1]
} else {
  # Read stdin if no arg provided
  f <- file("stdin")
  open(f)
  input_json <- readLines(f, warn = FALSE)
  close(f)
  input_json <- paste(input_json, collapse = "")
}

if (nchar(trimws(input_json)) == 0) {
  error_exit("No input JSON provided to predict.R")
}

input_data <- tryCatch({
  jsonlite::fromJSON(input_json)
}, error = function(e) {
  error_exit(paste("Failed to parse input JSON:", e$message))
})

# Validate required inputs
required_fields <- c("rainfall", "fertilizer", "temperature", "nitrogen", "phosphorus", "potassium")
missing_fields <- setdiff(required_fields, names(input_data))

if (length(missing_fields) > 0) {
  error_exit(paste("Missing required input fields:", paste(missing_fields, collapse = ", ")))
}

# Extract numeric values
rainfall    <- as.numeric(input_data$rainfall)
fertilizer  <- as.numeric(input_data$fertilizer)
temperature <- as.numeric(input_data$temperature)
nitrogen    <- as.numeric(input_data$nitrogen)
phosphorus  <- as.numeric(input_data$phosphorus)
potassium   <- as.numeric(input_data$potassium)

if (any(is.na(c(rainfall, fertilizer, temperature, nitrogen, phosphorus, potassium)))) {
  error_exit("All input parameters must be valid numeric values.")
}

# Load Model
model <- tryCatch({
  readRDS(model_path)
}, error = function(e) {
  error_exit(paste("Failed to load model RDS:", e$message))
})

# Load Metrics metadata if available
metrics_meta <- list(test_r2 = 0.8948, rmse = 0.6369)
if (file.exists(metrics_path)) {
  metrics_meta <- tryCatch({
    jsonlite::fromJSON(metrics_path)
  }, error = function(e) metrics_meta)
}

# Construct newdata dataframe for model prediction
newdata <- data.frame(
  rainfall = rainfall,
  fertilizer = fertilizer,
  temperature = temperature,
  nitrogen = nitrogen,
  phosphorus = phosphorus,
  potassium = potassium
)

# Predict point estimate and 95% prediction interval
pred_res <- predict(model, newdata = newdata, interval = "prediction", level = 0.95)

point_pred <- round(as.numeric(pred_res[1, "fit"]), 2)
lower_bound <- round(as.numeric(pred_res[1, "lwr"]), 2)
upper_bound <- round(as.numeric(pred_res[1, "upr"]), 2)

# Ensure non-negative crop yield prediction
point_pred  <- max(0, point_pred)
lower_bound <- max(0, lower_bound)
upper_bound <- max(point_pred, upper_bound)

output <- list(
  status = "success",
  data = list(
    predicted_yield = point_pred,
    unit = "Q/acre",
    confidence_interval = list(
      lower = lower_bound,
      upper = upper_bound,
      level = "95%"
    ),
    model_metrics = list(
      r2 = metrics_meta$test_r2,
      rmse = metrics_meta$rmse,
      mae = metrics_meta$mae
    ),
    inputs = list(
      rainfall = rainfall,
      fertilizer = fertilizer,
      temperature = temperature,
      nitrogen = nitrogen,
      phosphorus = phosphorus,
      potassium = potassium
    )
  )
)

cat(jsonlite::toJSON(output, auto_unbox = TRUE, pretty = TRUE))
