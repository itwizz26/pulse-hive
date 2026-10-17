'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiCall, getSelectedTenantId } from '@/lib/api-client';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

type TenantRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
type MembershipStatus = 'ACTIVE' | 'SUSPENDED' | 'REMOVED';

type TeamMember = {
    id: string;
    userId: string;
    email?: string;
    displayName?: string;
    role: TenantRole;
    status: MembershipStatus;
    createdAt?: string;
};

type Invitation = {
    id: string;
    email: string;
    role: Exclude<TenantRole, 'OWNER'>;
    expiresAt: string;
    createdAt: string;
    status?: 'PENDING' | 'EXPIRED' | 'REVOKED' | 'ACCEPTED';
};

const ROLE_OPTIONS: {
    value: Exclude<TenantRole, 'OWNER'>;
    label: string;
    description: string;
}[] = [
    {
        value: 'ADMIN',
        label: 'Administrator',
        description: 'Manage workspace operations and team access.',
    },
    {
        value: 'MEMBER',
        label: 'Member',
        description: 'Work with permitted workspace operations.',
    },
    {
        value: 'VIEWER',
        label: 'Viewer',
        description: 'Read-only access to permitted information.',
    },
];

const roleLabels: Record<TenantRole, string> = {
    OWNER: 'Owner',
    ADMIN: 'Administrator',
    MEMBER: 'Member',
    VIEWER: 'Viewer',
};

function initials(name?: string, email?: string) {
    const source = name?.trim() || email?.trim() || '?';

    return source
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

function formatDate(value?: string) {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function isExpired(value: string) {
    return new Date(value).getTime() <= Date.now();
}

function roleBadge(role: TenantRole) {
    if (role === 'OWNER') {
        return 'border-amber-400/20 bg-amber-400/10 text-amber-300';
    }

    if (role === 'ADMIN') {
        return 'border-indigo-400/20 bg-indigo-400/10 text-indigo-300';
    }

    if (role === 'MEMBER') {
        return 'border-sky-400/20 bg-sky-400/10 text-sky-300';
    }

    return 'border-white/10 bg-white/5 text-slate-300';
}

function statusBadge(status: MembershipStatus) {
    if (status === 'ACTIVE') {
        return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300';
    }

    if (status === 'SUSPENDED') {
        return 'border-amber-400/20 bg-amber-400/10 text-amber-300';
    }

    return 'border-rose-400/20 bg-rose-400/10 text-rose-300';
}

function StatCard({
    label,
    value,
    detail,
}: {
    label: string;
    value: number;
    detail: string;
}) {
    return (
        <section className="ph-glass-panel rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {label}
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {value}
            </p>
            <p className="mt-2 text-xs text-slate-400">{detail}</p>
        </section>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-400/10 text-indigo-300">
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="9" cy="8" r="3.5" />
                    <path d="M3 20v-1a6 6 0 0 1 12 0v1" />
                    <path d="M17 8h5M19.5 5.5v5" />
                </svg>
            </div>
            <h3 className="mt-4 text-sm font-bold text-white">{title}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                {description}
            </p>
        </div>
    );
}

export default function TeamPage() {
    useAuthGuard();

    const [tenantId, setTenantId] = useState<string | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] =
        useState<Exclude<TenantRole, 'OWNER'>>('MEMBER');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRevoking, setIsRevoking] = useState<string | null>(null);
    const [notice, setNotice] = useState('');
    const [actionError, setActionError] = useState('');

    const loadTeam = useCallback(async () => {
        const selectedTenantId = getSelectedTenantId();

        setTenantId(selectedTenantId);
        setLoadError('');

        if (!selectedTenantId) {
            setMembers([]);
            setInvitations([]);
            setIsLoading(false);
            setLoadError(
                'No workspace is selected. Choose a workspace before managing team access.',
            );
            return;
        }

        setIsLoading(true);

        try {
            const [memberResult, invitationResult] = await Promise.all([
                apiCall<TeamMember[]>(
                    `/auth/tenants/${encodeURIComponent(selectedTenantId)}/members`,
                ),
                apiCall<Invitation[]>(
                    `/auth/tenants/${encodeURIComponent(selectedTenantId)}/invitations`,
                ),
            ]);

            setMembers(memberResult);
            setInvitations(invitationResult);
        } catch (error) {
            setLoadError(
                error instanceof Error
                    ? error.message
                    : 'Unable to load workspace access.',
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadTeam();
    }, [loadTeam]);

    // Keep the drawer open while its content is being submitted.
    // Escape closes it only when a submission is not in progress.
    useEffect(() => {
        if (!isInviteOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape' && !isSubmitting) {
                setIsInviteOpen(false);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isInviteOpen, isSubmitting]);

    const activeMembers = members.filter(
        (member) => member.status === 'ACTIVE',
    );

    const pendingInvitations = invitations.filter(
        (invitation) =>
            !invitation.status ||
            (invitation.status === 'PENDING' &&
                !isExpired(invitation.expiresAt)),
    );

    async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!tenantId || isSubmitting) return;

        setNotice('');
        setActionError('');

        const normalizedEmail = email.trim().toLowerCase();

        if (
            !normalizedEmail ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
        ) {
            setActionError('Enter a valid email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            await apiCall('/auth/invitations', {
                method: 'POST',
                body: JSON.stringify({
                    tenantId,
                    email: normalizedEmail,
                    role,
                }),
            });

            setEmail('');
            setRole('MEMBER');
            setIsInviteOpen(false);
            setNotice(
                'Invitation request completed. Refresh the list to confirm its status.',
            );

            await loadTeam();
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : 'Unable to create the invitation.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleRevoke(invitationId: string) {
        if (isRevoking) return;

        setNotice('');
        setActionError('');
        setIsRevoking(invitationId);

        try {
            await apiCall(
                `/auth/invitations/${encodeURIComponent(invitationId)}/revoke`,
                { method: 'POST' },
            );

            setNotice('Invitation revoked.');
            await loadTeam();
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : 'Unable to revoke the invitation.',
            );
        } finally {
            setIsRevoking(null);
        }
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-300">
                            Workspace administration
                        </p>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Team &amp; Access
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                        Manage workspace membership, assign roles, and invite
                        people to collaborate securely.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => void loadTeam()}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07] disabled:opacity-50"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M20 7v5h-5" />
                            <path d="M4 17v-5h5" />
                            <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12" />
                            <path d="M4 12l2.8 5a7 7 0 0 0 11.6-2" />
                        </svg>
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setNotice('');
                            setActionError('');
                            setIsInviteOpen(true);
                        }}
                        disabled={!tenantId}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="text-lg leading-none">+</span>
                        Invite member
                    </button>
                </div>
            </header>

            {notice && (
                <div
                    role="status"
                    className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-300"
                >
                    {notice}
                </div>
            )}

            {actionError && !isInviteOpen && (
                <div
                    role="alert"
                    className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300"
                >
                    {actionError}
                </div>
            )}

            {loadError && (
                <div
                    role="alert"
                    className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-5"
                >
                    <p className="text-sm font-bold text-amber-200">
                        Workspace data unavailable
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                        {loadError}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        The team-list and pending-invitation API endpoints must
                        be available before this screen can display live data.
                    </p>
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    label="Active members"
                    value={activeMembers.length}
                    detail="People with active workspace access"
                />
                <StatCard
                    label="Pending invitations"
                    value={pendingInvitations.length}
                    detail="Invitations awaiting acceptance"
                />
                <StatCard
                    label="Administrators"
                    value={
                        activeMembers.filter(
                            (member) =>
                                member.role === 'OWNER' ||
                                member.role === 'ADMIN',
                        ).length
                    }
                    detail="Owners and administrators"
                />
            </section>

            <section className="ph-glass-panel overflow-hidden rounded-2xl">
                <div className="flex flex-col gap-2 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-bold text-white">
                            Workspace members
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Review team membership and assigned access roles.
                        </p>
                    </div>

                    <span className="w-fit rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300">
                        {activeMembers.length} active
                    </span>
                </div>

                {isLoading ? (
                    <div className="space-y-4 p-6">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex animate-pulse items-center gap-3"
                            >
                                <div className="h-10 w-10 rounded-xl bg-white/[0.06]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-36 rounded bg-white/[0.06]" />
                                    <div className="h-2.5 w-48 max-w-full rounded bg-white/[0.04]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : members.length === 0 ? (
                    <EmptyState
                        title="No member records to display"
                        description="Workspace members will appear here once the team-members endpoint returns the current workspace membership."
                    />
                ) : (
                    <div className="divide-y divide-white/[0.05]">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex flex-col gap-4 px-5 py-4 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:px-6"
                            >
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-400/[0.08] text-sm font-bold text-indigo-200">
                                        {initials(
                                            member.displayName,
                                            member.email,
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {member.displayName ||
                                                member.email ||
                                                'Workspace member'}
                                        </p>
                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            {member.email || member.userId}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                    <span
                                        className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold ${roleBadge(member.role)}`}
                                    >
                                        {roleLabels[member.role]}
                                    </span>
                                    <span
                                        className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold ${statusBadge(member.status)}`}
                                    >
                                        {member.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="ph-glass-panel overflow-hidden rounded-2xl">
                <div className="flex flex-col gap-2 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-bold text-white">
                            Pending invitations
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Track invitations and revoke access before they
                            are accepted.
                        </p>
                    </div>

                    <span className="w-fit rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300">
                        {pendingInvitations.length} pending
                    </span>
                </div>

                {isLoading ? (
                    <div className="p-6">
                        <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
                    </div>
                ) : pendingInvitations.length === 0 ? (
                    <EmptyState
                        title="No pending invitations"
                        description="When invitations are created, their recipient, role, and expiry date will appear here."
                    />
                ) : (
                    <div className="divide-y divide-white/[0.05]">
                        {pendingInvitations.map((invitation) => (
                            <div
                                key={invitation.id}
                                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:px-6"
                            >
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300">
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="14"
                                                rx="2"
                                            />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {invitation.email}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Expires{' '}
                                            {formatDate(invitation.expiresAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                                    <span
                                        className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold ${roleBadge(invitation.role)}`}
                                    >
                                        {roleLabels[invitation.role]}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            void handleRevoke(invitation.id)
                                        }
                                        disabled={isRevoking !== null}
                                        className="rounded-lg border border-rose-400/15 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-400/10 disabled:opacity-50"
                                    >
                                        {isRevoking === invitation.id
                                            ? 'Revoking…'
                                            : 'Revoke'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.04] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-indigo-300">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">
                            Access is controlled by workspace roles
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                            Invitations cannot grant ownership. Invitees must
                            verify their email and accept using the matching
                            account. The server remains responsible for
                            enforcing permissions on every membership action.
                        </p>
                    </div>
                </div>
            </section>

            {/* Right-side pinned invitation drawer */}
            {isInviteOpen && (
                <div
                    className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !isSubmitting
                        ) {
                            setIsInviteOpen(false);
                        }
                    }}
                >
                    {/* Outside-click area */}
                    <div
                        className="flex-1"
                        aria-hidden="true"
                        onClick={() => {
                            if (!isSubmitting) {
                                setIsInviteOpen(false);
                            }
                        }}
                    />

                    {/* Drawer */}
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="invite-title"
                        className="flex h-full w-full max-w-md flex-col justify-between space-y-6 overflow-hidden border-l border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40 animate-in slide-in-from-right duration-200 sm:p-8"
                    >
                        {/* Scrollable drawer content */}
                        <div className="min-h-0 space-y-6 overflow-y-auto overscroll-contain pr-1">
                            <header className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                                        Workspace access
                                    </p>

                                    <h2
                                        id="invite-title"
                                        className="mt-2 text-xl font-black text-white sm:text-2xl"
                                    >
                                        Invite a teammate
                                    </h2>

                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        Send an invitation with the right
                                        level of access for this workspace.
                                    </p>
                                </div>
                            </header>

                            <div className="rounded-xl border border-indigo-400/15 bg-indigo-400/[0.04] p-4">
                                <p className="text-xs font-semibold text-indigo-200">
                                    Before you invite
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                    Choose the least privileged role that
                                    allows your teammate to do their job.
                                    Workspace ownership cannot be assigned
                                    through an invitation.
                                </p>
                            </div>

                            <form
                                id="invite-form"
                                onSubmit={handleInvite}
                                className="space-y-5"
                            >
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="invite-email"
                                        className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
                                    >
                                        Email address *
                                    </label>

                                    <input
                                        id="invite-email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        disabled={isSubmitting}
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="teammate@company.com"
                                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-indigo-500 disabled:opacity-60"
                                    />
                                </div>

                                <fieldset className="space-y-3">
                                    <legend className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Workspace role *
                                    </legend>

                                    <div className="space-y-2">
                                        {ROLE_OPTIONS.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                                                    role === option.value
                                                        ? 'border-indigo-400/40 bg-indigo-400/[0.08]'
                                                        : 'border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.04]'
                                                } ${
                                                    isSubmitting
                                                        ? 'cursor-not-allowed opacity-60'
                                                        : ''
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="invite-role"
                                                    value={option.value}
                                                    checked={
                                                        role === option.value
                                                    }
                                                    disabled={isSubmitting}
                                                    onChange={() =>
                                                        setRole(option.value)
                                                    }
                                                    className="mt-1 accent-indigo-500"
                                                />

                                                <span className="min-w-0">
                                                    <span className="block text-sm font-semibold text-white">
                                                        {option.label}
                                                    </span>
                                                    <span className="mt-1 block text-xs leading-5 text-slate-400">
                                                        {option.description}
                                                    </span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                {actionError && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3 py-3 text-sm leading-5 text-rose-300"
                                    >
                                        {actionError}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Pinned drawer actions */}
                        <div className="flex shrink-0 items-center gap-3 border-t border-white/[0.08] bg-slate-900 pt-4">
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => setIsInviteOpen(false)}
                                className="flex-1 rounded-xl bg-white/[0.05] py-3 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                form="invite-form"
                                disabled={isSubmitting || !tenantId}
                                className="flex-1 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-950/50 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? 'Sending invitation…'
                                    : 'Create invitation'}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
