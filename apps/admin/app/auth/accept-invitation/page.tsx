'use client';

import {
    FormEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';

import { PulseHiveLogo } from '@/components/PulseHiveLogo';
import {
    apiCall,
    setSelectedTenantId,
} from '@/lib/api-client';

type AcceptedMembership = {
    id: string;
    userId: string;
    tenantId: string;
    role: string;
    status: string;
};

type AcceptInvitationResponse = {
    membership: AcceptedMembership;
};

type SignInResponse = {
    accessToken: string;
};

export default function AcceptInvitationPage() {
    const router = useRouter();
    const started = useRef(false);

    const [invitationToken, setInvitationToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signedIn, setSignedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const acceptInvitation = useCallback(
        async (token: string) => {
            setLoading(true);
            setError('');

            try {
                const result = await apiCall<AcceptInvitationResponse>(
                    '/auth/invitations/accept',
                    {
                        method: 'POST',
                        body: JSON.stringify({ token }),
                    },
                );

                const membership = result?.membership;
                const tenantId = membership?.tenantId;

                if (
                    !tenantId ||
                    membership.status !== 'ACTIVE'
                ) {
                    throw new Error(
                        'The invitation response did not contain an active workspace membership. Please contact your administrator.',
                    );
                }

                setSelectedTenantId(tenantId);
                setSuccess(true);

                window.setTimeout(() => {
                    router.replace('/dashboard');
                }, 1000);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Unable to accept this invitation.',
                );
            } finally {
                setLoading(false);
            }
        },
        [router],
    );

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setError(
                'This invitation link is missing its token. Please open the complete link from your invitation email.',
            );
            return;
        }

        setInvitationToken(token);

        const existingToken = localStorage.getItem('token');

        if (existingToken && !started.current) {
            started.current = true;
            setSignedIn(true);
            void acceptInvitation(token);
        }
    }, [acceptInvitation]);

    async function handleSignIn(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();
        setError('');

        if (!invitationToken) {
            setError('The invitation token is missing or invalid.');
            return;
        }

        setLoading(true);

        try {
            const result = await apiCall<SignInResponse>(
                '/auth/signin',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                },
                true,
            );

            if (!result?.accessToken) {
                throw new Error(
                    'Sign-in did not return an access token.',
                );
            }

            localStorage.setItem('token', result.accessToken);
            setSignedIn(true);

            await acceptInvitation(invitationToken);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to sign in or accept the invitation.',
            );
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center justify-center py-10">
            <section className="w-full overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="border-b border-slate-700/70 px-6 py-6 sm:px-8">
                    <PulseHiveLogo />

                    <p className="mt-3 text-sm text-slate-400">
                        Workspace collaboration
                    </p>
                </div>

                <div className="px-6 py-8 sm:px-8">
                    {success ? (
                        <div className="text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-7 w-7"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="m5 12 4 4L19 6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <h1 className="mt-5 text-2xl font-bold text-white">
                                Invitation accepted
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                You now have access to the workspace.
                                Taking you to your dashboard…
                            </p>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                Join your workspace
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                You have been invited to collaborate on
                                PulseHive. Sign in with the account associated
                                with your invitation to continue.
                            </p>

                            {error && (
                                <div
                                    role="alert"
                                    className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200"
                                >
                                    {error}
                                </div>
                            )}

                            {signedIn ? (
                                <div className="mt-6">
                                    <p className="text-sm text-slate-300">
                                        {loading
                                            ? 'Validating your invitation…'
                                            : 'Your invitation could not be accepted.'}
                                    </p>

                                    {!loading && invitationToken && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                void acceptInvitation(
                                                    invitationToken,
                                                );
                                            }}
                                            className="mt-5 w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Try again
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSignIn}
                                    className="mt-7 space-y-5"
                                >
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            Email address
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(event) => {
                                                setEmail(event.target.value);
                                            }}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="you@company.com"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            Password
                                        </label>

                                        <input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                            }}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="Enter your password"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !invitationToken}
                                        className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading
                                            ? 'Please wait…'
                                            : 'Sign in and accept invitation'}
                                    </button>

                                    <p className="text-center text-xs leading-5 text-slate-500">
                                        Your email must already be verified,
                                        and it must match the address the
                                        invitation was sent to.
                                    </p>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
