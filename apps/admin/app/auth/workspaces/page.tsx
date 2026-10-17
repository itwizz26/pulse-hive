'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';
import {
    apiCall,
    clearSelectedTenantId,
    setSelectedTenantId,
} from '@/lib/api-client';

type Membership = {
    id: string;
    role: string;
    status: string;
    tenant: {
        id: string;
        name: string;
        slug: string;
        tenantCode: string;
    };
};

export default function WorkspacesPage() {
    const router = useRouter();

    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectingId, setSelectingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    const loadWorkspaces = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const result = await apiCall<Membership[]>('/auth/memberships');

            const active = result.filter(
                (membership) => membership.status === 'ACTIVE',
            );

            if (active.length === 0) {
                clearSelectedTenantId();
                router.replace('/auth/onboarding');
                return;
            }

            if (active.length === 1) {
                setSelectedTenantId(active[0].tenant.id);
                router.replace('/dashboard');
                return;
            }

            setMemberships(active);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to load your workspaces.',
            );
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        void loadWorkspaces();
    }, [loadWorkspaces]);

    function selectWorkspace(membership: Membership) {
        setSelectingId(membership.id);
        setError('');

        setSelectedTenantId(membership.tenant.id);
        router.replace('/dashboard');
    }

    return (
        <main className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden bg-slate-950 px-4 py-6 text-white sm:px-6">
            {/* Background Grid - matches the homepage */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[32px_32px]"
            />

            <section className="relative z-10 mx-auto my-auto w-full max-w-2xl py-6">
                {/* Centered brand and introduction */}
                <header className="mb-8 flex flex-col items-center text-center sm:mb-9">
                    <div className="mb-8">
                        <PulseHiveLogo />
                    </div>

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-3 py-1.5 text-xs font-medium text-indigo-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        Your account · Workspace selection
                    </div>

                    <h1 className="text-4xl font-black leading-tight tracking-tighter sm:text-5xl">
                        Choose your workspace
                    </h1>

                    <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-slate-400 sm:text-base">
                        You have access to multiple workspaces. Select the
                        business you want to manage and we’ll take you to its
                        dashboard.
                    </p>
                </header>

                {/* Workspace selection */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-5">
                    <div className="flex items-center justify-between gap-3 px-2 pb-4 pt-2">
                        <div>
                            <h2 className="text-sm font-bold text-white">
                                Your workspaces
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                {loading
                                    ? 'Loading your access...'
                                    : `${memberships.length} available workspace${memberships.length === 1 ? '' : 's'}`}
                            </p>
                        </div>

                        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Workspace portal
                        </span>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-4 rounded-xl border border-red-400/20 bg-red-500/[0.08] p-4 text-sm text-red-200"
                        >
                            <p className="font-bold">
                                Unable to load workspaces
                            </p>
                            <p className="mt-1 leading-5">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div
                            role="status"
                            aria-live="polite"
                            className="space-y-3"
                        >
                            <span className="sr-only">
                                Loading your workspaces
                            </span>

                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="flex animate-pulse items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
                                >
                                    <div className="h-12 w-12 rounded-xl bg-white/10" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-2/5 rounded bg-white/10" />
                                        <div className="h-3 w-3/5 rounded bg-white/[0.06]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : memberships.length > 0 ? (
                        <div className="space-y-3">
                            {memberships.map((membership) => {
                                const isSelecting =
                                    selectingId === membership.id;

                                return (
                                    <button
                                        key={membership.id}
                                        type="button"
                                        disabled={selectingId !== null}
                                        onClick={() => selectWorkspace(membership)}
                                        aria-label={`Open ${membership.tenant.name} workspace`}
                                        className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-left transition-all duration-200 hover:border-indigo-400/40 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-wait disabled:opacity-60 sm:gap-4 sm:p-5"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-lg font-black text-indigo-300 transition-colors group-hover:border-indigo-400/40 group-hover:bg-indigo-500/20">
                                            {membership.tenant.name
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase() || 'W'}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-bold text-white sm:text-base">
                                                {membership.tenant.name}
                                            </h3>

                                            <p className="mt-1 break-all text-xs text-slate-500">
                                                {membership.tenant.tenantCode}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] font-medium capitalize text-slate-300">
                                                    {membership.role.toLowerCase()}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                    Active membership
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2 text-xs font-bold text-slate-400 transition-colors group-hover:text-white sm:text-sm">
                                            <span className="hidden sm:inline">
                                                {isSelecting
                                                    ? 'Opening...'
                                                    : 'Open workspace'}
                                            </span>

                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                                                    isSelecting
                                                        ? 'animate-pulse'
                                                        : ''
                                                }`}
                                            >
                                                <path
                                                    d="M4 10h12m-5-5 5 5-5 5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : !error ? (
                        <div className="rounded-xl border border-dashed border-white/10 px-5 py-10 text-center">
                            <h3 className="text-sm font-bold text-white">
                                No workspaces available
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                                You don’t currently have access to a workspace.
                                We’ll help you set one up.
                            </p>
                        </div>
                    ) : null}

                    <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] px-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-5 text-slate-500">
                            Your access is determined by your workspace
                            membership.
                        </p>

                        <button
                            type="button"
                            onClick={() => void loadWorkspaces()}
                            disabled={loading || selectingId !== null}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                fill="none"
                                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                            >
                                <path
                                    d="M16 8a6 6 0 0 0-10.8-2L4 8m0-4v4h4m-4 4a6 6 0 0 0 10.8 2L16 12m0 4v-4h-4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Refresh workspaces
                        </button>
                    </div>
                </div>

                <footer className="mt-10 text-center text-[10px] font-mono uppercase tracking-wider text-slate-600">
                    Workspace Management Portal v1.0.0
                </footer>
            </section>
        </main>
    );
}
