'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';
import {
    apiCall,
    clearSelectedTenantId,
    setSelectedTenantId,
} from '@/lib/api-client';
import { AuthResponse } from '@/types/auth';

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

type SignupResponse = {
    emailVerificationRequired?: boolean;
    verificationUrl?: string;
};

export default function LoginPage() {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [registrationComplete, setRegistrationComplete] =
        useState(false);
    const [verificationUrl, setVerificationUrl] = useState('');
    const [resendMessage, setResendMessage] = useState('');

    const [message, setMessage] = useState<{
        type: 'error' | 'success';
        text: string;
    } | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const normalizedEmail = email.trim().toLowerCase();

    const handleAuth = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);
        setMessage(null);
        setResendMessage('');

        try {
            // Never retain a previous user's session during authentication.
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            clearSelectedTenantId();

            if (!isLogin) {
                const signup = await apiCall<SignupResponse>(
                    '/auth/signup',
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            email: normalizedEmail,
                            password,
                        }),
                    },
                    true,
                );

                // Signup ends here. Email verification must happen
                // before the user is allowed to sign in.
                setVerificationUrl(signup.verificationUrl ?? '');
                setPassword('');
                setRegistrationComplete(true);
                return;
            }

            const response = await apiCall<AuthResponse>(
                '/auth/signin',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: normalizedEmail,
                        password,
                    }),
                },
                true,
            );

            if (!response.accessToken) {
                throw new Error(
                    'Authentication succeeded without an access token.',
                );
            }

            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('userEmail', normalizedEmail);

            const memberships = await apiCall<Membership[]>(
                '/auth/memberships',
            );

            const activeMemberships = memberships.filter(
                (membership) => membership.status === 'ACTIVE',
            );

            if (activeMemberships.length === 0) {
                clearSelectedTenantId();
                router.replace('/auth/onboarding');
                return;
            }

            if (activeMemberships.length === 1) {
                setSelectedTenantId(
                    activeMemberships[0].tenant.id,
                );
                router.replace('/dashboard');
                return;
            }

            clearSelectedTenantId();
            router.replace('/auth/workspaces');
        } catch (err: unknown) {
            setMessage({
                type: 'error',
                text:
                    err instanceof Error
                        ? err.message
                        : 'Authentication failed. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (isResending || !normalizedEmail) return;

        setIsResending(true);
        setResendMessage('');

        try {
            await apiCall(
                '/auth/email/resend',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: normalizedEmail,
                    }),
                },
                true,
            );

            setResendMessage(
                'If your account needs verification, a new email will be sent shortly. Check your inbox and spam folder.',
            );
        } catch (err: unknown) {
            setResendMessage(
                err instanceof Error
                    ? err.message
                    : 'Unable to request another verification email.',
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="fixed inset-0 flex min-h-screen w-full overflow-hidden bg-slate-950 font-sans">
            <div className="relative hidden w-1/2 flex-col justify-between border-r border-white/5 bg-slate-900 p-16 lg:flex">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[32px_32px]" />

                <div className="relative z-10">
                    <PulseHiveLogo />
                </div>

                <div className="relative z-10 max-w-md space-y-6">
                    <h2 className="text-4xl leading-tight font-black tracking-tight text-white">
                        {registrationComplete
                            ? 'Secure your account.'
                            : isLogin
                              ? 'Welcome back to PulseHive.'
                              : 'Start your journey.'}
                    </h2>

                    <p className="text-base leading-relaxed font-medium text-slate-400">
                        {registrationComplete
                            ? 'Verify your email address to activate your account and continue setting up your business workspace.'
                            : isLogin
                              ? 'Sign in to access your business workspaces, reconciliation dashboards, and financial insights.'
                              : 'Create your secure account to begin centralising your business cash flow and automated matching.'}
                    </p>
                </div>

                <div className="relative z-10 font-mono text-[10px] tracking-wider text-slate-600 uppercase">
                    Workspace Management Portal v1.0.0
                </div>
            </div>

            <div className="grid min-h-screen w-full place-items-center overflow-y-auto bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 lg:w-1/2">
                <div className="m-6 w-full max-w-110 rounded-3xl border border-white/5 bg-slate-900/30 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                    {registrationComplete ? (
                        <>
                            <div className="mb-8">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-xl text-indigo-400">
                                    ✉
                                </div>

                                <h3 className="text-xl font-bold tracking-tight text-white">
                                    Check your email
                                </h3>

                                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                    We’ve started creating your
                                    account. If email delivery is
                                    configured, a verification link
                                    has been sent to{' '}
                                    <span className="font-semibold text-slate-200">
                                        {normalizedEmail}
                                    </span>
                                    . Open that link before signing
                                    in.
                                </p>
                            </div>

                            <div
                                role="status"
                                className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs leading-relaxed font-medium text-emerald-400"
                            >
                                Your account must be verified
                                before you can sign in.
                            </div>

                            {verificationUrl && (
                                <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                                    <p className="mb-2 text-xs font-semibold text-amber-300">
                                        Local development verification
                                    </p>

                                    <p className="mb-3 text-xs leading-relaxed text-slate-300">
                                        The backend returned a
                                        development verification
                                        link. Use it to test the
                                        flow while email delivery
                                        is not configured.
                                    </p>

                                    <a
                                        href={verificationUrl}
                                        className="break-all text-xs font-semibold text-indigo-300 underline hover:text-indigo-200"
                                    >
                                        Verify your email
                                    </a>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResending}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
                            >
                                {isResending
                                    ? 'Sending...'
                                    : 'Resend verification email'}
                            </button>

                            {resendMessage && (
                                <p
                                    role="status"
                                    className="mt-4 text-xs leading-relaxed text-slate-400"
                                >
                                    {resendMessage}
                                </p>
                            )}

                            <div className="pt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(true);
                                        setRegistrationComplete(false);
                                        setVerificationUrl('');
                                        setMessage(null);
                                        setResendMessage('');
                                    }}
                                    className="text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-400"
                                >
                                    ← Return to sign in
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h3 className="text-xl font-bold tracking-tight text-white">
                                    {isLogin
                                        ? 'Sign in to your account'
                                        : 'Create your account'}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    {isLogin
                                        ? "Don't have an account?"
                                        : 'Already have an account?'}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(!isLogin);
                                            setMessage(null);
                                        }}
                                        className="ml-1 font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                                    >
                                        {isLogin
                                            ? 'Sign up here'
                                            : 'Sign in instead'}
                                    </button>
                                </p>
                            </div>

                            {message && (
                                <div
                                    role="alert"
                                    className={`mb-6 rounded-xl border p-4 text-xs font-medium ${
                                        message.type === 'error'
                                            ? 'border-red-500/20 bg-red-500/10 text-red-400'
                                            : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            <form
                                onSubmit={handleAuth}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
                                        placeholder="name@company.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        required
                                        autoComplete={
                                            isLogin
                                                ? 'current-password'
                                                : 'new-password'
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-950/50 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] disabled:opacity-60"
                                >
                                    {isLoading
                                        ? isLogin
                                            ? 'Authenticating...'
                                            : 'Creating account...'
                                        : isLogin
                                          ? 'Sign In'
                                          : 'Sign Up'}
                                </button>

                                <div className="relative flex items-center pt-6">
                                    <div className="grow border-t border-white/6" />
                                    <span className="mx-4 shrink-0 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        Or
                                    </span>
                                    <div className="grow border-t border-white/6" />
                                </div>

                                <button
                                    type="button"
                                    disabled
                                    title="Google sign-in is not configured yet"
                                    className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-white/5 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-400 opacity-60"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill="#EA4335"
                                            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.9c1.908 0 3.616.716 4.95 1.884l3.655-3.655C17.95 1.543 15.257 0 12 0 7.382 0 3.42 2.592 1.346 6.368l3.92 3.397z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M23.64 12.27c0-.79-.07-1.55-.2-2.27H12v4.45h6.45c-.27 1.45-1.1 2.68-2.3 3.48l3.35 2.6c1.96-1.8 3.14-4.45 3.14-7.66z"
                                        />
                                        <path
                                            fill="#4A90E2"
                                            d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.35-2.6c-1.12.75-2.55 1.2-4.59 1.2-3.53 0-6.52-2.39-7.58-5.6l-3.92 3.39C3.42 21.408 7.382 24 12 24z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M4.42 14.54c-.27-.8-.42-1.65-.42-2.54s.15-1.74.42-2.54l-3.92-3.4C.48 7.54 0 9.7 1.34 6.46l3.08-2.92z"
                                        />
                                    </svg>

                                    <span>
                                        Continue with Google (coming soon)
                                    </span>
                                </button>

                                <div className="pt-6 text-center">
                                    <Link
                                        href="/"
                                        className="text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-400"
                                    >
                                        ← Return to homepage
                                    </Link>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
