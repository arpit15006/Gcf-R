# Prediction script for Crop Recommendation ML Model using R
# Usage: Rscript predict.R <N> <P> <K> <temperature> <humidity> <ph> <rainfall>

suppressPackageStartupMessages({
  library(rpart)
})

get_script_dir <- function() {
  args <- commandArgs(trailingOnly = FALSE)
  file_arg <- "--file="
  match <- grep(file_arg, args)
  if (length(match) > 0) {
    return(dirname(normalizePath(sub(file_arg, "", args[match]))))
  } else {
    return(file.path(getwd(), "models", "crop_recommendation", "R"))
  }
}

script_dir <- get_script_dir()
preprocess_path <- file.path(script_dir, "preprocess.R")
if (!file.exists(preprocess_path)) {
  preprocess_path <- "models/crop_recommendation/R/preprocess.R"
}
source(preprocess_path)

base_dir <- dirname(script_dir)
model_path <- file.path(base_dir, "model", "crop_model.rds")
if (!file.exists(model_path)) {
  model_path <- "models/crop_recommendation/model/crop_model.rds"
}

# Read CLI arguments
cli_args <- commandArgs(trailingOnly = TRUE)

# Handle help or missing arguments
if (length(cli_args) < 7) {
  err_msg <- sprintf("Expected 7 parameters (N, P, K, temperature, humidity, ph, rainfall), received %d.", length(cli_args))
  cat(sprintf('{"success": false, "error": "%s"}\n', err_msg))
  quit(status = 1)
}

N <- cli_args[1]
P <- cli_args[2]
K <- cli_args[3]
temperature <- cli_args[4]
humidity <- cli_args[5]
ph <- cli_args[6]
rainfall <- cli_args[7]

tryCatch({
  if (!file.exists(model_path)) {
    stop(paste("Trained model artifact not found at:", model_path))
  }
  
  input_df <- validate_predict_input(N, P, K, temperature, humidity, ph, rainfall)
  model <- readRDS(model_path)
  
  # Predict probabilities for all classes
  probs <- predict(model, input_df, type = "prob")
  prob_vector <- probs[1, ]
  
  # Sort probabilities in descending order
  sorted_probs <- sort(prob_vector, decreasing = TRUE)
  
  best_crop <- names(sorted_probs)[1]
  best_confidence <- as.numeric(sorted_probs[1])
  
  # Ensure confidence is formatted properly (non-zero minimum floor for UX stability)
  if (best_confidence == 0) best_confidence <- 1.0 / length(prob_vector)
  
  # Extract top alternative predictions
  alt_json_list <- c()
  top_alts <- sorted_probs[2:min(4, length(sorted_probs))]
  for (crop_name in names(top_alts)) {
    conf_val <- as.numeric(top_alts[crop_name])
    alt_json_list <- c(alt_json_list, sprintf('{"crop": "%s", "confidence": %.4f}', crop_name, conf_val))
  }
  alts_str <- paste(alt_json_list, collapse = ", ")
  
  # Output JSON response to STDOUT
  cat(sprintf('{
  "success": true,
  "recommended_crop": "%s",
  "confidence": %.4f,
  "confidence_percentage": %.2f,
  "top_alternatives": [%s],
  "inputs": {
    "N": %s,
    "P": %s,
    "K": %s,
    "temperature": %s,
    "humidity": %s,
    "ph": %s,
    "rainfall": %s
  }
}\n', 
  best_crop, 
  best_confidence, 
  best_confidence * 100, 
  alts_str, 
  input_df$N, input_df$P, input_df$K, input_df$temperature, input_df$humidity, input_df$ph, input_df$rainfall))

}, error = function(e) {
  clean_err <- gsub('"', '\\"', e$message)
  cat(sprintf('{"success": false, "error": "%s"}\n', clean_err))
  quit(status = 1)
})
