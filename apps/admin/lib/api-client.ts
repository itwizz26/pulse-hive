import { UserProfile } from '@/types/user';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiCall<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    isPublic: boolean = false
): Promise<T> {
    // Only fetch token if it's NOT a public endpoint
    const token = !isPublic && typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle Token Expiry
    if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    // Structured Error Parsing
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${res.statusText}`);
    }

    return res.json() as Promise<T>;
}

export async function authCall<T>(endpoint: string, data: any): Promise<T> {
    const response = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response as T;
}

export async function getProfile(): Promise<UserProfile> {
    return apiCall<UserProfile>('/auth/profile');
}

export async function onboardCompany(data: any) {
    return apiCall('/auth/onboard', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
