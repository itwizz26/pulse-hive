export const TENANT_ROLES = [
    'OWNER',
    'ADMIN',
    'MEMBER',
    'VIEWER',
] as const;

export type TenantRole = (typeof TENANT_ROLES)[number];

export const TENANT_PERMISSIONS = [
    'tenant.read',
    'tenant.update',
    'tenant.delete',
    'members.read',
    'members.invite',
    'members.manage',
    'members.change_role',
    'members.remove',
    'products.read',
    'products.manage',
    'orders.read',
    'orders.manage',
    'payments.read',
    'payments.manage',
    'reports.read',
] as const;

export type TenantPermission = (typeof TENANT_PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<
    TenantRole,
    ReadonlySet<TenantPermission>
> = {
    OWNER: new Set(TENANT_PERMISSIONS),

    ADMIN: new Set([
        'tenant.read',
        'tenant.update',
        'members.read',
        'members.invite',
        'members.manage',
        'members.remove',
        'products.read',
        'products.manage',
        'orders.read',
        'orders.manage',
        'payments.read',
        'payments.manage',
        'reports.read',
    ]),

    MEMBER: new Set([
        'tenant.read',
        'products.read',
        'orders.read',
        'orders.manage',
    ]),

    VIEWER: new Set([
        'tenant.read',
        'products.read',
        'orders.read',
        'payments.read',
        'reports.read',
    ]),
};

export function isTenantRole(value: string): value is TenantRole {
    return TENANT_ROLES.includes(value as TenantRole);
}

export function isTenantPermission(
    value: string,
): value is TenantPermission {
    return TENANT_PERMISSIONS.includes(value as TenantPermission);
}

export function roleHasPermission(
    role: TenantRole,
    permission: TenantPermission,
): boolean {
    return ROLE_PERMISSIONS[role].has(permission);
}
