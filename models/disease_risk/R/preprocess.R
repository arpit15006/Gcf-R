# ==============================================================================
# Disease Risk Prediction - Preprocessing Pipeline
# Smart Agriculture Intelligence Dashboard
# ==============================================================================

suppressPackageStartupMessages({
  if (!requireNamespace("jsonlite", quietly = TRUE)) {
    install.packages("jsonlite", repos = "https://cloud.r-project.org", quiet = TRUE)
  }
})

load_and_preprocess_data <- function(data_path = NULL, test_split = 0.2, seed = 42) {
  if (is.null(data_path)) {
    # Resolve relative to script location or project root
    possible_paths <- c(
      "models/disease_risk/data/plant_disease_data.csv",
      "../data/plant_disease_data.csv",
      "data/plant_disease_data.csv",
      "plant_disease_data.csv",
      "/Users/arpitpatel/Desktop/GCF/models/disease_risk/data/plant_disease_data.csv",
      "/Users/arpitpatel/Desktop/GCF/plant_disease_data.csv"
    )
    existing <- possible_paths[file.exists(possible_paths)]
    if (length(existing) > 0) {
      data_path <- existing[1]
    }
  }

  if (is.na(data_path) || !file.exists(data_path)) {
    stop(paste("Data file not found at:", data_path))
  }

  cat("Loading dataset from:", data_path, "\n")
  raw_df <- read.csv(data_path, stringsAsFactors = FALSE)

  # Check required columns
  required_cols <- c("Plant_Type", "Leaf_Color", "Leaf_Spot_Size", "Humidity", "Temperature", "Disease_Status")
  missing_cols <- setdiff(required_cols, names(raw_df))
  if (length(missing_cols) > 0) {
    stop(paste("Missing required columns in dataset:", paste(missing_cols, collapse = ", ")))
  }

  # Remove ID column and handle missing values
  df <- raw_df[, required_cols]
  
  # Remove rows with any NA
  clean_df <- na.omit(df)
  cat("Total raw rows:", nrow(raw_df), "| Rows after cleaning NA:", nrow(clean_df), "\n")

  # Standardize / Encode Categorical Variables
  clean_df$Plant_Type <- factor(trimws(clean_df$Plant_Type), 
                                levels = c("Corn", "Potato", "Rice", "Tomato", "Wheat"))
  clean_df$Leaf_Color <- factor(trimws(clean_df$Leaf_Color), 
                                levels = c("Brown", "Green", "Yellow"))
  
  # Numerical variables
  clean_df$Leaf_Spot_Size <- as.numeric(clean_df$Leaf_Spot_Size)
  clean_df$Humidity <- as.numeric(clean_df$Humidity)
  clean_df$Temperature <- as.numeric(clean_df$Temperature)

  # Target variable
  clean_df$Disease_Status <- factor(trimws(clean_df$Disease_Status), 
                                    levels = c("Healthy", "Mild Infection", "Severe Infection"))

  # Train / Test split
  set.seed(seed)
  n <- nrow(clean_df)
  test_indices <- sample(1:n, size = floor(test_split * n))
  train_data <- clean_df[-test_indices, ]
  test_data <- clean_df[test_indices, ]

  cat("Train set size:", nrow(train_data), "| Test set size:", nrow(test_data), "\n")

  return(list(
    train = train_data,
    test = test_data,
    full = clean_df,
    feature_names = c("Plant_Type", "Leaf_Color", "Leaf_Spot_Size", "Humidity", "Temperature"),
    target_name = "Disease_Status",
    target_levels = levels(clean_df$Disease_Status)
  ))
}

if (!interactive() && length(commandArgs(trailingOnly = TRUE)) >= 0 && sys.nframe() == 0) {
  cat("Running standalone preprocessing test...\n")
  data <- load_and_preprocess_data()
  cat("Summary of target distribution in training set:\n")
  print(table(data$train$Disease_Status))
  cat("Preprocessing pipeline executed successfully.\n")
}
