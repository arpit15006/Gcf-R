# Training script for Crop Recommendation ML Model using R rpart Decision Tree Classifier

suppressPackageStartupMessages({
  library(rpart)
})

# Determine script directory safely across CLI and interactive execution
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
  # Fallback to current working directory relative path
  preprocess_path <- "models/crop_recommendation/R/preprocess.R"
}

source(preprocess_path)

# Define paths relative to root or script directory
base_dir <- dirname(script_dir)
data_path <- file.path(base_dir, "data", "Crop_recommendation.csv")
if (!file.exists(data_path)) {
  data_path <- "models/crop_recommendation/data/Crop_recommendation.csv"
}

model_dir <- file.path(base_dir, "model")
if (!dir.exists(model_dir)) {
  model_dir <- "models/crop_recommendation/model"
  dir.create(model_dir, recursive = TRUE, showWarnings = FALSE)
}
model_path <- file.path(model_dir, "crop_model.rds")

cat("====================================================\n")
cat(" 🌱 Training Crop Recommendation Model (R / rpart)\n")
cat("====================================================\n")

# Load and preprocess dataset
cat(sprintf("Reading dataset from: %s\n", data_path))
dataset <- preprocess_crop_data(data_path)

# Train-Test Split (80% Train, 20% Test)
set.seed(42)
train_indices <- sample(1:nrow(dataset), size = 0.8 * nrow(dataset))
train_data <- dataset[train_indices, ]
test_data  <- dataset[-train_indices, ]

cat(sprintf("Train samples: %d | Test samples: %d\n", nrow(train_data), nrow(test_data)))

# Train Decision Tree Model with fine complexity parameter
cat("Training rpart classification tree...\n")
model <- rpart(
  label ~ N + P + K + temperature + humidity + ph + rainfall,
  data = train_data,
  method = "class",
  control = rpart.control(cp = 0.001, minsplit = 2, minbucket = 1, maxdepth = 30)
)

# Evaluate on Test Set
test_predictions <- predict(model, test_data, type = "class")
test_accuracy <- mean(test_predictions == test_data$label)
cat(sprintf("🎉 Model Test Set Accuracy: %.2f%%\n", test_accuracy * 100))

# Retrain on full dataset for maximum generalization capability
cat("Training final model on full dataset...\n")
final_model <- rpart(
  label ~ N + P + K + temperature + humidity + ph + rainfall,
  data = dataset,
  method = "class",
  control = rpart.control(cp = 0.001, minsplit = 2, minbucket = 1, maxdepth = 30)
)

# Save serialized model artifact
saveRDS(final_model, file = model_path)
cat(sprintf("Model successfully saved to: %s\n", model_path))
cat("====================================================\n")
