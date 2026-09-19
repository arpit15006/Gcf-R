# ==============================================================================
# Disease Risk Prediction - Inference Engine
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

# Locate model file
find_model_file <- function() {
  candidates <- c(
    "models/disease_risk/model/disease_model.rds",
    "model/disease_model.rds",
    "../model/disease_model.rds",
    "/Users/arpitpatel/Desktop/GCF/models/disease_risk/model/disease_model.rds"
  )
  found <- candidates[file.exists(candidates)][1]
  if (is.na(found)) {
    stop("Trained model file (disease_model.rds) not found. Please run train.R first.")
  }
  return(found)
}

map_risk_level <- function(prediction) {
  switch(
    as.character(prediction),
    "Healthy" = "LOW",
    "Mild Infection" = "MEDIUM",
    "Severe Infection" = "HIGH",
    "UNKNOWN"
  )
}

run_prediction <- function(input_data, model_path = NULL) {
  if (is.null(model_path)) {
    model_path <- find_model_file()
  }

  model_bundle <- readRDS(model_path)
  rf_model <- model_bundle$model
  model_levels <- model_bundle$levels
  feature_importance <- model_bundle$feature_importance

  # Support flexible key names (e.g. crop or Plant_Type)
  crop <- if (!is.null(input_data$crop)) input_data$crop else input_data$Plant_Type
  leaf_color <- if (!is.null(input_data$leaf_color)) input_data$leaf_color else input_data$Leaf_Color
  leaf_spot_size <- if (!is.null(input_data$leaf_spot_size)) input_data$leaf_spot_size else input_data$Leaf_Spot_Size
  humidity <- if (!is.null(input_data$humidity)) input_data$humidity else input_data$Humidity
  temperature <- if (!is.null(input_data$temperature)) input_data$temperature else input_data$Temperature

  # Validation
  if (is.null(crop) || is.null(leaf_color) || is.null(leaf_spot_size) || is.null(humidity) || is.null(temperature)) {
    stop("Missing required input fields: crop, leaf_color, leaf_spot_size, humidity, temperature")
  }

  # Build new dataframe row matching exact factor levels
  new_row <- data.frame(
    Plant_Type = factor(as.character(crop), levels = model_levels$Plant_Type),
    Leaf_Color = factor(as.character(leaf_color), levels = model_levels$Leaf_Color),
    Leaf_Spot_Size = as.numeric(leaf_spot_size),
    Humidity = as.numeric(humidity),
    Temperature = as.numeric(temperature),
    stringsAsFactors = FALSE
  )

  if (is.na(new_row$Plant_Type)) {
    stop(paste("Invalid crop value. Must be one of:", paste(model_levels$Plant_Type, collapse = ", ")))
  }
  if (is.na(new_row$Leaf_Color)) {
    stop(paste("Invalid leaf_color value. Must be one of:", paste(model_levels$Leaf_Color, collapse = ", ")))
  }
  if (is.na(new_row$Leaf_Spot_Size) || is.na(new_row$Humidity) || is.na(new_row$Temperature)) {
    stop("Leaf spot size, humidity, and temperature must be valid numeric values.")
  }

  # Run prediction with probabilities
  pred_class <- as.character(predict(rf_model, newdata = new_row))
  prob_matrix <- predict(rf_model, newdata = new_row, type = "prob")
  probabilities <- as.list(round(prob_matrix[1, ], 4))
  chosen_prob <- as.numeric(probabilities[[pred_class]])
  risk_level <- map_risk_level(pred_class)

  output <- list(
    prediction = pred_class,
    risk_level = risk_level,
    probability = round(chosen_prob, 4),
    probabilities = probabilities,
    feature_importance = feature_importance,
    timestamp = as.character(Sys.time())
  )

  return(output)
}

# Command line interface execution
if (!interactive()) {
  args <- commandArgs(trailingOnly = TRUE)
  input_json <- NULL

  if (length(args) > 0) {
    first_arg <- args[1]
    if (first_arg == "--stdin") {
      input_json <- paste(readLines("stdin"), collapse = "\n")
    } else if (file.exists(first_arg)) {
      input_json <- paste(readLines(first_arg), collapse = "\n")
    } else {
      # Directly passed JSON string
      input_json <- paste(args, collapse = " ")
    }
  } else {
    # Check if standard input has data
    lines <- readLines("stdin", warn = FALSE)
    if (length(lines) > 0) {
      input_json <- paste(lines, collapse = "\n")
    }
  }

  if (is.null(input_json) || nchar(trimws(input_json)) == 0) {
    cat(toJSON(list(error = "No input JSON provided to predict.R"), auto_unbox = TRUE))
    quit(status = 1)
  }

  res <- tryCatch({
    parsed <- fromJSON(input_json)
    pred_result <- run_prediction(parsed)
    cat(toJSON(pred_result, auto_unbox = TRUE, pretty = FALSE))
  }, error = function(e) {
    cat(toJSON(list(error = conditionMessage(e)), auto_unbox = TRUE))
    quit(status = 1)
  })
}
