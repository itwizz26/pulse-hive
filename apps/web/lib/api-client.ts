/**
 * Centralized API client configured to communicate with your API gateway.
 * Sends credentials with requests so cookies/sessions are correctly handled.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, headers, ...customOptions } = options;

        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        let url = `${this.baseUrl}${cleanEndpoint}`;

        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                searchParams.append(key, String(value));
            });
            url += `?${searchParams.toString()}`;
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(headers as Record<string, string>),
        };

        const response = await fetch(url, {
            ...customOptions,
            headers: defaultHeaders,
            credentials: 'include', // Ensure cookies/sessions are sent and accepted across cross-origin/credentials
        });

        let errorData: any = {};
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            errorData = await response.json().catch(() => ({}));
        } else {
            const textResponse = await response.text().catch(() => '');
            errorData = { message: textResponse || response.statusText };
        }

        if (!response.ok) {
            const detailedMessage = 
                errorData.message || 
                errorData.error || 
                (typeof errorData === 'string' ? errorData : null) || 
                `API Error: ${response.status} ${response.statusText}`;
            
            throw new Error(detailedMessage);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return errorData as T;
    }

    public async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    public async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    public async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    public async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);