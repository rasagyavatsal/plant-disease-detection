import { useState, useCallback } from "react";
import { predict } from "@cropintel/shared";
import type { PredictionResponse } from "@cropintel/shared";

interface UsePredictState {
  loading: boolean;
  error: string | null;
  result: PredictionResponse | null;
}

export function usePredict() {
  const [state, setState] = useState<UsePredictState>({
    loading: false,
    error: null,
    result: null,
  });

  const analyze = useCallback(async (imageUri: string) => {
    setState({ loading: true, error: null, result: null });

    try {
      const data = await predict(imageUri);

      if (data.success) {
        setState({ loading: false, error: null, result: data });
      } else {
        setState({ loading: false, error: "Analysis failed", result: null });
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        "Failed to connect to server. Make sure the backend is running.";
      setState({ loading: false, error: message, result: null });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, result: null });
  }, []);

  return {
    ...state,
    analyze,
    reset,
  };
}
