import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Types
export interface User {
    id: number;
    email: string;
    name: string;
    created_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface URL {
    id: number;
    original_url: string;
    short_code: string;
    short_url: string;
    title: string;
    custom_alias?: string;
    qr_code?: string;
    clicks: number;
    created_at: string;
    expires_at?: string;
    is_active: boolean;
}

export interface CreateURLRequest {
    original_url: string;
    title?: string;
    custom_alias?: string;
    expires_at?: string;
}

export interface UpdateURLRequest {
    title?: string;
    is_active?: boolean;
    expires_at?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface AnalyticsClick {
    id: number;
    url_id: number;
    ip_address: string;
    user_agent: string;
    referer: string;
    country: string;
    city: string;
    device_type: string;
    browser: string;
    os: string;
    clicked_at: string;
}

export interface AnalyticsStats {
    total_clicks: number;
    unique_clicks: number;
    clicks_by_date: { date: string; clicks: number }[];
    clicks_by_country: { country: string; clicks: number }[];
    clicks_by_device: { device_type: string; clicks: number }[];
    clicks_by_browser: { browser: string; clicks: number }[];
    top_referers: { referer: string; clicks: number }[];
}

// API Methods
export const api = {
    // Authentication
    auth: {
        register: async (data: RegisterRequest): Promise<AuthResponse> => {
            const response = await apiClient.post<AuthResponse>('/auth/register', data);
            return response.data;
        },

        login: async (data: LoginRequest): Promise<AuthResponse> => {
            const response = await apiClient.post<AuthResponse>('/auth/login', data);
            return response.data;
        },

        getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
            const response = await apiClient.get('/auth/me');
            return response.data;
        },
    },

    // URLs
    urls: {
        create: async (data: CreateURLRequest): Promise<{ success: boolean; data: URL }> => {
            const response = await apiClient.post('/urls', data);
            return response.data;
        },

        getAll: async (page: number = 1, limit: number = 20, search: string = ''): Promise<PaginatedResponse<URL>> => {
            const response = await apiClient.get('/urls', { params: { page, limit, search } });
            return response.data;
        },

        getById: async (id: number): Promise<{ success: boolean; data: URL }> => {
            const response = await apiClient.get(`/urls/${id}`);
            return response.data;
        },

        update: async (id: number, data: UpdateURLRequest): Promise<{ success: boolean; data: URL }> => {
            const response = await apiClient.put(`/urls/${id}`, data);
            return response.data;
        },

        delete: async (id: number): Promise<{ success: boolean }> => {
            const response = await apiClient.delete(`/urls/${id}`);
            return response.data;
        },
    },

    // Analytics
    analytics: {
        getURLAnalytics: async (urlId: number, page: number = 1, limit: number = 20): Promise<PaginatedResponse<AnalyticsClick>> => {
            const response = await apiClient.get(`/analytics/${urlId}`, { params: { page, limit } });
            return response.data;
        },

        getURLStats: async (urlId: number, days: number = 30): Promise<{ success: boolean; data: AnalyticsStats }> => {
            const response = await apiClient.get(`/analytics/${urlId}/stats`, { params: { days } });
            return response.data;
        },

        getOverviewStats: async (days: number = 30): Promise<{ success: boolean; data: AnalyticsStats }> => {
            const response = await apiClient.get('/analytics/overview', { params: { days } });
            return response.data;
        },
    },
};

export default apiClient;
