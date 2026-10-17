import { UserProfile } from '@/types/user';

const API_BASE = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
).replace(/\/+$/, '');

const SELECTED_TENANT_KEY = 'selectedTenantId';

export function getSelectedTenantId(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return localStorage.getItem(SELECTED_TENANT_KEY);
}

export function setSelectedTenantId(tenantId: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(SELECTED_TENANT_KEY, tenantId);
}

export function clearSelectedTenantId(): void {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.removeItem(SELECTED_TENANT_KEY);
}

export async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {},
    isPublic: boolean = false,
): Promise<T> {
    const token =
        !isPublic && typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

    const normalizedEndpoint = endpoint.startsWith('/')
        ? endpoint
        : `/${endpoint}`;

    const method = (options.method || 'GET').toUpperCase();
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type') && options.body !== undefined) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Only attach tenant context to routes that currently require it.
    // The gateway must independently authorize every tenant-scoped request.
    const pathname = normalizedEndpoint.split('?')[0];

    if (method === 'GET' && pathname === '/orders') {
        const tenantId = getSelectedTenantId();

        if (!tenantId) {
            throw new Error(
                'No workspace selected. Please select a workspace and try again.',
            );
        }

        headers.set('x-tenant-id', tenantId);
    }

    const response = await fetch(`${API_BASE}${normalizedEndpoint}`, {
        ...options,
        method,
        headers,
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            clearSelectedTenantId();
        }

        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        const message = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message;

        throw new Error(
            message || `API error: ${response.status} ${response.statusText}`,
        );
    }

    const responseText = await response.text();

    if (!responseText) {
        return {} as T;
    }

    return JSON.parse(responseText) as T;
}

export async function getProfile(): Promise<UserProfile> {
    return apiCall<UserProfile>('/auth/profile');
}

export async function updateProfile(data: { displayName: string }) {
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
