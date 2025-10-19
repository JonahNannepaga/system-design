export interface UsernameCheckResponse {
  available: boolean;
  message: string;
}

export interface HealthStatusResponse {
  status: string;
  timestamp: string;
}