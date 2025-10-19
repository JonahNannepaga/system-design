export type UsernameAvailabilityResponse = {
    available: boolean;
    suggestions?: string[];
};

export type UsernameRegistrationResponse = {
    success: boolean;
    message: string;
};

export type UsernameModel = {
    id: number;
    username: string;
    userId: number;
    createdAt: Date;
};