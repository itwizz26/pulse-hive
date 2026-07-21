'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, ShoppingCart, UserPlus, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { apiClient } from '@/lib/api-client';

export default function RegisterPage() {
    const { cart } = useCart();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            // Communicates with the auth service gateway using the correct schema fields
            const response = await apiClient.post<{ token?: string; user?: any }>('/auth/signup', {
                email,
                password,
                displayName: name,
            });

            if (response.token) {
                localStorage.setItem('auth_token', response.token);
            }

            setSuccessMessage('Account created successfully! Redirecting...');

            // Slight delay so the user can read the success message before routing
            setTimeout(() => {
                router.push('/signin');
            }, 1200);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please check your details and try again.');
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-12 box-border">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6 box-border">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/cart" 
                    className="absolute top-6 right-6 text-(--color-gold-dark) transition-transform hover:scale-105" 
                    aria-label={`${cart.length} items in cart`}
                >
                    <div className="relative">
                        <ShoppingCart size={32} />
                        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-(--color-gold-dark) text-white text-[10px] font-bold">
                            {cart.length}
                        </span>
                    </div>
                </Link>
            </header>

            <main className="flex flex-col gap-6 px-6 pt-6 max-w-5xl mx-auto w-full box-border">
                {/* Page Title & Breadcrumb indicator */}
                <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-12 h-12 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-2 rounded-full border border-(--color-border)">
                        <UserPlus size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark)">
                        Member Account
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">Create Account</h1>
                    <p className="text-xs text-(--color-text-muted)">Save your details for faster checkout and tracking.</p>
                </div>

                {/* Form Card */}
                <div className="w-full border border-(--color-border-strong) bg-white p-6 shadow-xs box-border">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text)">Full Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text)">Email Address *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text)">Password *</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                placeholder="Create a secure password"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 mt-2 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#3d2c10] to-[#f3c54b] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#3d2c10]/10 transition hover:brightness-105 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Creating account...
                                </>
                            ) : (
                                <>
                                    Create account <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Switch to Login */}
                    <div className="mt-6 pt-6 border-t border-(--color-border) text-center">
                        <p className="text-xs text-(--color-text-muted)">
                            Already have an account?{' '}
                            <Link href="/signin" className="font-bold text-(--color-gold-dark) hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>

                    {/* Trust Badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-6 pt-6 border-t border-(--color-border) text-[10px] text-(--color-text-muted)">
                        <ShieldCheck size={14} className="text-(--color-gold-dark)" />
                        <span>Secure client information storage</span>
                    </div>
                </div>
            </main>
        </div>
    );
}