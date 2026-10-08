import { UserProfile } from '@/types/user';

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000/api/v1';

export async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {},
    isPublic: boolean = false
): Promise<T> {
    const token =
        !isPublic && typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }

        throw new Error('Unauthorized');
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        throw new Error(
            errorData.message || `API error: ${res.statusText}`
        );
    }

    const text = await res.text();

    if (!text) {
        return {} as T;
    }

    return JSON.parse(text) as T;
}

export async function getProfile(): Promise<UserProfile> {
    return apiCall<UserProfile>('/auth/profile');
}

export async function updateProfile(data: {
    displayName: string;
}) {
    return apiCall('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function onboardCompany(data: any) {
    return apiCall('/auth/onboard', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}