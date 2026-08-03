'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, CheckCircle2, Loader2, ShoppingCart } from 'lucide-react';
import { GlowaVeeLogo } from '@/components/glowa-vee-logo';
import { useCart } from '@/context/cart-context';

export default function ContactPage() {
    const { cart } = useCart();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setName('');
            setEmail('');
            setMessage('');
        }, 1000);
    };

    return (
        <div className="w-full min-h-screen bg-(--color-background) pb-12 box-border">
            <header className="top-5 z-40 bg-(--color-surface)/95 backdrop-blur-md border-b border-(--color-border) p-6">
                <div className="flex justify-center items-center">
                    <GlowaVeeLogo />
                </div>
                
                <Link 
                    href="/cart" 
                    className="absolute top-5 right-5 transition-transform hover:scale-105" 
                    aria-label={`${cart.length} items in cart`}
                >
                    <div className="relative">
                        <ShoppingCart size={40} className="text-(--color-gold)" />
                        <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-(--color-gold) text-white text-[0.875rem] font-bold">
                            {cart.length}
                        </span>
                    </div>
                </Link>
            </header>

            <main className="flex flex-col gap-6 px-6 pt-6 max-w-full mx-auto w-full box-border">
                <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-12 h-12 bg-(--color-surface) flex items-center justify-center text-(--color-gold-dark) mb-2 rounded-full border border-(--color-border)">
                        <PhoneCall size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-gold-dark)">
                        Get in Touch
                    </span>
                    <h1 className="text-2xl font-serif text-(--color-text)">Contact Concierge</h1>
                    <p className="text-xs text-(--color-text-muted)">We are here to answer your questions and assist with your luxury routine.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-(--color-border-strong) bg-white p-6 shadow-xs space-y-4 md:col-span-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-(--color-text)">Direct Channels</h2>
                        
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Mail size={16} className="text-(--color-gold-dark) mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-(--color-text-muted) block">Email Us</span>
                                    <span className="text-xs text-(--color-text)">concierge@glowavee.com</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <PhoneCall size={16} className="text-(--color-gold-dark) mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-(--color-text-muted) block">Call Support</span>
                                    <span className="text-xs text-(--color-text)">+27 (0) 11 000 0000</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-(--color-gold-dark) mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-(--color-text-muted) block">Studio Location</span>
                                    <span className="text-xs text-(--color-text)">Sandton, Johannesburg, South Africa</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-(--color-border-strong) bg-white p-6 shadow-xs md:col-span-2">
                        {submitted ? (
                            <div className="py-12 text-center space-y-3">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3 className="text-base font-serif text-(--color-text)">Message Received</h3>
                                <p className="text-xs text-(--color-text-muted) max-w-sm mx-auto">Thank you for reaching out. Our concierge team will get back to your inquiry shortly.</p>
                                <button
                                    type="button"
                                    onClick={() => setSubmitted(false)}
                                    className="mt-4 px-6 py-2.5 bg-(--color-surface) text-xs font-bold uppercase tracking-wider border border-(--color-border) text-(--color-gold-dark) transition hover:bg-(--color-background)"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-(--color-text) mb-2">Send a Message</h2>
                                
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text)">Your Name *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10]"
                                        placeholder="Full Name"
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
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-(--color-text)">Message *</label>
                                    <textarea
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full border border-(--color-border) bg-white px-4 py-3 text-xs sm:text-sm outline-none transition focus:border-[#3d2c10] resize-none"
                                        placeholder="How can we help you?"
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
                                            <Loader2 size={16} className="animate-spin" /> Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message <Send size={14} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}