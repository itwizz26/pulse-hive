'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PulseHiveLogo } from '@/components/PulseHiveLogo';
import { apiCall } from '@/lib/api-client';

type VerificationState = 'verifying' | 'success' | 'error';

const verificationRequests = new Map<
    string,
    Promise<unknown>
>();

function verifyOnce(token: string): Promise<unknown> {
    const existing = verificationRequests.get(token);

    if (existing) {
        return existing;
    }

    const request = apiCall(
        '/auth/email/verify',
        {
            method: 'POST',
            body: JSON.stringify({ token }),
        },
        true,
    );

    verificationRequests.set(token, request);

    void request.catch(() => {
        // Allow a retry if the request actually fails.
        if (verificationRequests.get(token) === request) {
            verificationRequests.delete(token);
        }
    });

    return request;
}

export default function VerifyEmailPage() {
    const [state, setState] =
        useState<VerificationState>('verifying');

    const [message, setMessage] = useState(
        'Please wait while we verify your email address.',
    );

    useEffect(() => {
        let cancelled = false;

        async function verifyEmail() {
            const token = new URLSearchParams(
                window.location.search,
            ).get('token');

            if (!token) {
                setState('error');
                setMessage(
                    'The verification link is missing its token. Please use the complete link from your email.',
                );
                return;
            }

            try {
                await verifyOnce(token);

                if (cancelled) return;

                setState('success');
                setMessage(
                    'Your email address has been verified successfully. You can now sign in to PulseHive.',
                );
            } catch (error: unknown) {
                if (cancelled) return;

                setState('error');
                setMessage(
                    error instanceof Error
                        ? error.message
                        : 'Verification failed. The link may have expired or already been used.',
                );
            }
        }

        void verifyEmail();

        return () => {
            cancelled = true;
        };
    }, []);

    const isVerifying = state === 'verifying';
    const isSuccess = state === 'success';

    return (
        <div className="fixed inset-0 flex min-h-screen w-full overflow-hidden bg-slate-950 font-sans">
            <div className="relative hidden w-1/2 flex-col justify-between border-r border-white/5 bg-slate-900 p-16 lg:flex">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[32px_32px]" />

                <div className="relative z-10">
                    <PulseHiveLogo />
                </div>

                <div className="relative z-10 max-w-md space-y-6">
                    <h2 className="text-4xl leading-tight font-black tracking-tight text-white">
                        One last step. Then you’re in.
                    </h2>

                    <p className="text-base leading-relaxed font-medium text-slate-400">
                        Verify your email address to secure your
                        account and continue setting up your
                        PulseHive business workspace.
                    </p>
                </div>

                <div className="relative z-10 font-mono text-[10px] tracking-wider text-slate-600 uppercase">
                    Workspace Management Portal v1.0.0
                </div>
            </div>

            <div className="grid min-h-screen w-full place-items-center overflow-y-auto bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 lg:w-1/2">
                <div className="m-6 w-full max-w-110 rounded-3xl border border-white/5 bg-slate-900/30 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                    <div className="mb-8">
                        <p className="mb-3 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
                            Account verification
                        </p>

                        <h1 className="text-xl font-bold tracking-tight text-white">
                            {isVerifying
                                ? 'Verifying your email'
                                : isSuccess
                                  ? 'Email verified'
                                  : 'Verification unsuccessful'}
                        </h1>

                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            {message}
                        </p>
                    </div>

                    <div
                        role={isVerifying ? 'status' : 'alert'}
                        aria-live="polite"
                        className={`mb-6 rounded-xl border p-4 text-xs font-medium ${
                            isSuccess
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                : state === 'error'
                                  ? 'border-red-500/20 bg-red-500/10 text-red-400'
                                  : 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {isVerifying && (
                                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-indigo-300/30 border-t-indigo-400" />
                            )}

                            {isSuccess && (
                                <span aria-hidden="true">✓</span>
                            )}

                            <span>
                                {isVerifying
                                    ? 'Checking your verification link…'
                                    : isSuccess
                                      ? 'Your email is now confirmed.'
                                      : 'We could not verify this link.'}
                            </span>
                        </div>
                    </div>

                    {isSuccess && (
                        <Link
                            href="/auth/login"
                            className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-950/50 transition-all hover:from-indigo-500 hover:to-indigo-600"
                        >
                            Continue to sign in
                        </Link>
                    )}

                    {state === 'error' && (
                        <Link
                            href="/auth/login"
                            className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-950/50 transition-all hover:from-indigo-500 hover:to-indigo-600"
                        >
                            Return to sign in
                        </Link>
                    )}

                    <div className="pt-6 text-center">
                        <Link
                            href="/"
                            className="text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-400"
                        >
                            ← Return to homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
