const getApiUrl = (): string => {
  try {
    // Expo / Node
    if (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }
  } catch {
    // ignore – process not available in browser
  }
  try {
    // Vite – use indirect eval so Hermes/Babel never statically parses import.meta
    // @ts-ignore
    const meta = new Function("return typeof import.meta !== 'undefined' ? import.meta : undefined")();
    if (meta?.env?.VITE_API_URL) {
      return meta.env.VITE_API_URL;
    }
  } catch {
    // ignore – import.meta not available outside Vite
  }
  try {
    // React Native: detect Android emulator and use 10.0.2.2 instead of localhost
    const { Platform } = require("react-native");
    if (Platform.OS === "android") {
      return "http://10.0.2.2:5000";
    }
  } catch {
    // ignore – react-native not available outside RN
  }
  return "http://localhost:5000";
};

export const API_URL = getApiUrl();

export const SUPPORTED_FORMATS = ["jpg", "jpeg", "png", "webp"];

export const MAX_TOP_N = 5;
