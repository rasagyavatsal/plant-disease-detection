import axios from "axios";
import { API_URL } from "./constants";
import type { PredictionResponse, HealthResponse } from "./types";

/**
 * Send an image to the backend for disease prediction.
 * Accepts either a File (web) or a URI string (mobile).
 */
export async function predict(
  image: File | string
): Promise<PredictionResponse> {
  const formData = new FormData();

  if (typeof image === "string") {
    // React Native: image is a local file URI
    const filename = image.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : "image/jpeg";
    formData.append("image", {
      uri: image,
      name: filename,
      type: mimeType,
    } as any);
  } else {
    // Web: image is a File object
    formData.append("image", image);
  }

  const response = await axios.post<PredictionResponse>(
    `${API_URL}/predict`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

/**
 * Check if the backend is healthy and the model is loaded.
 */
export async function healthCheck(): Promise<HealthResponse> {
  const response = await axios.get<HealthResponse>(`${API_URL}/health`);
  return response.data;
}
