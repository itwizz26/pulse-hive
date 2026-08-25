import Link from 'next/link';

const legalLinks = [
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/refunds-cancellations-returns', label: 'Refund & Returns' },
];

export function Footer() {
    return (
        <footer className="w-full border-b border-(--color-border-strong) bg-(--color-background) min-h-20 flex flex-col justify-center">

            {/* =====================================================
                LEGAL LINKS
                ===================================================== */}
            <div className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
                    {legalLinks.map(({ href, label }, index) => (
                        <div
                            key={href}
                            className="flex items-center gap-3"
                        >
                            <Link
                                href={href}
                                className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted) transition-colors hover:text-(--color-gold-dark)"
                            >
                                {label}
                            </Link>

                            {index < legalLinks.length - 1 && (
                                <span
                                    className="text-(--color-gold-dark) text-[10px] font-bold uppercase tracking-widest"
                                    aria-hidden="true"
                                >
                                    |
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* =====================================================
                COPYRIGHT
                ===================================================== */}
            <div className="px-5 pb-5">
                <p className="text-center text-[9px] font-medium tracking-[0.08em] text-(--color-text-muted)">
                    &copy; {new Date().getFullYear()} Glowa Vee Boutique.
                    All rights reserved.
                </p>
            </div>

        </footer>
    );
}