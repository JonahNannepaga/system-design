export type UsernameAvailabilityResponse = {
    available: boolean;
    suggestions?: string[];
};

export type RegisterUsernameRequest = {
    username: string;
};

export type RegisterUsernameResponse = {
    success: boolean;
    message: string;
};

export type HealthCheckResponse = {
    status: string;
    timestamp: string;
};