export interface UserProfile {
    id: string;
    email: string;
    role: 'admin' | 'user';
    displayName: string | null;
    bio: string | null;
    tenantId: string | null;
    createdAt: string;
}
