export interface Prediction {
  label: string;
  score: number;
}

export interface PredictionResponse {
  success: boolean;
  predictions: Prediction[];
  top_prediction: Prediction;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

export interface APIError {
  error: string;
}
